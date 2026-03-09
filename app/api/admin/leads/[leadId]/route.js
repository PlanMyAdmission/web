import { FieldValue } from 'firebase-admin/firestore';
import { NextResponse } from 'next/server';
import {
  handleAdminApiError,
  requireAdminRequest,
  serializeTimestamp,
} from '@lib/adminApiServer.js';

const allowedStatuses = new Set([
  'new',
  'contacted',
  'interested',
  'qualified',
  'closed',
]);

const serializeLead = (snapshot) => {
  const data = snapshot.data() || {};

  return {
    id: snapshot.id,
    ...data,
    createdAt: serializeTimestamp(data.createdAt),
    updatedAt: serializeTimestamp(data.updatedAt),
  };
};

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

    const leadRef = db.collection('ai_matchmaker_leads').doc(leadId);
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
    return NextResponse.json({ lead: serializeLead(updatedDoc) });
  } catch (error) {
    return handleAdminApiError(error);
  }
}
