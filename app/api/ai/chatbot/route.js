import { NextResponse } from 'next/server';
import { generateGeminiTextContent, getGeminiText } from '@/lib/ai/gemini.js';
import { getChatbotSystemInstruction } from '@/lib/ai/chatbot.js';
import {
  createChatbotMessage,
  getChatbotMessagesForModel,
  normalizeChatbotSessionId,
  sanitizeChatbotMessages,
  validateChatbotMessages,
  validateChatbotSessionId,
} from '@/lib/chatbot/sessions.js';
import { reportError } from '@/lib/observability/logger.js';

export async function POST(request) {
  try {
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
