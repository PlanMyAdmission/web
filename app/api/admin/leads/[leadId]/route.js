import { FieldValue } from 'firebase-admin/firestore';
import { NextResponse } from 'next/server';
import {
  handleAdminApiError,
  requireAdminRequest,
} from '@lib/adminApiServer.js';
import { LEADS_COLLECTION } from '@lib/leads.js';
import { serializeLeadSnapshot } from '@lib/leads.server.js';

const allowedStatuses = new Set([
  'new',
  'contacted',
  'interested',
  'qualified',
  'closed',
]);

export async function PATCH(request, { params }) {
  try {
    const { db, decodedToken } = await requireAdminRequest(request);
    const leadId = `${params?.leadId || ''}`.trim();
    const body = await request.json();
    const nextStatus = `${body?.leadStatus || ''}`.trim().toLowerCase();

    if (!leadId) {
      return NextResponse.json(
        { error: 'Lead id is required.' },
        { status: 400 },
      );
    }

    if (!allowedStatuses.has(nextStatus)) {
      return NextResponse.json(
        { error: 'Lead status is invalid.' },
        { status: 400 },
      );
    }

    const leadRef = db.collection(LEADS_COLLECTION).doc(leadId);
    const existingDoc = await leadRef.get();
    if (!existingDoc.exists) {
      return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });
    }

    await leadRef.update({
      leadStatus: nextStatus,
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: decodedToken.email || null,
    });

    const updatedDoc = await leadRef.get();
    return NextResponse.json({ lead: serializeLeadSnapshot(updatedDoc) });
  } catch (error) {
    return handleAdminApiError(error);
  }
}
