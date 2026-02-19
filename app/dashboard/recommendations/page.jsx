import Recommendations from "@/components/dashboard/user/Recommendations";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata("/dashboard/recommendations");

const DashboardRecommendationsPage = () => {
  return <Recommendations />;
};

export default DashboardRecommendationsPage;
