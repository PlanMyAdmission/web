import {
  getFirebaseAdminDb,
  isFirebaseAdminConfigured,
} from '@lib/firebaseAdmin.js';
import { reportError } from '@lib/logger.js';

const WINDOW_MS = 10 * 60 * 1000;
const DEFAULT_LIMIT = 8;
const MAX_JSON_BYTES = 1_000_000;
const MAX_PDF_BYTES = 4 * 1024 * 1024;
const MIN_LEAD_CAPTURE_MS = 3_000;
const RATE_LIMIT_COLLECTION = 'api_rate_limits';

const globalStore = globalThis;
const rateLimitStore = globalStore.__pmaAiRateLimitStore || new Map();
globalStore.__pmaAiRateLimitStore = rateLimitStore;

const cleanupRateLimitStore = (now) => {
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }
};

export const getClientAddress = (request) => {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  return request.headers.get('x-real-ip') || 'unknown';
};

export const estimateBase64Bytes = (base64 = '') => {
  const normalized = `${base64 || ''}`.trim();
  if (!normalized) {
    return 0;
  }

  const padding = normalized.endsWith('==')
    ? 2
    : normalized.endsWith('=')
      ? 1
      : 0;
  return Math.floor((normalized.length * 3) / 4) - padding;
};

const buildRateLimitDocId = (routeKey, clientAddress, windowKey) =>
  `${routeKey}:${clientAddress}:${windowKey}`.replace(/\//g, '_');

const enforceDistributedAiRequestPolicy = async ({
  routeKey,
  clientAddress,
  limit,
  now,
}) => {
  const db = getFirebaseAdminDb();
  const windowKey = Math.floor(now / WINDOW_MS);
  const resetAtMs = (windowKey + 1) * WINDOW_MS;
  const expiresAtMs = (windowKey + 2) * WINDOW_MS;
  const docRef = db
    .collection(RATE_LIMIT_COLLECTION)
    .doc(buildRateLimitDocId(routeKey, clientAddress, windowKey));

  const result = await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(docRef);
    const count =
      (snapshot.exists ? Number(snapshot.data()?.count || 0) : 0) + 1;

    if (count > limit) {
      return {
        limited: true,
        resetAtMs,
      };
    }

    transaction.set(
      docRef,
      {
        routeKey,
        clientAddress,
        count,
        windowKey,
        resetAt: new Date(resetAtMs),
        expiresAt: new Date(expiresAtMs),
        updatedAt: new Date(now),
      },
      { merge: true },
    );

    return { limited: false };
  });

  if (result?.limited) {
    return {
      error: 'Too many requests. Please wait a few minutes and try again.',
      status: 429,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((result.resetAtMs - now) / 1000),
      ),
    };
  }

  return null;
};

const enforceInMemoryAiRequestPolicy = ({
  routeKey,
  clientAddress,
  limit,
  now,
}) => {
  cleanupRateLimitStore(now);

  const bucketKey = `${routeKey}:${clientAddress}`;
  const existing = rateLimitStore.get(bucketKey);

  if (!existing || existing.resetAt <= now) {
    rateLimitStore.set(bucketKey, {
      count: 1,
      resetAt: now + WINDOW_MS,
    });
    return null;
  }

  if (existing.count >= limit) {
    return {
      error: 'Too many requests. Please wait a few minutes and try again.',
      status: 429,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((existing.resetAt - now) / 1000),
      ),
    };
  }

  existing.count += 1;
  rateLimitStore.set(bucketKey, existing);
  return null;
};

export const enforceRequestRateLimit = async ({
  request,
  routeKey,
  limit = DEFAULT_LIMIT,
}) => {
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > MAX_JSON_BYTES) {
    return {
      error: 'Request body is too large.',
      status: 413,
    };
  }

  const now = Date.now();
  const clientAddress = getClientAddress(request);

  if (isFirebaseAdminConfigured) {
    try {
      return await enforceDistributedAiRequestPolicy({
        routeKey,
        clientAddress,
        limit,
        now,
      });
    } catch (error) {
      reportError('Falling back to in-memory AI rate limit store:', error);
    }
  }

  return enforceInMemoryAiRequestPolicy({
    routeKey,
    clientAddress,
    limit,
    now,
  });
};

export const enforceAiRequestPolicy = enforceRequestRateLimit;

export const validatePdfPayload = (pdfBase64, pdfMimeType) => {
  if (!pdfBase64) {
    return null;
  }

  const normalizedMime = `${pdfMimeType || ''}`.trim().toLowerCase();
  if (normalizedMime && normalizedMime !== 'application/pdf') {
    return 'Only PDF uploads are supported.';
  }

  const sizeBytes = estimateBase64Bytes(pdfBase64);
  if (sizeBytes > MAX_PDF_BYTES) {
    return 'PDF file is too large. Keep uploads under 4 MB.';
  }

  return null;
};

const isShortString = (value, maxLength) =>
  typeof value === 'string' && value.trim().length <= maxLength;

const isOptionalString = (value, maxLength) =>
  value === null ||
  value === undefined ||
  value === '' ||
  isShortString(value, maxLength);

const isOptionalStringArray = (value, maxItems, maxLength) =>
  value === null ||
  value === undefined ||
  (Array.isArray(value) &&
    value.length <= maxItems &&
    value.every(
      (item) => typeof item === 'string' && item.trim().length <= maxLength,
    ));

const ESSAY_DOCUMENT_TYPES = new Set([
  'statement_of_purpose',
  'personal_statement',
  'supplemental_essay',
]);

const ESSAY_REVIEW_FOCUS_AREAS = new Set([
  'storytelling',
  'authenticity',
  'structure',
  'grammar',
  'school_fit',
  'clarity',
]);

export const validateUniversityMatchRequest = (searchProfile = {}) => {
  if (
    !searchProfile ||
    typeof searchProfile !== 'object' ||
    Array.isArray(searchProfile)
  ) {
    return 'Search profile is invalid.';
  }

  if (!isOptionalString(searchProfile.studentName, 120))
    return 'Student name is too long.';
  if (!isOptionalString(searchProfile.degreeLevel, 40))
    return 'Degree level is invalid.';
  if (!isOptionalString(searchProfile.programArea, 80))
    return 'Program area is invalid.';
  if (!isOptionalString(searchProfile.specialization, 120))
    return 'Specialization is too long.';
  if (!isOptionalString(searchProfile.scoreType, 40))
    return 'Score type is invalid.';
  if (!isOptionalString(searchProfile.scoreValue, 40))
    return 'Score value is invalid.';
  if (!isOptionalString(searchProfile.boardOrUniversity, 120))
    return 'Board/University is too long.';
  if (!isOptionalString(searchProfile.englishTestType, 40))
    return 'English test type is invalid.';
  if (!isOptionalString(searchProfile.englishTestScore, 40))
    return 'English test score is invalid.';
  if (!isOptionalString(searchProfile.budgetAmount, 40))
    return 'Budget is invalid.';
  if (!isOptionalString(searchProfile.budgetCurrency, 12))
    return 'Budget currency is invalid.';
  if (!isOptionalString(searchProfile.fundingPlan, 60))
    return 'Funding plan is invalid.';
  if (!isOptionalString(searchProfile.scholarshipNeed, 30))
    return 'Scholarship need is invalid.';
  if (!isOptionalString(searchProfile.riskComfort, 30))
    return 'Risk comfort is invalid.';
  if (!isOptionalStringArray(searchProfile.contactPreferences, 3, 40))
    return 'Contact preference is invalid.';
  if (!isOptionalString(searchProfile.query, 1000))
    return 'Additional notes are too long.';
  if (!isOptionalStringArray(searchProfile.targetCountries, 5, 60))
    return 'Target countries are invalid.';
  if (!isOptionalStringArray(searchProfile.familyPriorityTop3, 3, 60))
    return 'Family priorities are invalid.';

  return null;
};

export const validateAdmissionReportRequest = (formData = {}) => {
  if (!formData || typeof formData !== 'object' || Array.isArray(formData)) {
    return 'Profile form data is invalid.';
  }

  const checks = [
    ['firstName', 80],
    ['lastName', 80],
    ['email', 180],
    ['phoneNumber', 30],
    ['gender', 30],
    ['nationality', 80],
    ['address', 240],
    ['country', 80],
    ['state', 80],
    ['city', 80],
    ['zipCode', 20],
    ['educationLevel', 60],
    ['institutionName', 160],
    ['fieldOfStudy', 120],
    ['cgpaOrPercentage', 40],
    ['graduationYear', 10],
    ['workExperience', 40],
    ['experienceDetails', 1200],
    ['preferredCountry', 80],
    ['preferredCourse', 120],
    ['budgetRange', 80],
    ['intake', 40],
    ['careerGoals', 1200],
    ['extraNotes', 1200],
    ['ieltsScore', 20],
    ['toeflScore', 20],
    ['greScore', 20],
    ['gmatScore', 20],
  ];

  for (const [field, maxLength] of checks) {
    if (!isOptionalString(formData[field], maxLength)) {
      return `${field} is invalid.`;
    }
  }

  if (!isOptionalStringArray(formData.preferredSpecializations, 6, 80)) {
    return 'Preferred specializations are invalid.';
  }

  return null;
};

export const validateEssayReviewRequest = (reviewForm = {}) => {
  if (
    !reviewForm ||
    typeof reviewForm !== 'object' ||
    Array.isArray(reviewForm)
  ) {
    return 'Essay review payload is invalid.';
  }

  if (!ESSAY_DOCUMENT_TYPES.has(reviewForm.documentType)) {
    return 'Document type is invalid.';
  }

  const checks = [
    ['targetUniversity', 160],
    ['targetProgram', 160],
    ['targetCountry', 80],
    ['prompt', 1800],
    ['wordLimit', 10],
    ['applicantContext', 1800],
    ['essayText', 15000],
  ];

  for (const [field, maxLength] of checks) {
    if (!isOptionalString(reviewForm[field], maxLength)) {
      return `${field} is invalid.`;
    }
  }

  if (
    !Array.isArray(reviewForm.focusAreas) ||
    reviewForm.focusAreas.length > 4 ||
    reviewForm.focusAreas.some(
      (item) =>
        typeof item !== 'string' ||
        !ESSAY_REVIEW_FOCUS_AREAS.has(item) ||
        item.trim().length > 40,
    )
  ) {
    return 'Review focus areas are invalid.';
  }

  return null;
};

export const validateLeadCaptureContext = (leadContext = {}) => {
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
