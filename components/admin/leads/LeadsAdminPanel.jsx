'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@context/AuthProvider';
import { adminRequest } from '@lib/adminApiClient.js';
import { trackAdminAction } from '@lib/analytics.js';
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
    <section className="flex min-h-full min-w-0 flex-col gap-3">
      <div className="flex flex-col gap-3 border border-main/10 bg-white px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <input
            type="text"
            className="w-full rounded-md border border-main/12 bg-white px-3 py-2 text-sm text-[#442337] outline-none transition focus:border-main/28"
            placeholder="Search by name, email, phone, source, or study plan"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 lg:w-auto">
          <select
            className="w-full rounded-md border border-main/12 bg-white px-3 py-2 text-sm text-[#442337] outline-none transition focus:border-main/28 lg:w-[180px]"
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
      </div>

      {errorMessage && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-hidden border border-main/10 bg-white">
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
      </div>
    </section>
  );
};

export default LeadsAdminPanel;
