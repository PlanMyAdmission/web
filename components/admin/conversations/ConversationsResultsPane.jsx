import React from 'react';
import ConversationDetail from '@/components/admin/conversations/ConversationDetail.jsx';
import {
  formatConversationDate,
  getConversationLabel,
} from '@/components/admin/conversations/conversationUtils.js';

const SessionRow = ({ session, isSelected, onOpen }) => (
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
          {getConversationLabel(session)}
        </p>
        <p className="mt-0.5 break-all text-xs text-[#888888]">{session.sessionId}</p>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#666666]">
          {session.lastUserMessagePreview || 'No user message preview.'}
        </p>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-xs font-medium text-[#111111]">{session.messageCount || 0}</p>
        <p className="mt-1 text-[11px] text-[#888888]">
          {formatConversationDate(session.updatedAt || session.lastMessageAtIso)}
        </p>
      </div>
    </div>
  </button>
);

const ConversationsResultsPane = ({
  filteredSessions,
  selectedSessionId,
  selectedSession,
  detailLoading,
  mobileDetailOpen,
  emptyMessage = 'No conversations found.',
  onSessionSelect,
  onCloseMobileDetail,
}) => {
  if (filteredSessions.length === 0) {
    return (
      <div className="flex h-full items-center justify-center px-6 text-sm text-[#777777]">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid h-full min-h-0 gap-4 p-4 xl:grid-cols-[minmax(0,1fr)_440px]">
      <section className="min-h-0 overflow-hidden rounded-xl border border-[#e5e5e5]">
        <div className="border-b border-[#e5e5e5] bg-[#fafafa] px-5 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#888888]">
            Stored Chats
          </p>
        </div>

        <div className="pma-admin-scroll min-h-0 max-h-full divide-y divide-[#f0f0f0] overflow-y-auto">
          {filteredSessions.map((session) => {
            const handleOpenSession = () => {
              const shouldOpenMobileDetail =
                typeof window !== 'undefined' && window.innerWidth < 1290;
              onSessionSelect(session.sessionId, shouldOpenMobileDetail);
            };

            return (
              <SessionRow
                key={session.sessionId}
                session={session}
                isSelected={selectedSessionId === session.sessionId}
                onOpen={handleOpenSession}
              />
            );
          })}
        </div>
      </section>

      <aside className="hidden min-h-0 overflow-hidden rounded-xl border border-[#e5e5e5] xl:block">
        <ConversationDetail session={selectedSession} isLoading={detailLoading} />
      </aside>

      {mobileDetailOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/30 xl:hidden"
            onClick={onCloseMobileDetail}
            aria-label="Close conversation details"
          />
          <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-full flex-col bg-white shadow-xl sm:max-w-[500px] xl:hidden">
            <div className="flex items-center justify-between border-b border-[#e5e5e5] px-4 py-4">
              <div>
                <p className="text-sm font-semibold text-[#111111]">Conversation Detail</p>
                <p className="mt-0.5 text-xs text-[#888888]">
                  {getConversationLabel(selectedSession)}
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
              <ConversationDetail session={selectedSession} isLoading={detailLoading} />
            </div>
          </aside>
        </>
      ) : null}
    </div>
  );
};

export default ConversationsResultsPane;
