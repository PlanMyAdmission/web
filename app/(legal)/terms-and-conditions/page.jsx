import Terms from '@components/legal/Terms';
import { buildPageMetadata } from '@lib/seo';
export const metadata = buildPageMetadata('/terms-and-conditions');
export default function TermsAndConditionsPage() {
  return <Terms />;
}
