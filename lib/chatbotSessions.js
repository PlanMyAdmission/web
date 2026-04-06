export const CHATBOT_SESSION_COLLECTION = 'chatbot_sessions';
export const CHATBOT_SOURCE = 'ai_chatbot';
export const CHATBOT_MODEL_MESSAGE_LIMIT = 12;
export const CHATBOT_HISTORY_LIMIT = 40;
export const CHATBOT_MESSAGE_MAX_CHARS = 1500;
export const CHATBOT_SESSION_ID_STORAGE_KEY = 'pma-chatbot-session-id';
export const CHATBOT_MESSAGES_STORAGE_KEY_PREFIX = 'pma-chatbot-messages';
export const CHATBOT_WELCOME_MESSAGE =
  'Ask me about countries, profiles, exams, SOPs, shortlist strategy, or the Plan My Admission tools.';

const SESSION_ID_MAX_LENGTH = 120;
const MESSAGE_ID_MAX_LENGTH = 120;

export const normalizeChatbotRole = (role) => {
  const normalized = `${role || ''}`.trim().toLowerCase();

  if (normalized === 'assistant' || normalized === 'model') {
    return 'bot';
  }

  return normalized === 'user' || normalized === 'bot' ? normalized : '';
};

export const normalizeChatbotSessionId = (value = '') =>
  `${value || ''}`
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .slice(0, SESSION_ID_MAX_LENGTH);

export const getChatbotMessagesStorageKey = (sessionId = '') =>
  `${CHATBOT_MESSAGES_STORAGE_KEY_PREFIX}:${normalizeChatbotSessionId(sessionId)}`;

const normalizeChatbotMessageId = (value = '') =>
  `${value || ''}`
    .trim()
    .replace(/[^a-zA-Z0-9:_-]/g, '')
    .slice(0, MESSAGE_ID_MAX_LENGTH);

const normalizeChatbotTimestamp = (value = '') => {
  const normalized = `${value || ''}`.trim();
  if (!normalized) {
    return '';
  }

  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString();
};

export const createChatbotSessionId = () => {
  const randomValue =
    globalThis.crypto?.randomUUID?.() ||
    `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return normalizeChatbotSessionId(`chat_${randomValue}`);
};

export const createChatbotMessage = ({
  id,
  role,
  type,
  content,
  createdAt,
} = {}) => {
  const normalizedRole = normalizeChatbotRole(role || type);
  const normalizedContent = `${content || ''}`
    .trim()
    .slice(0, CHATBOT_MESSAGE_MAX_CHARS);

  if (!normalizedRole || !normalizedContent) {
    return null;
  }

  return {
    id:
      normalizeChatbotMessageId(id) ||
      `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    role: normalizedRole,
    content: normalizedContent,
    createdAt: normalizeChatbotTimestamp(createdAt) || new Date().toISOString(),
  };
};

export const sanitizeChatbotMessages = (
  messages = [],
  limit = CHATBOT_HISTORY_LIMIT,
) =>
  Array.isArray(messages)
    ? messages
        .filter((message) => message && typeof message === 'object')
        .map((message) => createChatbotMessage(message))
        .filter(Boolean)
        .slice(-limit)
    : [];

export const validateChatbotSessionId = (sessionId = '') => {
  const normalizedSessionId = normalizeChatbotSessionId(sessionId);

  if (!normalizedSessionId) {
    return 'Chat session is invalid. Refresh the page and try again.';
  }

  return null;
};

export const validateChatbotMessages = (messages = []) => {
  if (!Array.isArray(messages) || messages.length === 0) {
    return 'Send a message to start the chat.';
  }

  if (messages.length > CHATBOT_HISTORY_LIMIT) {
    return 'Chat history is too long. Start a new conversation and try again.';
  }

  for (const message of messages) {
    const role = normalizeChatbotRole(message?.role);
    const content = `${message?.content || ''}`.trim();

    if (!role) {
      return 'Chat message role is invalid.';
    }

    if (!content || content.length > CHATBOT_MESSAGE_MAX_CHARS) {
      return 'Chat message content is invalid.';
    }
  }

  const latestMessageRole = normalizeChatbotRole(
    messages[messages.length - 1]?.role,
  );
  if (latestMessageRole !== 'user') {
    return 'Latest chat message must come from the user.';
  }

  return null;
};

export const getChatbotMessagesForModel = (messages = []) =>
  sanitizeChatbotMessages(messages, CHATBOT_HISTORY_LIMIT)
    .slice(-CHATBOT_MODEL_MESSAGE_LIMIT)
    .map((message) => ({
      role: message.role === 'bot' ? 'model' : 'user',
      parts: [
        {
          text: message.content,
        },
      ],
    }));

export const loadStoredChatbotSession = (storage) => {
  try {
    const sessionId = normalizeChatbotSessionId(
      storage?.getItem(CHATBOT_SESSION_ID_STORAGE_KEY) || '',
    );

    if (!sessionId) {
      return null;
    }

    const rawMessages = storage?.getItem(
      getChatbotMessagesStorageKey(sessionId),
    );
    const parsedMessages = rawMessages ? JSON.parse(rawMessages) : [];
    const messages = sanitizeChatbotMessages(parsedMessages);

    return {
      sessionId,
      messages,
    };
  } catch (_error) {
    return null;
  }
};

export const saveStoredChatbotSession = (
  storage,
  { sessionId, messages } = {},
) => {
  const normalizedSessionId = normalizeChatbotSessionId(sessionId);

  if (!storage || !normalizedSessionId) {
    return;
  }

  storage.setItem(CHATBOT_SESSION_ID_STORAGE_KEY, normalizedSessionId);
  storage.setItem(
    getChatbotMessagesStorageKey(normalizedSessionId),
    JSON.stringify(sanitizeChatbotMessages(messages)),
  );
};
