import React from 'react';
import LeadDetail, { StatusBadge, StatusSelect } from '@/components/admin/leads/LeadDetail.jsx';
import {
  formatLeadBudget,
  formatLeadDate,
  formatLeadList,
  getLeadStatus,
  LEAD_STATUS_LABELS,
} from '@/components/admin/leads/leadUtils.js';

const LeadsResultsPane = ({
  filteredLeads,
  selectedLead,
  selectedLeadId,
  mobileDetailOpen,
  updatingLeadId,
  onLeadSelect,
  onStatusChange,
  onCloseMobileDetail,
}) => {
  if (filteredLeads.length === 0) {
    return (
      <div className="flex h-full items-center justify-center px-6 text-sm text-[#7a6173]">
        No leads found.
      </div>
    );
  }

  return (
    <div className="grid h-full min-h-0 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="min-h-0 overflow-auto">
        <div className="hidden xl:block">
          <table className="min-w-full divide-y divide-main/10">
            <thead className="sticky top-0 z-10 bg-[#faf7f9]">
              <tr className="text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-main/48">
                <th className="px-4 py-3">Lead</th>
                <th className="px-4 py-3">Study Plan</th>
                <th className="px-4 py-3">Destination</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-main/8 bg-white">
              {filteredLeads.map((lead) => {
                const leadStatus = getLeadStatus(lead);
                const isSelected = selectedLead?.id === lead.id;

                return (
                  <tr
                    key={lead.id}
                    className={`cursor-pointer text-sm text-[#4d394a] transition ${
                      isSelected ? 'bg-[#fff6fa]' : 'hover:bg-[#fcfafb]'
                    }`}
                    onClick={() => onLeadSelect(lead.id)}
                  >
                    <td className="px-4 py-3 align-top">
                      <p className="font-medium text-[#3f1831]">
                        {lead?.profile?.studentName || 'Unnamed lead'}
                      </p>
                      <p className="mt-1 text-xs text-[#8a7385]">
                        {lead?.user?.email || 'Anonymous session'}
                      </p>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <p>{lead?.profile?.degreeLevel || '—'}</p>
                      <p className="mt-1 text-xs text-[#8a7385]">
                        {lead?.profile?.programArea || '—'}
                        {lead?.profile?.specialization
                          ? ` • ${lead.profile.specialization}`
                          : ''}
                      </p>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <p>{formatLeadList(lead?.profile?.targetCountries)}</p>
                      <p className="mt-1 text-xs text-[#8a7385]">
                        {formatLeadBudget(
                          lead?.profile?.budgetAmount,
                          lead?.profile?.budgetCurrency,
                        )}
                      </p>
                    </td>
                    <td
                      className="px-4 py-3 align-top"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <div className="space-y-2">
                        <StatusBadge status={leadStatus} />
                        <StatusSelect
                          leadId={lead.id}
                          value={leadStatus}
                          disabled={updatingLeadId === lead.id}
                          onChange={onStatusChange}
                          compact
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top text-xs text-[#8a7385]">
                      {formatLeadDate(lead?.updatedAt || lead?.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="space-y-2 p-2 xl:hidden">
          {filteredLeads.map((lead) => {
            const leadStatus = getLeadStatus(lead);
            const isSelected = selectedLead?.id === lead.id;

            return (
              <button
                key={lead.id}
                type="button"
                className={`w-full rounded-md border border-main/10 px-4 py-4 text-left transition ${
                  isSelected ? 'bg-[#fff6fa]' : 'bg-white'
                }`}
                onClick={() => onLeadSelect(lead.id, true)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#3f1831]">
                      {lead?.profile?.studentName || 'Unnamed lead'}
                    </p>
                    <p className="mt-1 truncate text-xs text-[#8a7385]">
                      {lead?.user?.email || 'Anonymous session'}
                    </p>
                  </div>
                  <StatusBadge status={leadStatus} />
                </div>
                <p className="mt-3 text-sm text-[#4d394a]">
                  {lead?.profile?.degreeLevel || '—'} • {lead?.profile?.programArea || '—'}
                </p>
                <p className="mt-1 text-xs text-[#8a7385]">
                  {formatLeadList(lead?.profile?.targetCountries)}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <aside className="hidden min-h-0 border-l border-main/10 xl:block">
        <LeadDetail
          lead={selectedLead}
          updatingLeadId={updatingLeadId}
          onStatusChange={onStatusChange}
        />
      </aside>

      {mobileDetailOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/30 xl:hidden"
            onClick={onCloseMobileDetail}
            aria-label="Close lead details"
          />
          <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-full flex-col border-l border-main/10 bg-white shadow-[0_12px_36px_rgba(0,0,0,0.12)] sm:max-w-[420px] xl:hidden">
            <div className="flex items-center justify-between border-b border-main/10 px-4 py-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-main/48">
                  Lead Detail
                </p>
                <p className="mt-1 text-sm font-medium text-[#3f1831]">
                  {selectedLead?.profile?.studentName || 'Lead'}
                </p>
              </div>
              <button
                type="button"
                className="rounded-md border border-main/12 px-3 py-2 text-xs font-medium text-main transition hover:bg-[#fff7fb]"
                onClick={onCloseMobileDetail}
              >
                Close
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-hidden">
              <LeadDetail
                lead={selectedLead}
                updatingLeadId={updatingLeadId}
                onStatusChange={onStatusChange}
              />
            </div>
          </aside>
        </>
      )}
    </div>
  );
};

export default LeadsResultsPane;
