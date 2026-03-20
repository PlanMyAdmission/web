import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublishedBlogPost, getPublishedBlogPosts } from '@lib/blogs.server.js';
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
  const toc = [];
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
      toc.push(block.replace(/:$/, ''));
      currentSectionOpen = true;
      items.push({ type: 'section', text: block });
      return;
    }

    items.push({ type: 'subsection', text: block });
  });

  return {
    intro,
    toc,
    items,
  };
};

const PopularPosts = ({ posts }) => (
  <div className="w-full bg-transparent mx-auto gap-2 p-5 col-span-1 flex-col hidden md:flex">
    <p className="font-bold text-2xl p-2">Popular Blog Posts</p>
    <div className="border-b-4 border-b-main w-1/5 ml-2 mb-5 items-center flex justify-center block"></div>

    <div className="w-full px-1 text-2xs">
      {posts.map((post) => (
        <Link
          key={post.slug}
          href={`/blogs/${post.slug}`}
          className="flex flex-row hover:cursor-pointer justify-between border-b-2 border-solid gap-2 border-main my-3 pb-3"
        >
          {post.coverImageUrl ? (
            <Image
              unoptimized={post.coverImageUrl.startsWith('/')}
              width={1200}
              height={800}
              sizes="100vw"
              src={post.coverImageUrl}
              alt={post.title}
              className="w-1/3 rounded-md h-1/4 items-center justify-center"
            />
          ) : (
            <div className="w-1/3 rounded-md bg-light h-20" />
          )}
          <div className="font-bold">
            <p>{post.title}</p>
          </div>
        </Link>
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

  const { intro, toc, items } = buildContentModel(post.content);
  const popularPosts = posts.filter((item) => item.slug !== post.slug).slice(0, 3);

  return (
    <>
      <BlogPostSchema post={post} />
      <div className="max-w-5xl mx-auto bg-light px-5 p-10 rounded-xl my-5 mt-20 grid grid-cols-1 sm:grid-cols-2 justify-center items-center gap-7">
        {post.coverImageUrl ? (
          <Image
            unoptimized={post.coverImageUrl.startsWith('/')}
            width={1200}
            height={800}
            sizes="100vw"
            src={post.coverImageUrl}
            alt={post.title}
            className="w-6/7 rounded-xl col-span-1 items-center justify-center"
          />
        ) : (
          <div className="w-6/7 h-[260px] rounded-xl col-span-1 bg-white" />
        )}
        <div className="col-span-1 text-4xl font-bold">
          <p>{post.title}</p>
          <p className="text-sm mt-5">
            Blog By: <b>Plan My Admission</b>
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto bg-transparent my-3 mt-16 grid grid-cols-3 gap-2">
        <div className="w-full mx-auto bg-transparent justify-center gap-2 p-5 col-span-3 md:col-span-2 flex flex-col">
          {intro && <p className="text-2xl">{intro}</p>}

          {toc.length > 0 && (
            <div className="w-full mx-auto bg-light rounded-xl mt-5 justify-center gap-1 p-5 col-span-2 flex flex-col">
              <p className="text-2xl font-bold">Table of Contents</p>
              {toc.map((heading, index) => (
                <p key={`${post.id}-toc-${heading}`} className="text-lg text-main ">
                  {index + 1}. {heading}
                </p>
              ))}
            </div>
          )}

          {items.map((item, index) => {
            if (item.type === 'section') {
              return (
                <p key={`${post.id}-item-${index}`} className="text-2xl font-bold mt-6">
                  {item.text}
                </p>
              );
            }

            if (item.type === 'subsection') {
              return (
                <p key={`${post.id}-item-${index}`} className="font-bold text-xl mt-3 pl-1">
                  {item.text}
                </p>
              );
            }

            return (
              <p key={`${post.id}-item-${index}`} className="text-md pl-1">
                {item.text}
              </p>
            );
          })}
        </div>

        <PopularPosts posts={popularPosts} />
      </div>
    </>
  );
}
