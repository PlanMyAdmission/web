import { gatewayAssetUrl } from '@/lib/api/gateway.js';
import { createBlogExcerpt } from '@/lib/blog/util.js';

export const toBlog = (raw) => ({
  id: raw.id,
  title: raw.title,
  slug: raw.title_as_url,
  content: raw.blog,
  coverImageUrl: raw.banner_id
    ? gatewayAssetUrl(`/blog/thumbnail/${raw.id}`)
    : null,
  excerpt: createBlogExcerpt(raw.blog),
  metaTitle: raw.meta_title,
  metaDescription: raw.meta_description,
  keywords: Array.isArray(raw.keywords) ? raw.keywords : [],
  createdAtIso: raw.created_at,
  updatedAtIso: raw.updated_at,
});

export const toBlogPage = ({ data }) => ({
  items: (data?.blogs || []).map(toBlog),
  hasMore: Boolean(data?.has_more),
  nextCursor: data?.next_offset_id || null,
});
