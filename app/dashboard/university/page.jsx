import UniversityView from "../../../src/components/explore_university/Universities/University";
import { buildPageMetadata } from "../../../src/lib/seo";

export const metadata = buildPageMetadata("/dashboard/university");

export default function DashboardUniversityPage() {
  return <UniversityView />;
}
