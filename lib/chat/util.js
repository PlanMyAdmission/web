import { CHATBOT_MESSAGE_MAX_CHARS } from '@/lib/chat/constants.js';

const generateId = () =>
  globalThis.crypto?.randomUUID?.() ||
  `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const createMessage = ({
  id,
  role,
  content,
  streaming = false,
} = {}) => {
  const normalizedRole = role === 'assistant' ? 'bot' : role;
  if (normalizedRole !== 'user' && normalizedRole !== 'bot') return null;
  return {
    id: id || generateId(),
    role: normalizedRole,
    content: `${content || ''}`.slice(0, CHATBOT_MESSAGE_MAX_CHARS),
    streaming,
  };
};

export const mapServerItem = (item) =>
  createMessage({
    role: item?.role,
    content: item?.content,
  });
