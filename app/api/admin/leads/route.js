import { NextResponse } from 'next/server';
import {
  handleAdminApiError,
  requireAdminRequest,
  serializeTimestamp,
} from '@lib/adminApiServer.js';

const serializeLead = (snapshot) => {
  const data = snapshot.data() || {};

  return {
    id: snapshot.id,
    ...data,
    createdAt: serializeTimestamp(data.createdAt),
    updatedAt: serializeTimestamp(data.updatedAt),
  };
};

export async function GET(request) {
  try {
    const { db } = await requireAdminRequest(request);
    const snapshot = await db
      .collection('ai_matchmaker_leads')
      .orderBy('createdAt', 'desc')
      .limit(500)
      .get();

    return NextResponse.json({
      leads: snapshot.docs.map(serializeLead),
    });
  } catch (error) {
    return handleAdminApiError(error);
  }
}
