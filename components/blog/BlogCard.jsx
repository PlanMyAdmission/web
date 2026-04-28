import Image from 'next/image';

import BlogCardLink from '@/components/blog/BlogCardLink.jsx';

const BlogCard = ({ post }) => (
  <article className="w-full h-full transition duration-500 ease-in-out mx-auto bg-white p-3">
    {post.coverImageUrl ? (
      <Image
        className="w-full rounded-lg"
        src={post.coverImageUrl}
        alt={post.title}
        width={640}
        height={360}
        unoptimized={post.coverImageUrl.startsWith('/')}
      />
    ) : (
      <div className="h-[220px] w-full rounded-lg bg-light" />
    )}
    <div className="py-3">
      <h2 className="md:text-2xl text-xl font-semibold leading-tight">
        {post.title}
      </h2>
      <p className="py-2">{post.excerpt || 'Read the full article.'}</p>
      <BlogCardLink slug={post.slug} />
    </div>
  </article>
);

export default BlogCard;
