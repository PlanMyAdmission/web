import Shortlisted from "@/components/dashboard/user/profile/Shortlisted";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata("/dashboard/shortlisted");

const DashboardShortlistedPage = () => {
  return <Shortlisted />;
};

export default DashboardShortlistedPage;
