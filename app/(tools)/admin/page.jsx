import { redirect } from 'next/navigation';
import { buildPageMetadata } from '@lib/seo';

export const metadata = buildPageMetadata('/admin');

export default function AdminPage() {
  redirect('/admin/leads');
}
