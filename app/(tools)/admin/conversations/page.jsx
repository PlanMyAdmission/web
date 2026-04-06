import ConversationsAdminPanel from '@components/admin/conversations/ConversationsAdminPanel.jsx';
import { buildPageMetadata } from '@lib/seo';

export const metadata = buildPageMetadata('/admin/conversations');

export default function AdminConversationsPage() {
  return <ConversationsAdminPanel />;
}

