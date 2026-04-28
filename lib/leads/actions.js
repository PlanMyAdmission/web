'use server';

import { validateJoinUsLead, buildJoinUsLead } from '@/lib/leads/validation.js';
import { gatewayFetch } from '@/lib/api/gateway.js';

const MIN_LEAD_CAPTURE_MS = 3_000;

const validateLeadContext = (leadContext = {}) => {
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

export async function submitLead({
  source,
  sourcePage,
  name,
  email,
  phone,
  phoneCountryCode,
  phoneNumber,
  leadContext,
}) {
  if (source !== 'join_us') {
    return { error: 'Lead source is invalid.' };
  }

  const contextError = validateLeadContext(leadContext);
  if (contextError) return { error: contextError };

  const validationError = validateJoinUsLead({
    name,
    email,
    phone,
    phoneCountryCode,
    phoneNumber,
    sourcePage,
  });
  if (validationError) return { error: validationError };

  const payload = buildJoinUsLead({
    name,
    email,
    phone,
    phoneCountryCode,
    phoneNumber,
    sourcePage,
  });

  await gatewayFetch('/lead/lead', { method: 'POST', body: payload });

  return { ok: true };
}
