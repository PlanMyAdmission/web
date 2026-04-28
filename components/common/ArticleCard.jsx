'use client';

import Image from 'next/image';
import Link from 'next/link';

import { trackContentClick } from '@/lib/analytics.js';

const ArticleCard = ({ post }) => {
  if (!post) return null;

  const href = `/blogs/${post.slug}`;

  return (
    <article className="snap-center shrink-0 md:max-w-sm w-full mx-auto md:mx-0 mb-3 md:mb-0">
      <Link
        href={href}
        prefetch={false}
        className="group block transition duration-500 ease-in-out border-b-4 border-white"
        onClick={() =>
          trackContentClick({
            contentType: 'blog_post',
            slug: post.slug,
            location: 'home_articles',
          })
        }
      >
        {post.coverImageUrl ? (
          <Image
            className="w-full h-[220px] object-cover rounded-md"
            src={post.coverImageUrl}
            alt={post.title}
            width={640}
            height={360}
            sizes="(max-width: 768px) 100vw, 380px"
          />
        ) : (
          <div className="w-full h-[220px] rounded-md bg-light" />
        )}

        <div className="py-3">
          <h3 className="md:text-2xl text-xl font-semibold leading-tight line-clamp-2 group-hover:text-main transition">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="py-2 text-[#5b4657] line-clamp-3">{post.excerpt}</p>
          )}
          <span className="text-main p-3 inline-block font-semibold">
            Read More {'>>'}
          </span>
        </div>
      </Link>
    </article>
  );
};

export default ArticleCard;
