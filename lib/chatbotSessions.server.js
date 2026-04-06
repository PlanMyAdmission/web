import 'server-only';

import { FieldValue } from 'firebase-admin/firestore';
import {
  CHATBOT_SESSION_COLLECTION,
  CHATBOT_SOURCE,
  normalizeChatbotSessionId,
  sanitizeChatbotMessages,
} from '@lib/chatbotSessions.js';
import { serializeTimestamp } from '@lib/adminApiServer.js';

const sanitizeText = (value, maxLength = 240) =>
  `${value || ''}`.trim().slice(0, maxLength);

const getMessagePreview = (value, maxLength = 180) =>
  sanitizeText(value, maxLength);

const getLastMessageByRole = (messages = [], role = 'user') =>
  [...messages].reverse().find((message) => message.role === role) || null;

const serializeStoredMessages = (messages = []) =>
  sanitizeChatbotMessages(messages).map((message) => ({
    id: message.id,
    role: message.role,
    content: message.content,
    createdAt: message.createdAt,
  }));

export const serializeChatbotSessionSummary = (snapshot) => {
  const data = snapshot.data() || {};

  return {
    id: snapshot.id,
    sessionId: data.sessionId || snapshot.id,
    source: data.source || CHATBOT_SOURCE,
    sourcePage: data.sourcePage || '',
    locale: data.locale || '',
    timezone: data.timezone || '',
    messageCount: Number(data.messageCount || 0),
    userMessageCount: Number(data.userMessageCount || 0),
    botMessageCount: Number(data.botMessageCount || 0),
    lastMessageAtIso: data.lastMessageAtIso || '',
    lastUserMessagePreview: data.lastUserMessagePreview || '',
    lastAssistantMessagePreview: data.lastAssistantMessagePreview || '',
    createdAt: serializeTimestamp(data.createdAt),
    updatedAt: serializeTimestamp(data.updatedAt),
  };
};

export const serializeChatbotSessionDetail = (snapshot) => {
  const data = snapshot.data() || {};

  return {
    ...serializeChatbotSessionSummary(snapshot),
    userAgent: data.userAgent || '',
    messages: serializeStoredMessages(data.messages),
  };
};

export const upsertChatbotSession = async ({
  db,
  sessionId,
  messages,
  metadata,
}) => {
  const normalizedSessionId = normalizeChatbotSessionId(sessionId);
  const safeMessages = serializeStoredMessages(messages);

  if (!normalizedSessionId || safeMessages.length === 0) {
    return null;
  }

  const lastUserMessage = getLastMessageByRole(safeMessages, 'user');
  const lastAssistantMessage = getLastMessageByRole(safeMessages, 'bot');
  const sessionRef = db
    .collection(CHATBOT_SESSION_COLLECTION)
    .doc(normalizedSessionId);
  const existingDoc = await sessionRef.get();

  const payload = {
    sessionId: normalizedSessionId,
    source: CHATBOT_SOURCE,
    sourcePage: sanitizeText(metadata?.pagePath, 160),
    locale: sanitizeText(metadata?.locale, 40),
    timezone: sanitizeText(metadata?.timezone, 80),
    userAgent: sanitizeText(metadata?.userAgent, 400),
    messageCount: safeMessages.length,
    userMessageCount: safeMessages.filter((message) => message.role === 'user')
      .length,
    botMessageCount: safeMessages.filter((message) => message.role === 'bot')
      .length,
    lastMessageAtIso: safeMessages[safeMessages.length - 1]?.createdAt || '',
    lastUserMessagePreview: getMessagePreview(lastUserMessage?.content),
    lastAssistantMessagePreview: getMessagePreview(
      lastAssistantMessage?.content,
    ),
    messages: safeMessages,
    updatedAt: FieldValue.serverTimestamp(),
  };

  if (!existingDoc.exists) {
    payload.createdAt = FieldValue.serverTimestamp();
  }

  await sessionRef.set(payload, { merge: true });
  return sessionRef;
};
