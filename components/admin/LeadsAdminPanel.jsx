'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { useAuth } from '@context/AuthProvider';
import { db } from '@lib/firebase.js';

const STATUS_OPTIONS = ['new', 'contacted', 'qualified', 'closed'];

const toDate = (value) => {
  if (!value) return null;
  if (typeof value?.toDate === 'function') {
    return value.toDate();
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed;
};

const formatDate = (value) => {
  const date = toDate(value);
  if (!date) return '—';
  return date.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const LeadsAdminPanel = () => {
  const { authLoading, currentUser, isAdminUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [leads, setLeads] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [updatingLeadId, setUpdatingLeadId] = useState('');

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAdminUser) {
      setIsLoading(false);
      return;
    }

    const leadsRef = collection(db, 'ai_matchmaker_leads');
    const leadsQuery = query(leadsRef, orderBy('createdAt', 'desc'), limit(500));

    const unsubscribe = onSnapshot(
      leadsQuery,
      (snapshot) => {
        const nextLeads = snapshot.docs.map((leadDoc) => ({
          id: leadDoc.id,
          ...leadDoc.data(),
        }));
        setLeads(nextLeads);
        setErrorMessage('');
        setIsLoading(false);
      },
      (error) => {
        setErrorMessage(error?.message || 'Failed to load leads.');
        setIsLoading(false);
      },
    );

    return () => unsubscribe();
  }, [authLoading, isAdminUser]);

  const filteredLeads = useMemo(() => {
    const queryText = searchText.trim().toLowerCase();

    return leads.filter((lead) => {
      const leadStatus = `${lead?.leadStatus || 'new'}`.toLowerCase();
      if (statusFilter !== 'all' && leadStatus !== statusFilter) {
        return false;
      }

      if (!queryText) {
        return true;
      }

      const studentName = `${lead?.profile?.studentName || ''}`.toLowerCase();
      const programArea = `${lead?.profile?.programArea || ''}`.toLowerCase();
      const countries = `${(lead?.profile?.targetCountries || []).join(' ')}`.toLowerCase();
      const userEmail = `${lead?.user?.email || ''}`.toLowerCase();

      return (
        studentName.includes(queryText) ||
        programArea.includes(queryText) ||
        countries.includes(queryText) ||
        userEmail.includes(queryText)
      );
    });
  }, [leads, searchText, statusFilter]);

  const leadCounts = useMemo(() => {
    const counts = {
      total: leads.length,
      new: 0,
      contacted: 0,
      qualified: 0,
      closed: 0,
    };

    leads.forEach((lead) => {
      const status = `${lead?.leadStatus || 'new'}`.toLowerCase();
      if (Object.prototype.hasOwnProperty.call(counts, status)) {
        counts[status] += 1;
      }
    });

    return counts;
  }, [leads]);

  const handleStatusChange = async (leadId, nextStatus) => {
    if (!leadId || !nextStatus) return;

    setUpdatingLeadId(leadId);
    try {
      await updateDoc(doc(db, 'ai_matchmaker_leads', leadId), {
        leadStatus: nextStatus,
        updatedAt: serverTimestamp(),
        updatedBy: currentUser?.email || null,
      });
    } catch (error) {
      setErrorMessage(error?.message || 'Failed to update lead status.');
    } finally {
      setUpdatingLeadId('');
    }
  };

  if (authLoading || !currentUser || !isAdminUser) return null;

  return (
    <section className="bg-light min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 space-y-4">
        <div className="bg-white rounded-2xl border border-main/20 p-5">
          <h1 className="text-main text-2xl md:text-3xl font-semibold">AI Matchmaker Leads</h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base">
            Manage leads generated from AI University Matchmaker submissions.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
            <div className="border border-main/20 rounded-xl p-3 bg-light">
              <p className="text-xs text-gray-500 uppercase">Total</p>
              <p className="text-xl font-semibold text-main">{leadCounts.total}</p>
            </div>
            <div className="border border-main/20 rounded-xl p-3 bg-light">
              <p className="text-xs text-gray-500 uppercase">New</p>
              <p className="text-xl font-semibold text-main">{leadCounts.new}</p>
            </div>
            <div className="border border-main/20 rounded-xl p-3 bg-light">
              <p className="text-xs text-gray-500 uppercase">Contacted</p>
              <p className="text-xl font-semibold text-main">{leadCounts.contacted}</p>
            </div>
            <div className="border border-main/20 rounded-xl p-3 bg-light">
              <p className="text-xs text-gray-500 uppercase">Qualified</p>
              <p className="text-xl font-semibold text-main">{leadCounts.qualified}</p>
            </div>
            <div className="border border-main/20 rounded-xl p-3 bg-light">
              <p className="text-xs text-gray-500 uppercase">Closed</p>
              <p className="text-xl font-semibold text-main">{leadCounts.closed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-main/20 p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              className="border border-main/30 rounded-lg px-3 py-2"
              placeholder="Search by student, program, country, email"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />
            <select
              className="border border-main/30 rounded-lg px-3 py-2"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">All statuses</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-600 self-center">
              Showing {filteredLeads.length} of {leads.length}
            </p>
          </div>

          {errorMessage && (
            <p className="mt-3 text-sm text-red-600" role="alert">
              {errorMessage}
            </p>
          )}

          {isLoading ? (
            <p className="mt-4 text-gray-600">Loading leads...</p>
          ) : (
            <div className="mt-4 space-y-3">
              {filteredLeads.length === 0 && (
                <p className="text-gray-600">No leads found for this filter.</p>
              )}

              {filteredLeads.map((lead) => {
                const topUniversity = lead?.aiResult?.universities?.[0]?.name || '—';

                return (
                  <div
                    key={lead.id}
                    className="border border-main/20 rounded-xl p-4 bg-[#fff9fc] grid grid-cols-1 md:grid-cols-12 gap-3"
                  >
                    <div className="md:col-span-4 space-y-1">
                      <p className="text-main font-semibold">
                        {lead?.profile?.studentName || 'Unnamed lead'}
                      </p>
                      <p className="text-sm text-gray-700">
                        {lead?.profile?.degreeLevel || '—'} · {lead?.profile?.programArea || '—'}
                      </p>
                      <p className="text-sm text-gray-700">
                        {(lead?.profile?.targetCountries || []).join(', ') || 'No destination'}
                      </p>
                      <p className="text-xs text-gray-500">Created: {formatDate(lead?.createdAt || lead?.generatedAtIso)}</p>
                    </div>

                    <div className="md:col-span-4 space-y-1">
                      <p className="text-sm text-gray-700">
                        Budget: {lead?.profile?.budgetAmount || '—'} {lead?.profile?.budgetCurrency || ''}
                      </p>
                      <p className="text-sm text-gray-700">
                        Score: {lead?.profile?.scoreType || '—'} {lead?.profile?.scoreValue || ''}
                      </p>
                      <p className="text-sm text-gray-700">Top match: {topUniversity}</p>
                      <p className="text-xs text-gray-500">User: {lead?.user?.email || 'Anonymous session'}</p>
                    </div>

                    <div className="md:col-span-4 space-y-2">
                      <label className="block text-xs text-gray-500 uppercase">Lead Status</label>
                      <select
                        className="w-full border border-main/30 rounded-lg px-3 py-2"
                        value={lead?.leadStatus || 'new'}
                        onChange={(event) => handleStatusChange(lead.id, event.target.value)}
                        disabled={updatingLeadId === lead.id}
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={`${lead.id}-${status}`} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500">
                        Updated: {formatDate(lead?.updatedAt || lead?.createdAt || lead?.generatedAtIso)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LeadsAdminPanel;
