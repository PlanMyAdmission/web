import InfiniteBlogList from '@/components/blog/InfiniteBlogList.jsx';
import { fetchBlogPage } from '@/lib/blog/api.js';

const EmptyState = () => (
  <div className="rounded-xl bg-white px-6 py-10 text-center text-[#6f556f]">
    No published blog posts yet. New posts will appear here once available.
  </div>
);

const BlogList = async () => {
  const page = await fetchBlogPage();

  if (page.items.length === 0) {
    return <EmptyState />;
  }

  return (
    <InfiniteBlogList
      initialItems={page.items}
      initialCursor={page.nextCursor}
      initialHasMore={page.hasMore}
    />
  );
};

export default BlogList;
