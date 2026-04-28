'use server';

import { fetchBlogPage } from '@/lib/blog/api.js';
import { BLOG_PAGE_SIZE } from '@/lib/blog/constants.js';

export const loadMoreBlogs = async (cursor) => {
  const page = await fetchBlogPage({
    cursor: cursor || undefined,
    limit: BLOG_PAGE_SIZE,
  });
  return {
    items: page.items,
    hasMore: page.hasMore,
    nextCursor: page.nextCursor,
  };
};
