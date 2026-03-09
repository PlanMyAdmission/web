import Privacy from '@components/legal/Privacy';
import { buildPageMetadata } from '@lib/seo';
export const metadata = buildPageMetadata('/privacy-policy');
export default function PrivacyPolicyPage() {
  return <Privacy />;
}
