import { NextResponse } from 'next/server';
import {
  enforceRequestRateLimit,
  validateLeadCaptureContext,
} from '@lib/ai/requestGuards.js';
import {
  getFirebaseAdminDb,
  isFirebaseAdminConfigured,
} from '@lib/firebaseAdmin.js';
import { buildJoinUsLead, validateJoinUsLead } from '@lib/leads.js';
import { createLeadRecord } from '@lib/leads.server.js';

export async function POST(request) {
  try {
    const requestPolicyError = await enforceRequestRateLimit({
      request,
      routeKey: 'lead:public-capture',
      limit: 4,
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

    const { source, sourcePage, name, email, phone, leadContext } =
      await request.json();

    if (source !== 'join_us') {
      return NextResponse.json(
        { error: 'Lead source is invalid.' },
        { status: 400 },
      );
    }

    const leadContextError = validateLeadCaptureContext(leadContext);
    if (leadContextError) {
      return NextResponse.json({ error: leadContextError }, { status: 400 });
    }

    const leadValidationError = validateJoinUsLead({
      name,
      email,
      phone,
      sourcePage,
    });
    if (leadValidationError) {
      return NextResponse.json({ error: leadValidationError }, { status: 400 });
    }

    if (!isFirebaseAdminConfigured) {
      return NextResponse.json(
        { error: 'Lead capture is not configured on the server.' },
        { status: 503 },
      );
    }

    const db = getFirebaseAdminDb();
    await createLeadRecord({
      db,
      payload: buildJoinUsLead({ name, email, phone, sourcePage }),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || 'Unable to save the lead right now.' },
      { status: 500 },
    );
  }
}
