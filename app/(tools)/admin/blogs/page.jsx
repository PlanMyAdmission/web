import BlogAdminPanel from '@components/admin/blog/BlogAdminPanel.jsx';
import { buildPageMetadata } from '@lib/seo';

export const metadata = buildPageMetadata('/admin/blogs');

export default function AdminBlogsPage() {
  return <BlogAdminPanel />;
}
