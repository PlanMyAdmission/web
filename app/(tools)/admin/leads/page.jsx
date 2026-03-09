import LeadsAdminPanel from '@components/admin/leads/LeadsAdminPanel.jsx';
import { buildPageMetadata } from '@lib/seo';

export const metadata = buildPageMetadata('/admin/leads');

export default function AdminLeadsPage() {
  return <LeadsAdminPanel />;
}
