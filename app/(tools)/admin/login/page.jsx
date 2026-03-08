import AdminLogin from '@components/admin/AdminLogin';
import { buildPageMetadata } from '@lib/seo';

export const metadata = buildPageMetadata('/admin/login');

export default function AdminLoginPage({ searchParams }) {
  const nextPath = searchParams?.next || '/admin/leads';
  const loginError = searchParams?.error || '';

  return <AdminLogin nextPath={nextPath} loginError={loginError} />;
}
