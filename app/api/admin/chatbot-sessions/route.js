import { NextResponse } from 'next/server';
import {
  handleAdminApiError,
  requireAdminRequest,
} from '@lib/adminApiServer.js';
import { CHATBOT_SESSION_COLLECTION } from '@lib/chatbotSessions.js';
import { serializeChatbotSessionSummary } from '@lib/chatbotSessions.server.js';

export async function GET(request) {
  try {
    const { db } = await requireAdminRequest(request);
    const snapshot = await db
      .collection(CHATBOT_SESSION_COLLECTION)
      .orderBy('updatedAt', 'desc')
      .limit(200)
      .get();

    return NextResponse.json({
      sessions: snapshot.docs.map(serializeChatbotSessionSummary),
    });
  } catch (error) {
    return handleAdminApiError(error);
  }
}
