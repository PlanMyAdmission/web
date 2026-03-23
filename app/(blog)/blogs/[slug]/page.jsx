import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getPublishedBlogPost,
  getPublishedBlogPosts,
} from '@lib/blogs.server.js';
import { buildCmsMetadata } from '@lib/cmsMetadata.js';
import BlogPostSchema from '@components/seo/BlogPostSchema.jsx';

const buildParagraphs = (content = '') =>
  `${content || ''}`
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

const isHeadingBlock = (text = '') => {
  const words = `${text || ''}`.trim().split(/\s+/).filter(Boolean);
  return (
    words.length > 0 &&
    words.length <= 8 &&
    text.length <= 72 &&
    !/[.!?]$/.test(text)
  );
};

const buildContentModel = (content = '') => {
  const blocks = buildParagraphs(content);
  const intro = blocks[0] || '';
  const remaining = blocks.slice(1);
  const items = [];
  let currentSectionOpen = false;

  remaining.forEach((block, index) => {
    const next = remaining[index + 1];
    const nextNext = remaining[index + 2];

    if (!isHeadingBlock(block)) {
      items.push({ type: 'paragraph', text: block });
      return;
    }

    const nextHeading = isHeadingBlock(next);
    const nextNextHeading = !nextHeading && isHeadingBlock(nextNext);
    const isSection = nextHeading || nextNextHeading || !currentSectionOpen;

    if (isSection) {
      currentSectionOpen = true;
      items.push({ type: 'section', text: block });
      return;
    }

    items.push({ type: 'subsection', text: block });
  });

  return {
    intro,
    items,
  };
};

const buildHeadingId = (text = '', index = 0) => {
  const slug = `${text || ''}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug
    ? `blog-section-${index + 1}-${slug}`
    : `blog-section-${index + 1}`;
};

const formatDisplayDate = (iso = '') => {
  if (!iso) {
    return '';
  }

  const value = new Date(iso);
  if (Number.isNaN(value.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(value);
};

const PopularPosts = ({ posts }) =>
  posts.length > 0 && (
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

const renderContentItem = (postId, item, index) => {
  if (item.type === 'section') {
    return (
      <section key={`${postId}-item-${index}`} className="pt-2 first:pt-0">
        <h2
          id={item.anchorId}
          className="scroll-mt-28 text-2xl font-bold leading-tight text-[#3f1831] md:text-[2rem]"
        >
          {item.text}
        </h2>
      </section>
    );
  }

  if (item.type === 'subsection') {
    return (
      <h3
        key={`${postId}-item-${index}`}
        className="pt-2 text-xl font-semibold leading-tight text-[#4a2740] md:text-2xl"
      >
        {item.text}
      </h3>
    );
  }

  return (
    <p
      key={`${postId}-item-${index}`}
      className="text-base leading-8 text-[#5b4657] md:text-lg"
    >
      {item.text}
    </p>
  );
};

const TableOfContents = ({ items }) => (
  <div className="mt-8 rounded-[24px] bg-light px-5 py-5 md:px-6">
    <p className="text-xl font-semibold text-[#3f1831] md:text-2xl">
      Table of Contents
    </p>
    <div className="mt-4 space-y-3">
      {items.map((heading, index) => (
        <a
          key={heading.anchorId}
          href={`#${heading.anchorId}`}
          className="flex gap-3 text-sm text-main transition hover:opacity-80 md:text-base"
        >
          <span className="font-semibold">{index + 1}.</span>
          <span>{heading.label}</span>
        </a>
      ))}
    </div>
  </div>
);

export async function generateMetadata({ params }) {
  const post = await getPublishedBlogPost(params.slug);
  if (!post) {
    return {};
  }

  return buildCmsMetadata({
    path: `/blogs/${post.slug}`,
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    type: 'article',
    image: null,
    twitterImage: null,
  });
}

export default async function BlogPostPage({ params }) {
  const [post, posts] = await Promise.all([
    getPublishedBlogPost(params.slug),
    getPublishedBlogPosts(),
  ]);

  if (!post) {
    notFound();
  }

  const { intro, items } = buildContentModel(post.content);
  const popularPosts = posts
    .filter((item) => item.slug !== post.slug)
    .slice(0, 3);
  const sectionEntries = items
    .map((item, index) =>
      item.type === 'section'
        ? {
            anchorId: buildHeadingId(item.text, index),
            index,
            label: item.text.replace(/:$/, ''),
          }
        : null,
    )
    .filter(Boolean);
  const sectionAnchorMap = new Map(
    sectionEntries.map((entry) => [entry.index, entry.anchorId]),
  );
  const contentItems = items.map((item, index) =>
    item.type === 'section'
      ? {
          ...item,
          anchorId: sectionAnchorMap.get(index),
        }
      : item,
  );
  const tocItems = sectionEntries.map(({ anchorId, label }) => ({
    anchorId,
    label,
  }));
  const publishedLabel = formatDisplayDate(
    post.publishedAtIso || post.updatedAtIso || post.createdAtIso,
  );
  const articleSummary = post.excerpt || intro || 'Read the full article.';

  return (
    <>
      <BlogPostSchema post={post} />
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
            {intro && (
              <p className="text-lg leading-8 text-[#5b4657] md:text-xl">
                {intro}
              </p>
            )}

            {tocItems.length > 0 && <TableOfContents items={tocItems} />}

            <div className="mt-8 space-y-4">
              {contentItems.map((item, index) =>
                renderContentItem(post.id, item, index),
              )}
            </div>
          </article>

          <PopularPosts posts={popularPosts} />
        </div>
      </div>
    </>
  );
}
