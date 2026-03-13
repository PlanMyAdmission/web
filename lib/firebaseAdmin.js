import 'server-only';

import {
  applicationDefault,
  cert,
  getApps,
  initializeApp,
} from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

const serviceAccountConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

const hasServiceAccountConfig =
  Boolean(serviceAccountConfig.projectId) &&
  Boolean(serviceAccountConfig.clientEmail) &&
  Boolean(serviceAccountConfig.privateKey);

const hasApplicationDefaultCredentials =
  Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS) ||
  Boolean(process.env.GOOGLE_CLOUD_PROJECT) ||
  Boolean(process.env.FIREBASE_CONFIG);

export const isFirebaseAdminConfigured =
  hasServiceAccountConfig || hasApplicationDefaultCredentials;

const getCredential = () => {
  if (hasServiceAccountConfig) {
    return cert(serviceAccountConfig);
  }

  if (hasApplicationDefaultCredentials) {
    return applicationDefault();
  }

  return null;
};

export const getFirebaseAdminApp = () => {
  const existingApp = getApps().find(
    (app) => app.name === 'planmyadmission-admin',
  );
  if (existingApp) {
    return existingApp;
  }

  const credential = getCredential();
  if (!credential) {
    throw new Error(
      'Firebase Admin is not configured. Add FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY, or provide application default credentials.',
    );
  }

  return initializeApp(
    {
      credential,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    },
    'planmyadmission-admin',
  );
};

export const getFirebaseAdminAuth = () => getAuth(getFirebaseAdminApp());
export const getFirebaseAdminDb = () => getFirestore(getFirebaseAdminApp());
export const getFirebaseAdminStorage = () => getStorage(getFirebaseAdminApp());
export const getFirebaseAdminBucket = () => getFirebaseAdminStorage().bucket();
