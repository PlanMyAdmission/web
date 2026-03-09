import About from '@components/about/About';
import { buildPageMetadata } from '@lib/seo';
export const metadata = buildPageMetadata('/about');
export default function AboutPage() {
  return <About />;
}
