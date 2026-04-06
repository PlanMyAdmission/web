import { NextResponse } from 'next/server';
import {
  handleAdminApiError,
  requireAdminRequest,
} from '@lib/adminApiServer.js';
import {
  CHATBOT_SESSION_COLLECTION,
  normalizeChatbotSessionId,
} from '@lib/chatbotSessions.js';
import { serializeChatbotSessionDetail } from '@lib/chatbotSessions.server.js';

export async function GET(request, { params }) {
  try {
    const { db } = await requireAdminRequest(request);
    const sessionId = normalizeChatbotSessionId(params?.sessionId);

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Chat session is invalid.' },
        { status: 400 },
      );
    }

    const sessionDoc = await db
      .collection(CHATBOT_SESSION_COLLECTION)
      .doc(sessionId)
      .get();

    if (!sessionDoc.exists) {
      return NextResponse.json(
        { error: 'Chat session not found.' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      session: serializeChatbotSessionDetail(sessionDoc),
    });
  } catch (error) {
    return handleAdminApiError(error);
  }
}
