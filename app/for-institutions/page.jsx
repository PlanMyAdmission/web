import Institutions from "../../src/components/forInstitutions/Institutions";
import { buildPageMetadata } from "../../src/lib/seo";

export const metadata = buildPageMetadata("/for-institutions");

export default function ForInstitutionsPage() {
  return <Institutions />;
}
