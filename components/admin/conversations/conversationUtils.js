export const formatConversationDate = (value) => {
  if (!value) {
    return '—';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '—';
  }

  return parsed.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const buildConversationSearchText = (session) =>
  [
    session?.sessionId,
    session?.sourcePage,
    session?.lastUserMessagePreview,
    session?.lastAssistantMessagePreview,
    session?.locale,
    session?.timezone,
  ]
    .join(' ')
    .toLowerCase();

export const getConversationLabel = (session) =>
  session?.sourcePage || 'Chatbot conversation';
