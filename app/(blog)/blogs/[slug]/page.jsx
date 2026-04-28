import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import BlogContent from '@/components/blog/BlogContent.jsx';
import BlogBreadcrumbSchema from '@/components/seo/BlogBreadcrumbSchema.jsx';
import BlogPostSchema from '@/components/seo/BlogPostSchema.jsx';
import {
  fetchAllBlogSlugs,
  fetchBlogBySlug,
  fetchBlogPage,
} from '@/lib/blog/api.js';
import { buildCmsMetadata } from '@/lib/cmsMetadata.js';

const formatDisplayDate = (iso = '') => {
  if (!iso) return '';
  const value = new Date(iso);
  if (Number.isNaN(value.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(value);
};

const PopularPosts = ({ posts }) => {
  if (posts.length === 0) return null;

  return (
    <aside className="flex h-fit flex-col rounded-[28px] border border-main/10 bg-light p-5 shadow-[0_18px_40px_rgba(157,19,95,0.06)] lg:sticky lg:top-24">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-main/55">
        Discover More
      </p>
      <p className="mt-2 text-2xl font-semibold text-[#3f1831]">
        Popular Blog Posts
      </p>
      <div className="mt-5 space-y-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blogs/${post.slug}`}
            className="group flex items-start gap-3 rounded-[20px] bg-white p-3 transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(157,19,95,0.08)]"
          >
            {post.coverImageUrl ? (
              <Image
                unoptimized={post.coverImageUrl.startsWith('/')}
                width={240}
                height={160}
                sizes="96px"
                src={post.coverImageUrl}
                alt={post.title}
                className="h-24 w-24 shrink-0 rounded-[16px] object-cover"
              />
            ) : (
              <div className="h-24 w-24 shrink-0 rounded-[16px] bg-[#fff3f9]" />
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-6 text-[#3f1831] transition group-hover:text-main">
                {post.title}
              </p>
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-main/55">
                Read article
              </p>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
};

export async function generateMetadata({ params }) {
  const post = await fetchBlogBySlug(params.slug);
  if (!post) return {};

  return buildCmsMetadata({
    path: `/blogs/${post.slug}`,
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    type: 'article',
    image: post.coverImageUrl || undefined,
    twitterImage: post.coverImageUrl || undefined,
    keywords: post.keywords,
    publishedTime: post.createdAtIso,
    modifiedTime: post.updatedAtIso || post.createdAtIso,
  });
}

export async function generateStaticParams() {
  try {
    const slugs = await fetchAllBlogSlugs();
    return slugs
      .filter((post) => Boolean(post.slug))
      .map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

export default async function BlogPostPage({ params }) {
  const [post, popularPage] = await Promise.all([
    fetchBlogBySlug(params.slug),
    fetchBlogPage({ limit: 4 }),
  ]);

  if (!post) notFound();

  const popularPosts = popularPage.items
    .filter((item) => item.slug !== post.slug)
    .slice(0, 3);

  const publishedLabel = formatDisplayDate(
    post.createdAtIso || post.updatedAtIso,
  );
  const articleSummary = post.excerpt || 'Read the full article.';

  return (
    <>
      <BlogPostSchema post={post} />
      <BlogBreadcrumbSchema post={post} />

      <div className="mx-auto mt-20 max-w-6xl px-4 md:px-5 lg:px-6">
        <section className="overflow-hidden rounded-[28px] bg-light shadow-[0_18px_40px_rgba(157,19,95,0.06)]">
          <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
            {post.coverImageUrl ? (
              <div className="relative min-h-[240px] overflow-hidden bg-white sm:min-h-[320px]">
                <Image
                  unoptimized={post.coverImageUrl.startsWith('/')}
                  width={1200}
                  height={800}
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  src={post.coverImageUrl}
                  alt={post.title}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="min-h-[240px] bg-white sm:min-h-[320px]" />
            )}

            <div className="flex flex-col justify-center px-5 py-6 md:px-8 md:py-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-main/55">
                Plan My Admission Blog
              </p>
              <h1 className="mt-3 text-3xl font-bold leading-tight text-[#3f1831] md:text-4xl">
                {post.title}
              </h1>
              <p className="mt-4 text-base leading-8 text-[#5b4657] md:text-lg">
                {articleSummary}
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-[#6f556f]">
                <span className="rounded-full bg-white/75 px-3 py-1.5">
                  By{' '}
                  <span className="font-semibold text-[#3f1831]">
                    Plan My Admission
                  </span>
                </span>
                {publishedLabel && (
                  <span className="rounded-full bg-white/75 px-3 py-1.5">
                    Published {publishedLabel}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 md:px-5 lg:px-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="rounded-[28px] border border-main/10 bg-white px-5 py-6 shadow-[0_18px_40px_rgba(157,19,95,0.05)] md:px-8 md:py-8">
            <BlogContent html={post.content} />
          </article>

          <PopularPosts posts={popularPosts} />
        </div>
      </div>
    </>
  );
}
