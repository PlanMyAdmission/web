'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@context/AuthProvider';
import { adminRequest } from '@lib/adminApiClient.js';
import { trackAdminAction } from '@lib/analytics.js';
import AdminPageFrame from '@/components/admin/AdminPageFrame.jsx';
import LeadsResultsPane from '@/components/admin/leads/LeadsResultsPane.jsx';
import {
  buildLeadSearchText,
  getLeadStatus,
  LEAD_STATUS_LABELS,
  LEAD_STATUS_OPTIONS,
} from '@/components/admin/leads/leadUtils.js';

const LeadsAdminPanel = () => {
  const { authLoading, adminLoading, currentUser, isAdminUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [leads, setLeads] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const [updatingLeadId, setUpdatingLeadId] = useState('');

  const loadLeads = useCallback(async () => {
    if (!currentUser || !isAdminUser) {
      setLeads([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const payload = await adminRequest({
        currentUser,
        url: '/api/admin/leads',
      });
      setLeads(Array.isArray(payload?.leads) ? payload.leads : []);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error?.message || 'Failed to load leads.');
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, isAdminUser]);

  useEffect(() => {
    if (authLoading || adminLoading) {
      return;
    }

    if (!isAdminUser) {
      setIsLoading(false);
      return;
    }

    loadLeads();
  }, [adminLoading, authLoading, isAdminUser, loadLeads]);

  const filteredLeads = useMemo(() => {
    const queryText = searchText.trim().toLowerCase();

    return leads.filter((lead) => {
      const leadStatus = getLeadStatus(lead);
      if (statusFilter !== 'all' && leadStatus !== statusFilter) {
        return false;
      }

      if (!queryText) {
        return true;
      }

      return buildLeadSearchText(lead).includes(queryText);
    });
  }, [leads, searchText, statusFilter]);

  const statusCounts = useMemo(
    () =>
      leads.reduce(
        (totals, lead) => {
          const status = getLeadStatus(lead);
          totals[status] = (totals[status] || 0) + 1;
          return totals;
        },
        {
          new: 0,
          contacted: 0,
          interested: 0,
          qualified: 0,
          closed: 0,
        },
      ),
    [leads],
  );

  const emptyMessage = useMemo(() => {
    if (errorMessage) {
      return 'Unable to load leads right now.';
    }

    if (searchText.trim() || statusFilter !== 'all') {
      return 'No leads match the current filters.';
    }

    return 'No leads found yet.';
  }, [errorMessage, searchText, statusFilter]);

  const selectedLead = useMemo(
    () => filteredLeads.find((lead) => lead.id === selectedLeadId) || filteredLeads[0] || null,
    [filteredLeads, selectedLeadId],
  );

  useEffect(() => {
    if (!filteredLeads.length) {
      setSelectedLeadId('');
      setMobileDetailOpen(false);
      return;
    }

    const stillVisible = filteredLeads.some((lead) => lead.id === selectedLeadId);
    if (!stillVisible) {
      setSelectedLeadId(filteredLeads[0].id);
    }
  }, [filteredLeads, selectedLeadId]);

  useEffect(() => {
    if (!mobileDetailOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileDetailOpen]);

  const handleStatusChange = async (leadId, nextStatus) => {
    if (!leadId || !nextStatus) {
      return;
    }

    setUpdatingLeadId(leadId);
    try {
      const payload = await adminRequest({
        currentUser,
        url: `/api/admin/leads/${leadId}`,
        method: 'PATCH',
        body: {
          leadStatus: nextStatus,
        },
      });
      const updatedLead = payload?.lead;
      if (!updatedLead?.id) {
        throw new Error('Updated lead response is invalid.');
      }

      setLeads((previous) =>
        previous.map((lead) => (lead.id === updatedLead.id ? updatedLead : lead)),
      );
      trackAdminAction({ action: 'update_status', target: 'lead', status: nextStatus });
      setErrorMessage('');
    } catch (error) {
      trackAdminAction({ action: 'update_status', target: 'lead', status: 'error' });
      setErrorMessage(error?.message || 'Failed to update lead status.');
    } finally {
      setUpdatingLeadId('');
    }
  };

  if (authLoading || adminLoading || !currentUser || !isAdminUser) {
    return null;
  }

  return (
    <AdminPageFrame
      eyebrow="Admissions Pipeline"
      title="Lead command center"
      description="Work through student intent, qualification, and follow-up from one split workspace instead of jumping between raw tables and detail screens."
      stats={[
        {
          label: 'Visible',
          value: filteredLeads.length,
          helper: `${leads.length} total leads`,
        },
        {
          label: 'New',
          value: statusCounts.new,
          helper: 'Needs first response',
        },
        {
          label: 'Qualified',
          value: statusCounts.qualified,
          helper: 'High-intent students',
        },
        {
          label: 'Closed',
          value: statusCounts.closed,
          helper: 'Completed or archived',
        },
      ]}
      toolbar={
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid min-w-0 flex-1 gap-3 lg:grid-cols-[minmax(0,1fr)_200px]">
            <input
              type="text"
              className="w-full rounded-lg border border-[#e5e5e5] bg-white px-4 py-3 text-sm text-[#111111] outline-none transition focus:border-[#999999]"
              placeholder="Search by name, email, phone, country, university, or study plan"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />

            <select
              className="w-full rounded-lg border border-[#e5e5e5] bg-white px-4 py-3 text-sm text-[#111111] outline-none transition focus:border-[#999999]"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">All statuses</option>
              {LEAD_STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {LEAD_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-lg border border-[#e5e5e5] bg-white px-4 py-3 text-xs leading-6 text-[#777777]">
            Prioritize new and qualified leads first.
          </div>
        </div>
      }
      errorMessage={errorMessage}
    >
      {isLoading ? (
        <div className="flex h-full items-center justify-center px-6 text-sm text-[#7a6173]">
          Loading leads...
        </div>
      ) : (
        <LeadsResultsPane
          filteredLeads={filteredLeads}
          selectedLead={selectedLead}
          selectedLeadId={selectedLeadId}
          mobileDetailOpen={mobileDetailOpen}
          updatingLeadId={updatingLeadId}
          emptyMessage={emptyMessage}
          onLeadSelect={(leadId, openMobileDetail = false) => {
            setSelectedLeadId(leadId);
            if (openMobileDetail) {
              setMobileDetailOpen(true);
            }
          }}
          onStatusChange={handleStatusChange}
          onCloseMobileDetail={() => setMobileDetailOpen(false)}
        />
      )}
    </AdminPageFrame>
  );
};

export default LeadsAdminPanel;
