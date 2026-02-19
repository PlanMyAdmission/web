import HowItWorks from '@components/how-it-works/HowItWorks';
import { buildPageMetadata } from '@lib/seo';
export const metadata = buildPageMetadata('/how-it-works');
export default function HowItWorksPage() {
  return <HowItWorks />;
}
