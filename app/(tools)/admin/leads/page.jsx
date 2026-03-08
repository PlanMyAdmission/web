import LeadsAdminPanel from '@components/admin/LeadsAdminPanel';
import { buildPageMetadata } from '@lib/seo';

export const metadata = buildPageMetadata('/admin/leads');

export default function AdminLeadsPage() {
  return <LeadsAdminPanel />;
}
