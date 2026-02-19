import Institutions from '@components/forInstitutions/Institutions';
import { buildPageMetadata } from '@lib/seo';
export const metadata = buildPageMetadata('/for-institutions');
export default function ForInstitutionsPage() {
  return <Institutions />;
}
