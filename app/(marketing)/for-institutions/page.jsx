import Institutions from '@components/for-institutions/Institutions';
import { buildPageMetadata } from '@lib/seo';
export const metadata = buildPageMetadata('/for-institutions');
export default function ForInstitutionsPage() {
  return <Institutions />;
}
