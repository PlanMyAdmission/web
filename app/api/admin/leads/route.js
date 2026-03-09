import { NextResponse } from 'next/server';
import {
  handleAdminApiError,
  requireAdminRequest,
} from '@lib/adminApiServer.js';
import { LEADS_COLLECTION } from '@lib/leads.js';
import { serializeLeadSnapshot } from '@lib/leads.server.js';

export async function GET(request) {
  try {
    const { db } = await requireAdminRequest(request);
    const snapshot = await db
      .collection(LEADS_COLLECTION)
      .orderBy('createdAt', 'desc')
      .limit(500)
      .get();

    return NextResponse.json({
      leads: snapshot.docs.map(serializeLeadSnapshot),
    });
  } catch (error) {
    return handleAdminApiError(error);
  }
}
