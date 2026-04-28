import { getPublishedBlogPosts } from '@/lib/blogs.server.js';
import { getCanonicalUrl, getSitemapEntries } from '@/lib/seo';

const toLastModified = (value) => {
  if (!value) {
    return new Date();
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
};

export default async function sitemap() {
  const [staticEntries, posts] = await Promise.all([
    Promise.resolve(getSitemapEntries()),
    getPublishedBlogPosts(),
  ]);

  return [
    ...staticEntries,
    ...posts.map((post) => ({
      url: getCanonicalUrl(`/blogs/${post.slug}`),
      lastModified: toLastModified(post.updatedAtIso || post.publishedAtIso),
      changeFrequency: 'monthly',
      priority: 0.7,
    })),
  ];
}
