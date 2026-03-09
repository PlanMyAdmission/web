import 'server-only';

import {
  buildStorageMediaUrl,
  getPublicDocument,
  runPublicQuery,
  stringEqualsFilter,
} from '@lib/firestorePublic.js';

export const getExploreRecordById = async (recordId) => {
  const record = await getPublicDocument('explore_university', recordId, 3600);
  return record
    ? {
        recordId: record.id,
        ...record,
      }
    : null;
};

export const getExploreRecordImageUrl = (record) => {
  if (!record?.UniversityId) {
    return '/images/seo/og-default.svg';
  }

  return (
    buildStorageMediaUrl(`logos/${record.UniversityId}.png`) ||
    '/images/seo/og-default.svg'
  );
};

export const getUniversityBySlug = async (slug) => {
  if (!slug) {
    return null;
  }

  const results = await runPublicQuery({
    collectionId: 'university_desc',
    filters: [stringEqualsFilter('slug', slug)],
    limit: 1,
  });

  return results[0] || null;
};
