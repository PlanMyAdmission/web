import Contact from '@components/contact/Contact';
import { buildPageMetadata } from '@lib/seo';
export const metadata = buildPageMetadata('/contact');
export default function ContactPage() {
  return <Contact />;
}
