import 'server-only';

import { FieldValue } from 'firebase-admin/firestore';
import { LEADS_COLLECTION } from '@lib/leads.js';
import { serializeTimestamp } from '@lib/adminApiServer.js';

export const serializeLeadSnapshot = (snapshot) => {
  const data = snapshot.data() || {};

  return {
    id: snapshot.id,
    ...data,
    createdAt: serializeTimestamp(data.createdAt),
    updatedAt: serializeTimestamp(data.updatedAt),
  };
};

export const createLeadRecord = async ({ db, payload }) => {
  const leadRef = db.collection(LEADS_COLLECTION).doc();

  await leadRef.set({
    ...payload,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return leadRef;
};
