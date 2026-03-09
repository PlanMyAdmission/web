import Image from 'next/image';
import JoinUs from '@/components/home/JoinUs.jsx';
import Header from '@components/common/Header';
import BlogCardLink from '@components/blog/BlogCardLink.jsx';
import { getPublishedBlogPosts } from '@lib/blogs.server.js';
import { buildPageMetadata } from '@lib/seo';

export const metadata = buildPageMetadata('/blogs');

const BlogCard = ({ post }) => (
  <div className="w-full h-[100%] transition duration-500 ease-in-out mx-auto bg-white p-3">
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
      <div className="h-[220px] w-full rounded-lg bg-white"></div>
    )}
    <div className="py-3">
      <p className="md:text-2xl text-xl font-semibold leading-tight">{post.title}</p>
      <p className="py-2">{post.excerpt || 'Read the full article.'}</p>
      <BlogCardLink slug={post.slug} />
    </div>
  </div>
);

export default async function BlogsPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <>
      <Header heading="Our Blogs" />
      <div className="max-w-6xl mx-auto bg-light px-5 p-10 rounded-xl mt-5 grid grid-cols-1 sm:grid-cols-2 justify-center items-center gap-7">
        {posts.length > 0 ? (
          posts.map((post) => <BlogCard key={post.id} post={post} />)
        ) : (
          <div className="sm:col-span-2 rounded-xl bg-white px-6 py-10 text-center text-[#6f556f]">
            No published blog posts yet. Publish from admin and they will appear here.
          </div>
        )}
      </div>
      <JoinUs />
    </>
  );
}
