import 'server-only';

import {
  BLOG_PUBLIC_REVALIDATE_SECONDS,
  createBlogExcerpt,
  normalizeBlogSlug,
} from '@/lib/blogsShared.js';
import { reportError } from '@/lib/logger.js';

const GATEWAY_URL = process.env.GATEWAY_URL;
const HOMEPAGE_BLOG_LIMIT = 4;

const normalizeBlog = (raw) => ({
  id: raw.id,
  title: raw.title,
  slug: raw.title_as_url,
  content: raw.blog,
  coverImageUrl: raw.banner_id
    ? `${GATEWAY_URL}/blog/thumbnail/${raw.banner_id}`
    : null,
  excerpt: createBlogExcerpt(raw.blog),
  metaTitle: raw.meta_title || null,
  metaDescription: raw.meta_description || null,
  createdAt: raw.created_at,
});

export const getPublishedBlogPosts = async () => {
  if (!GATEWAY_URL) return [];

  try {
    const res = await fetch(`${GATEWAY_URL}/blog/list`, {
      next: { revalidate: BLOG_PUBLIC_REVALIDATE_SECONDS },
    });

    if (!res.ok) return [];

    const json = await res.json();
    const blogs = json?.data?.blogs;
    if (!Array.isArray(blogs)) return [];

    return blogs.map(normalizeBlog);
  } catch (error) {
    reportError('getPublishedBlogPosts failed', error);
    return [];
  }
};

export const getPublishedBlogPost = async (slug) => {
  const normalizedSlug = normalizeBlogSlug(slug);
  if (!normalizedSlug) return null;
  if (!GATEWAY_URL) return null;

  try {
    const res = await fetch(`${GATEWAY_URL}/blog/slug/${normalizedSlug}`, {
      next: { revalidate: BLOG_PUBLIC_REVALIDATE_SECONDS },
    });

    if (!res.ok) return null;

    const json = await res.json();
    const raw = json?.data;
    if (!raw) return null;

    return normalizeBlog(raw);
  } catch (error) {
    reportError('getPublishedBlogPost failed', error);
    return null;
  }
};

export const getHomepageBlogCards = async () => {
  if (!GATEWAY_URL) return [];

  try {
    const res = await fetch(
      `${GATEWAY_URL}/blog/list?limit=${HOMEPAGE_BLOG_LIMIT}`,
      {
        next: { revalidate: BLOG_PUBLIC_REVALIDATE_SECONDS },
      },
    );

    if (!res.ok) return [];

    const json = await res.json();
    const blogs = json?.data?.blogs;
    if (!Array.isArray(blogs)) return [];

    return blogs.slice(0, HOMEPAGE_BLOG_LIMIT).map(normalizeBlog);
  } catch (error) {
    reportError('getHomepageBlogCards failed', error);
    return [];
  }
};
