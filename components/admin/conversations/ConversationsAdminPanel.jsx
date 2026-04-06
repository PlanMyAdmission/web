'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@context/AuthProvider';
import { adminRequest } from '@lib/adminApiClient.js';
import AdminPageFrame from '@/components/admin/AdminPageFrame.jsx';
import ConversationsResultsPane from '@/components/admin/conversations/ConversationsResultsPane.jsx';
import { buildConversationSearchText } from '@/components/admin/conversations/conversationUtils.js';

const ConversationsAdminPanel = () => {
  const { authLoading, adminLoading, currentUser, isAdminUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [sessions, setSessions] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [selectedSession, setSelectedSession] = useState(null);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);

  const loadSessions = useCallback(async () => {
    if (!currentUser || !isAdminUser) {
      setSessions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const payload = await adminRequest({
        currentUser,
        url: '/api/admin/chatbot-sessions',
      });

      setSessions(Array.isArray(payload?.sessions) ? payload.sessions : []);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error?.message || 'Failed to load conversations.');
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

    loadSessions();
  }, [adminLoading, authLoading, isAdminUser, loadSessions]);

  const filteredSessions = useMemo(() => {
    const queryText = searchText.trim().toLowerCase();

    return sessions.filter((session) =>
      !queryText || buildConversationSearchText(session).includes(queryText),
    );
  }, [searchText, sessions]);

  const sessionStats = useMemo(
    () =>
      sessions.reduce(
        (totals, session) => {
          totals.messages += Number(session?.messageCount || 0);
          totals.userMessages += Number(session?.userMessageCount || 0);
          totals.botMessages += Number(session?.botMessageCount || 0);
          return totals;
        },
        {
          messages: 0,
          userMessages: 0,
          botMessages: 0,
        },
      ),
    [sessions],
  );

  const emptyMessage = useMemo(() => {
    if (errorMessage) {
      return 'Unable to load conversations right now.';
    }

    if (searchText.trim()) {
      return 'No conversations match the current search.';
    }

    return 'No chatbot conversations stored yet.';
  }, [errorMessage, searchText]);

  useEffect(() => {
    if (!filteredSessions.length) {
      setSelectedSessionId('');
      setSelectedSession(null);
      setMobileDetailOpen(false);
      return;
    }

    const stillVisible = filteredSessions.some(
      (session) => session.sessionId === selectedSessionId,
    );

    if (!stillVisible) {
      setSelectedSessionId(filteredSessions[0].sessionId);
    }
  }, [filteredSessions, selectedSessionId]);

  useEffect(() => {
    if (!selectedSessionId || !currentUser || !isAdminUser) {
      setSelectedSession(null);
      setDetailLoading(false);
      return;
    }

    let cancelled = false;
    setDetailLoading(true);

    adminRequest({
      currentUser,
      url: `/api/admin/chatbot-sessions/${selectedSessionId}`,
    })
      .then((payload) => {
        if (cancelled) {
          return;
        }

        setSelectedSession(payload?.session || null);
        setErrorMessage('');
      })
      .catch((error) => {
        if (cancelled) {
          return;
        }

        setSelectedSession(null);
        setErrorMessage(error?.message || 'Failed to load the conversation detail.');
      })
      .finally(() => {
        if (!cancelled) {
          setDetailLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [currentUser, isAdminUser, selectedSessionId]);

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

  if (authLoading || adminLoading || !currentUser || !isAdminUser) {
    return null;
  }

  return (
    <AdminPageFrame
      eyebrow="Chat Oversight"
      title="Conversation review desk"
      description="Read chatbot sessions like case files, keep transcripts scrollable, and quickly spot where the assistant is drifting or responding poorly."
      stats={[
        {
          label: 'Visible',
          value: filteredSessions.length,
          helper: `${sessions.length} stored sessions`,
        },
        {
          label: 'Messages',
          value: sessionStats.messages,
          helper: 'Total transcript entries',
        },
        {
          label: 'User',
          value: sessionStats.userMessages,
          helper: 'User turns captured',
        },
        {
          label: 'Assistant',
          value: sessionStats.botMessages,
          helper: 'AI turns captured',
        },
      ]}
      toolbar={
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <input
            type="text"
            className="w-full max-w-3xl rounded-lg border border-[#e5e5e5] bg-white px-4 py-3 text-sm text-[#111111] outline-none transition focus:border-[#999999]"
            placeholder="Search by session id, source page, locale, timezone, or message preview"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />

          <div className="rounded-lg border border-[#e5e5e5] bg-white px-4 py-3 text-xs leading-6 text-[#777777]">
            Stored locally and in Firestore for review.
          </div>
        </div>
      }
      errorMessage={errorMessage}
    >
      {isLoading ? (
        <div className="flex h-full items-center justify-center px-6 text-sm text-[#7a6173]">
          Loading conversations...
        </div>
      ) : (
        <ConversationsResultsPane
          filteredSessions={filteredSessions}
          selectedSessionId={selectedSessionId}
          selectedSession={selectedSession}
          detailLoading={detailLoading}
          mobileDetailOpen={mobileDetailOpen}
          emptyMessage={emptyMessage}
          onSessionSelect={(sessionId, openMobileDetail = false) => {
            setSelectedSessionId(sessionId);
            if (openMobileDetail) {
              setMobileDetailOpen(true);
            }
          }}
          onCloseMobileDetail={() => setMobileDetailOpen(false)}
        />
      )}
    </AdminPageFrame>
  );
};

export default ConversationsAdminPanel;
