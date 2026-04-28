import 'server-only';

import { gatewayFetch } from '@/lib/api/gateway.js';
import { GatewayError } from '@/lib/api/errors.js';
import { toBlog, toBlogPage } from '@/lib/blog/dto.js';
import {
  BLOG_PAGE_SIZE,
  BLOG_REVALIDATE_SECONDS,
} from '@/lib/blog/constants.js';
import { normalizeBlogSlug } from '@/lib/blog/util.js';

export const fetchBlogPage = async ({
  cursor,
  limit = BLOG_PAGE_SIZE,
} = {}) => {
  const envelope = await gatewayFetch('/blog/list', {
    query: { limit, offset_id: cursor },
    revalidate: BLOG_REVALIDATE_SECONDS,
    tags: ['blog:list'],
  });
  return toBlogPage(envelope);
};

export const fetchBlogBySlug = async (slug) => {
  const normalized = normalizeBlogSlug(slug);
  if (!normalized) return null;

  try {
    const { data } = await gatewayFetch(`/blog/slug/${normalized}`, {
      revalidate: BLOG_REVALIDATE_SECONDS,
      tags: [`blog:slug:${normalized}`],
    });
    return data ? toBlog(data) : null;
  } catch (error) {
    if (error instanceof GatewayError && error.isNotFound) return null;
    throw error;
  }
};

export const fetchAllBlogSlugs = async () => {
  const slugs = [];
  let cursor = null;
  for (let i = 0; i < 100; i += 1) {
    const page = await fetchBlogPage({ cursor, limit: 100 });
    slugs.push(...page.items);
    if (!page.hasMore || !page.nextCursor) break;
    cursor = page.nextCursor;
  }
  return slugs;
};
