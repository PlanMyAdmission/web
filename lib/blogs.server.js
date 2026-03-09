import 'server-only';

import { unstable_cache } from 'next/cache';
import {
  BLOG_POST_COLLECTION,
  BLOG_PUBLIC_REVALIDATE_SECONDS,
  createBlogExcerpt,
  normalizeBlogSlug,
  sanitizeBlogText,
} from '@lib/blogsShared.js';
import { runPublicQuery, stringEqualsFilter } from '@lib/firestorePublic.js';
import { reportError } from '@lib/logger.js';

const toIsoString = (value) => {
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

const mapPost = (data = {}) => {
  return {
    id: data.id || '',
    title: sanitizeBlogText(data.title),
    slug: normalizeBlogSlug(data.slug),
    excerpt: sanitizeBlogText(data.excerpt) || createBlogExcerpt(data.content),
    content: sanitizeBlogText(data.content),
    coverImageUrl: sanitizeBlogText(data.coverImageUrl),
    metaTitle: sanitizeBlogText(data.metaTitle),
    metaDescription: sanitizeBlogText(data.metaDescription),
    status: data.status === 'published' ? 'published' : 'draft',
    createdAtIso: toIsoString(data.createdAt),
    updatedAtIso: toIsoString(data.updatedAt),
    publishedAtIso: toIsoString(data.publishedAt),
  };
};

const sortPosts = (posts) =>
  [...posts].sort((left, right) => {
    const leftTime = new Date(
      left.publishedAtIso || left.updatedAtIso || 0,
    ).getTime();
    const rightTime = new Date(
      right.publishedAtIso || right.updatedAtIso || 0,
    ).getTime();
    return rightTime - leftTime;
  });

const getPublishedBlogPostsUncached = async () => {
  try {
    const posts = await runPublicQuery({
      collectionId: BLOG_POST_COLLECTION,
      filters: [stringEqualsFilter('status', 'published')],
    });

    return sortPosts(
      posts.map(mapPost).filter((post) => post.slug && post.title),
    );
  } catch (error) {
    reportError('Failed to load published blog posts:', error);
    return [];
  }
};

const getPublishedBlogPostsCached = unstable_cache(
  async () => getPublishedBlogPostsUncached(),
  ['published-blog-posts'],
  {
    revalidate: BLOG_PUBLIC_REVALIDATE_SECONDS,
  },
);

export const getPublishedBlogPosts = async () => getPublishedBlogPostsCached();

export const getPublishedBlogPost = async (slug) => {
  const normalizedSlug = normalizeBlogSlug(slug);
  if (!normalizedSlug) {
    return null;
  }

  const posts = await getPublishedBlogPosts();
  return posts.find((post) => post.slug === normalizedSlug) || null;
};

export const getHomepageBlogCards = async (limit = 4) => {
  const posts = await getPublishedBlogPosts();

  return posts.slice(0, limit).map((post) => ({
    id: post.id,
    image: post.coverImageUrl || '/images/articles/article1.png',
    head: post.title,
    desc: post.excerpt || 'Read the full article.',
    link: `/blogs/${post.slug}`,
    publishedAt: post.publishedAtIso,
    updatedAt: post.updatedAtIso,
  }));
};
