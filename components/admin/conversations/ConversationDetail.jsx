import React from 'react';
import {
  formatConversationDate,
  getConversationLabel,
} from '@/components/admin/conversations/conversationUtils.js';

const DetailRow = ({ label, value }) => (
  <div className="grid gap-1 border-b border-[#f0f0f0] py-3 last:border-b-0">
    <dt className="text-xs font-semibold uppercase tracking-wide text-[#888888]">{label}</dt>
    <dd className="break-words text-sm leading-6 text-[#111111]">{value || '—'}</dd>
  </div>
);

const ConversationDetail = ({ session, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center px-6 text-center text-sm text-[#777777]">
        Loading conversation...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex h-full items-center justify-center px-6 text-center text-sm text-[#777777]">
        Select a conversation to view the transcript.
      </div>
    );
  }

  const messages = Array.isArray(session.messages) ? session.messages : [];

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-[#e5e5e5] px-5 py-4">
        <p className="text-sm font-semibold text-[#111111]">{getConversationLabel(session)}</p>
        <p className="mt-1 break-all font-mono text-xs text-[#888888]">{session.sessionId}</p>
      </div>

      <div className="pma-admin-scroll min-h-0 flex-1 overflow-y-auto bg-[#fafafa] p-4">
        <section className="rounded-xl border border-[#e5e5e5] bg-white">
          <div className="border-b border-[#f0f0f0] px-4 py-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[#888888]">
              Session
            </h3>
          </div>
          <dl className="px-4 py-2">
            <DetailRow label="Created" value={formatConversationDate(session.createdAt)} />
            <DetailRow label="Updated" value={formatConversationDate(session.updatedAt)} />
            <DetailRow label="Last Message" value={formatConversationDate(session.lastMessageAtIso)} />
            <DetailRow label="Messages" value={`${session.messageCount || 0}`} />
            <DetailRow label="User Messages" value={`${session.userMessageCount || 0}`} />
            <DetailRow label="AI Messages" value={`${session.botMessageCount || 0}`} />
            <DetailRow label="Source Page" value={session.sourcePage} />
            <DetailRow label="Locale" value={session.locale} />
            <DetailRow label="Timezone" value={session.timezone} />
            <DetailRow label="User Agent" value={session.userAgent} />
          </dl>
        </section>

        <section className="mt-4 rounded-xl border border-[#e5e5e5] bg-white">
          <div className="flex items-center justify-between border-b border-[#f0f0f0] px-4 py-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#888888]">
                Transcript
              </p>
              <p className="mt-1 text-xs text-[#888888]">{messages.length} messages</p>
            </div>
          </div>

          {messages.length > 0 ? (
            <div className="pma-admin-scroll max-h-[560px] space-y-3 overflow-y-auto p-4">
              {messages.map((message) => {
                const isUser = message.role === 'user';
                const isSystem = message.role === 'system';

                if (isSystem) {
                  return (
                    <div key={message.id} className="flex justify-center">
                      <div className="max-w-[92%] rounded-xl border border-[#e5e5e5] bg-[#f7f7f7] px-3 py-2">
                        <p className="text-center text-xs text-[#555555]">{message.content}</p>
                        <p className="mt-1 text-center text-[10px] text-[#aaaaaa]">
                          {formatConversationDate(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={message.id}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        isUser
                          ? 'rounded-br-sm bg-[#111111] text-white'
                          : 'rounded-bl-sm bg-[#f0f0f0] text-[#111111]'
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                      <p
                        className={`mt-1.5 text-xs ${
                          isUser ? 'text-white/50' : 'text-[#888888]'
                        }`}
                      >
                        {formatConversationDate(message.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-sm text-[#888888]">No messages stored.</div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ConversationDetail;
