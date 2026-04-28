import 'server-only';

import { normalizeBlogSlug } from '@/lib/blogsShared.js';

export const getPublishedBlogPosts = async () => [];

export const getPublishedBlogPost = async (slug) => {
  const normalizedSlug = normalizeBlogSlug(slug);
  if (!normalizedSlug) {
    return null;
  }
  return null;
};

export const getHomepageBlogCards = async () => [];
