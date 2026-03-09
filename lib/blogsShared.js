export const BLOG_POST_COLLECTION = 'blog_posts';
export const BLOG_PUBLIC_REVALIDATE_SECONDS = 300;

export const normalizeBlogSlug = (value = '') =>
  `${value || ''}`
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');

export const sanitizeBlogText = (value = '') => `${value || ''}`.trim();

export const createBlogExcerpt = (content = '', maxLength = 180) => {
  const normalized = `${content || ''}`.replace(/\s+/g, ' ').trim();

  if (!normalized) {
    return '';
  }

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength).trimEnd()}...`;
};
