import React from 'react';
import LeadDetail, { StatusBadge } from '@/components/admin/leads/LeadDetail.jsx';
import {
  formatLeadDate,
  getLeadDestinationSummary,
  getLeadEmail,
  getLeadName,
  getLeadSourceLabel,
  getLeadStudySummary,
  getLeadStatus,
} from '@/components/admin/leads/leadUtils.js';

const LeadRow = ({ lead, isSelected, onOpen }) => {
  const leadStatus = getLeadStatus(lead);

  return (
    <button
      type="button"
      className={`w-full px-5 py-4 text-left transition-colors ${
        isSelected ? 'bg-[#fafafa]' : 'bg-white hover:bg-[#fafafa]'
      }`}
      onClick={onOpen}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[#111111]">
            {getLeadName(lead) || 'Unnamed lead'}
          </p>
          <p className="mt-0.5 truncate text-xs text-[#888888]">
            {getLeadEmail(lead) || 'Anonymous session'}
          </p>
          <p className="mt-2 line-clamp-1 text-xs text-[#666666]">
            {getLeadStudySummary(lead)}
          </p>
          <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-[#888888]">
            <span>{getLeadSourceLabel(lead)}</span>
            <span>•</span>
            <span>{getLeadDestinationSummary(lead)}</span>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <StatusBadge status={leadStatus} />
          <p className="mt-2 text-[11px] text-[#888888]">
            {formatLeadDate(lead?.updatedAt || lead?.createdAt)}
          </p>
        </div>
      </div>
    </button>
  );
};

const LeadsResultsPane = ({
  filteredLeads,
  selectedLead,
  selectedLeadId,
  mobileDetailOpen,
  updatingLeadId,
  emptyMessage = 'No leads found.',
  onLeadSelect,
  onStatusChange,
  onCloseMobileDetail,
}) => {
  if (filteredLeads.length === 0) {
    return (
      <div className="flex h-full items-center justify-center px-6 text-sm text-[#777777]">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid h-full min-h-0 gap-4 p-4 xl:grid-cols-[minmax(0,1fr)_420px]">
      <section className="min-h-0 overflow-hidden rounded-xl border border-[#e5e5e5]">
        <div className="border-b border-[#e5e5e5] bg-[#fafafa] px-5 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#888888]">
            Lead Queue
          </p>
        </div>

        <div className="pma-admin-scroll min-h-0 max-h-full divide-y divide-[#f0f0f0] overflow-y-auto">
          {filteredLeads.map((lead) => {
            const handleOpenLead = () => {
              const shouldOpenMobileDetail =
                typeof window !== 'undefined' && window.innerWidth < 1290;
              onLeadSelect(lead.id, shouldOpenMobileDetail);
            };

            return (
              <LeadRow
                key={lead.id}
                lead={lead}
                isSelected={selectedLeadId === lead.id}
                onOpen={handleOpenLead}
              />
            );
          })}
        </div>
      </section>

      <aside className="hidden min-h-0 overflow-hidden rounded-xl border border-[#e5e5e5] xl:block">
        <LeadDetail
          lead={selectedLead}
          updatingLeadId={updatingLeadId}
          onStatusChange={onStatusChange}
        />
      </aside>

      {mobileDetailOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/30 xl:hidden"
            onClick={onCloseMobileDetail}
            aria-label="Close lead details"
          />
          <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-full flex-col bg-white shadow-xl sm:max-w-[460px] xl:hidden">
            <div className="flex items-center justify-between border-b border-[#e5e5e5] px-4 py-4">
              <div>
                <p className="text-sm font-semibold text-[#111111]">Lead Detail</p>
                <p className="mt-0.5 text-xs text-[#888888]">
                  {getLeadName(selectedLead) || 'Lead'}
                </p>
              </div>
              <button
                type="button"
                className="rounded-lg border border-[#e5e5e5] px-3 py-2 text-xs font-medium text-[#555555] hover:bg-[#fafafa]"
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
      ) : null}
    </div>
  );
};

export default LeadsResultsPane;
