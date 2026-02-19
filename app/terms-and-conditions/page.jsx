import Terms from '../../src/components/privacy-policy/Terms';
import { buildPageMetadata } from '../../src/lib/seo';

export const metadata = buildPageMetadata('/terms-and-conditions');

export default function TermsAndConditionsPage() {
  return <Terms />;
}
