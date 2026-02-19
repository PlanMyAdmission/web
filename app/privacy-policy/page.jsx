import Privacy from '../../src/components/privacy-policy/Privacy';
import { buildPageMetadata } from '../../src/lib/seo';

export const metadata = buildPageMetadata('/privacy-policy');

export default function PrivacyPolicyPage() {
  return <Privacy />;
}
