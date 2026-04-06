import 'server-only';

import { NextResponse } from 'next/server';
import {
  ADMIN_AUTH_PROVIDER,
  ADMIN_USERS_COLLECTION,
  canAccessAdminIdentity,
  getConfiguredAdminEmails,
  normalizeAdminRecord,
} from '@lib/adminAuth.js';
import {
  getFirebaseAdminAuth,
  getFirebaseAdminBucket,
  getFirebaseAdminDb,
  isFirebaseAdminConfigured,
} from '@lib/firebaseAdmin.js';

class AdminApiError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = 'AdminApiError';
    this.status = status;
  }
}

const readBearerToken = (request) => {
  const header = request.headers.get('authorization') || '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : '';
};

export const serializeTimestamp = (value) => {
  if (!value) {
    return '';
  }

  if (typeof value?.toDate === 'function') {
    return value.toDate().toISOString();
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }

  return parsed.toISOString();
};

export const jsonError = (message, status = 400) =>
  NextResponse.json({ error: message }, { status });

export const handleAdminApiError = (error) => {
  if (error instanceof AdminApiError) {
    return jsonError(error.message, error.status);
  }

  return jsonError(error?.message || 'Something went wrong.', 500);
};

export const requireFirebaseAdmin = () => {
  if (!isFirebaseAdminConfigured) {
    throw new AdminApiError(
      'Firebase Admin is not configured. Add the server-side Firebase service account environment variables.',
      503,
    );
  }
};

export const requireAdminRequest = async (request) => {
  requireFirebaseAdmin();

  const token = readBearerToken(request);
  if (!token) {
    throw new AdminApiError('Missing admin authorization token.', 401);
  }

  const auth = getFirebaseAdminAuth();
  const db = getFirebaseAdminDb();
  const decodedToken = await auth.verifyIdToken(token);
  if (decodedToken?.firebase?.sign_in_provider !== ADMIN_AUTH_PROVIDER) {
    throw new AdminApiError(
      'Use a Google account to access admin routes.',
      403,
    );
  }

  const configuredAdminEmails = getConfiguredAdminEmails();
  const adminDoc = await db
    .collection(ADMIN_USERS_COLLECTION)
    .doc(decodedToken.uid)
    .get();
  const adminRecord = normalizeAdminRecord(
    adminDoc.exists ? adminDoc.data() : null,
  );

  if (
    !canAccessAdminIdentity({
      providerId: decodedToken?.firebase?.sign_in_provider,
      email: decodedToken?.email,
      record: adminRecord,
      configuredEmails: configuredAdminEmails,
    })
  ) {
    throw new AdminApiError('This account does not have admin access.', 403);
  }

  return {
    auth,
    bucket: getFirebaseAdminBucket(),
    db,
    decodedToken,
    adminRecord: adminRecord || {
      active: true,
      role: 'admin',
      email: decodedToken?.email || '',
    },
  };
};
