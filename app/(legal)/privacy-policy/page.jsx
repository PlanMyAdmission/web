import Privacy from '@components/privacy-policy/Privacy';
import { buildPageMetadata } from '@lib/seo';
export const metadata = buildPageMetadata('/privacy-policy');
export default function PrivacyPolicyPage() {
  return <Privacy />;
}
