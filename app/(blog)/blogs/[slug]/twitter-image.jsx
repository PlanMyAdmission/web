import { notFound } from 'next/navigation';

import { getPublishedBlogPost } from '@lib/blogs.server.js';
import { buildOgImage, contentType, ogImageSize } from '@lib/og';

export { contentType };
export const runtime = 'nodejs';
export const size = ogImageSize;

export default async function BlogTwitterImage({ params }) {
  const post = await getPublishedBlogPost(params.slug);
  if (!post) {
    notFound();
  }

  return buildOgImage({
    eyebrow: 'Plan My Admission Blog',
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || 'Read the full article on Plan My Admission.',
  });
}
