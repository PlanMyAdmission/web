import { NextResponse } from 'next/server';
import { validateJoinUsLead } from '@/lib/leads.js';

const MIN_LEAD_CAPTURE_MS = 3_000;

const validateLeadCaptureContext = (leadContext = {}) => {
  if (
    !leadContext ||
    typeof leadContext !== 'object' ||
    Array.isArray(leadContext)
  ) {
    return 'Lead context is invalid.';
  }

  if (`${leadContext.honeypot || ''}`.trim()) {
    return 'Unable to process this submission.';
  }

  const formStartedAt = Number(leadContext.formStartedAt || 0);
  if (!Number.isFinite(formStartedAt) || formStartedAt <= 0) {
    return 'Submission session is invalid.';
  }

  if (Date.now() - formStartedAt < MIN_LEAD_CAPTURE_MS) {
    return 'Please review your details and try again.';
  }

  return null;
};

export async function POST(request) {
  try {
    const {
      source,
      sourcePage,
      name,
      email,
      phone,
      phoneCountryCode,
      phoneNumber,
      leadContext,
    } = await request.json();

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
      phoneCountryCode,
      phoneNumber,
      sourcePage,
    });
    if (leadValidationError) {
      return NextResponse.json({ error: leadValidationError }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || 'Unable to save the lead right now.' },
      { status: 500 },
    );
  }
}
