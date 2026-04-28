'use client';

import Image from 'next/image';
import Link from 'next/link';

import { trackContentClick } from '@/lib/analytics.js';

const ArticleCard = ({ post }) => {
  if (!post) return null;

  const href = `/blogs/${post.slug}`;

  return (
    <article className="snap-center shrink-0 w-[280px] lg:w-[300px] mx-auto md:mx-0">
      <Link
        href={href}
        prefetch={false}
        className="group flex flex-col h-full rounded-2xl overflow-hidden border border-main/10 bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
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
            className="w-full h-[180px] object-cover"
            src={post.coverImageUrl}
            alt={post.title}
            width={640}
            height={360}
            sizes="300px"
          />
        ) : (
          <div className="w-full h-[180px] bg-light" />
        )}

        <div className="flex flex-col flex-1 p-4">
          <h3 className="text-base font-semibold leading-snug line-clamp-2 group-hover:text-main transition">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="mt-2 text-sm text-[#5b4657] line-clamp-3 flex-1">{post.excerpt}</p>
          )}
          <span className="mt-3 text-sm text-main font-semibold">
            Read More {'>>'}
          </span>
        </div>
      </Link>
    </article>
  );
};

export default ArticleCard;
