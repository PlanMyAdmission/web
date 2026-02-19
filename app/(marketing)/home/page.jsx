import Home from '@components/home/Home';
import { buildPageMetadata } from '@lib/seo';
export const metadata = buildPageMetadata('/home');
export default function SecondaryHomePage() {
  return <Home />;
}
