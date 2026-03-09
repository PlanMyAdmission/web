import 'server-only';

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const hasFirestorePublicConfig = Boolean(projectId) && Boolean(apiKey);
const FIRESTORE_BASE_URL = hasFirestorePublicConfig
  ? `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`
  : '';

const parseFirestoreValue = (value) => {
  if (!value || typeof value !== 'object') {
    return null;
  }

  if ('nullValue' in value) return null;
  if ('stringValue' in value) return value.stringValue || '';
  if ('booleanValue' in value) return Boolean(value.booleanValue);
  if ('integerValue' in value) return Number(value.integerValue || 0);
  if ('doubleValue' in value) return Number(value.doubleValue || 0);
  if ('timestampValue' in value) return value.timestampValue || '';
  if ('mapValue' in value)
    return parseFirestoreFields(value.mapValue?.fields || {});
  if ('arrayValue' in value) {
    return Array.isArray(value.arrayValue?.values)
      ? value.arrayValue.values.map(parseFirestoreValue)
      : [];
  }

  return null;
};

const parseFirestoreFields = (fields = {}) =>
  Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [
      key,
      parseFirestoreValue(value),
    ]),
  );

const getDocumentId = (name = '') => `${name}`.split('/').pop() || '';

const buildUrl = (path) => `${FIRESTORE_BASE_URL}${path}?key=${apiKey}`;

const fetchJson = async (url, options = {}) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    return null;
  }

  return response.json();
};

export const getPublicDocument = async (
  collectionId,
  documentId,
  revalidate = 3600,
) => {
  if (!hasFirestorePublicConfig || !collectionId || !documentId) {
    return null;
  }

  const payload = await fetchJson(buildUrl(`/${collectionId}/${documentId}`), {
    method: 'GET',
    next: { revalidate },
  });

  if (!payload?.name) {
    return null;
  }

  return {
    id: getDocumentId(payload.name),
    ...parseFirestoreFields(payload.fields || {}),
    createTime: payload.createTime || '',
    updateTime: payload.updateTime || '',
  };
};

export const runPublicQuery = async ({
  collectionId,
  filters = [],
  limit,
  orderBy = [],
}) => {
  if (!hasFirestorePublicConfig || !collectionId) {
    return [];
  }

  const structuredQuery = {
    from: [{ collectionId }],
  };

  if (filters.length === 1) {
    structuredQuery.where = filters[0];
  } else if (filters.length > 1) {
    structuredQuery.where = {
      compositeFilter: {
        op: 'AND',
        filters,
      },
    };
  }

  if (limit) {
    structuredQuery.limit = limit;
  }

  if (orderBy.length) {
    structuredQuery.orderBy = orderBy;
  }

  const payload = await fetchJson(buildUrl(':runQuery'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ structuredQuery }),
  });

  if (!Array.isArray(payload)) {
    return [];
  }

  return payload
    .map((entry) => entry?.document)
    .filter(Boolean)
    .map((document) => ({
      id: getDocumentId(document.name),
      ...parseFirestoreFields(document.fields || {}),
      createTime: document.createTime || '',
      updateTime: document.updateTime || '',
    }));
};

export const buildStorageMediaUrl = (path) => {
  if (!path || !storageBucket) {
    return '';
  }

  return `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/${encodeURIComponent(path)}?alt=media`;
};

export const stringEqualsFilter = (fieldPath, value) => ({
  fieldFilter: {
    field: { fieldPath },
    op: 'EQUAL',
    value: { stringValue: `${value || ''}` },
  },
});
