import JoinUs from '@/components/home/JoinUs.jsx';
import Header from '@/components/common/Header';
import BlogList from '@/components/blog/BlogList.jsx';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata('/blogs');

export default function BlogsPage() {
  return (
    <>
      <Header heading="Our Blogs" />
      <div className="max-w-6xl mx-auto bg-light px-5 p-10 rounded-xl mt-5">
        <BlogList />
      </div>
      <JoinUs />
    </>
  );
}
