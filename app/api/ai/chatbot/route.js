import { NextResponse } from 'next/server';
import { generateGeminiTextContent, getGeminiText } from '@/lib/ai/gemini.js';
import { enforceRequestRateLimit } from '@/lib/ai/requestGuards.js';
import { getChatbotSystemInstruction } from '@/lib/ai/chatbot.js';
import {
  createChatbotMessage,
  getChatbotMessagesForModel,
  normalizeChatbotSessionId,
  sanitizeChatbotMessages,
  validateChatbotMessages,
  validateChatbotSessionId,
} from '@/lib/chatbotSessions.js';
import { reportError } from '@/lib/logger.js';

export async function POST(request) {
  try {
    const requestPolicyError = await enforceRequestRateLimit({
      request,
      routeKey: 'ai:chatbot',
      limit: 12,
    });

    if (requestPolicyError) {
      return NextResponse.json(
        { error: requestPolicyError.error },
        {
          status: requestPolicyError.status,
          headers: requestPolicyError.retryAfterSeconds
            ? { 'Retry-After': `${requestPolicyError.retryAfterSeconds}` }
            : undefined,
        },
      );
    }

    const { sessionId, messages, metadata } = await request.json();
    const sessionIdError = validateChatbotSessionId(sessionId);
    if (sessionIdError) {
      return NextResponse.json({ error: sessionIdError }, { status: 400 });
    }
    const safeSessionId = normalizeChatbotSessionId(sessionId);

    const validationError = validateChatbotMessages(messages);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const safeMessages = sanitizeChatbotMessages(messages);
    const contents = getChatbotMessagesForModel(safeMessages);

    const { result } = await generateGeminiTextContent({
      contents,
      config: {
        systemInstruction: getChatbotSystemInstruction(),
        temperature: 0.4,
        maxOutputTokens: 500,
      },
    });

    const text = (await getGeminiText(result)).trim();
    if (!text) {
      return NextResponse.json(
        { error: 'The chatbot response came back empty. Please try again.' },
        { status: 502 },
      );
    }

    const assistantMessage = createChatbotMessage({
      role: 'bot',
      content: text,
    });
    return NextResponse.json({
      data: {
        sessionId: safeSessionId,
        message: text,
        assistantMessage,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error?.message ||
          'Something went wrong while sending the chat reply.',
      },
      { status: 500 },
    );
  }
}
