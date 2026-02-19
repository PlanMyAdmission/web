import Home from '../../src/components/home/Home';
import { buildPageMetadata } from '../../src/lib/seo';

export const metadata = buildPageMetadata('/home');

export default function SecondaryHomePage() {
  return <Home />;
}
