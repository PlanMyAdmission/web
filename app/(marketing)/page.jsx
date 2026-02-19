import Home from '@components/home/Home';
import { buildPageMetadata } from '@lib/seo';

export const metadata = buildPageMetadata('/');

export default function HomePage() {
  return <Home />;
}
