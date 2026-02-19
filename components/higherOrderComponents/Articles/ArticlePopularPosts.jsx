'use client';

import React from 'react';
import Image from 'next/image';

const ArticlePopularPosts = ({ posts, onNavigate }) => (
  <div className="w-full bg-transparent mx-auto gap-2 p-5 col-span-1 flex flex-col hidden md:block">
    <p className="font-bold text-2xl p-2">Popular Blog Posts</p>
    <div className="border-b-4  border-b-main w-1/5 ml-2 mb-5 items-center flex justify-center block"></div>

    <div className="w-full px-1 text text-2xs">
      {posts.map((post) => (
        <div
          key={post.href}
          className="flex flex-row hover:cursor-pointer justify-between border-b-2 border-solid gap-2 border-main my-3 pb-3 "
          onClick={() => onNavigate(post.href)}
        >
          <Image
            unoptimized
            width={1200}
            height={800}
            sizes="100vw"
            src={post.image}
            alt=""
            className="w-1/3 rounded-md h-1/4 items-center justify-center"
          />
          <div className="font-bold">
            <p>{post.title}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ArticlePopularPosts;
