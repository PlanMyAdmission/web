import Documents from "@/components/dashboard/user/Documents";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata("/dashboard/documents");

const DashboardDocumentsPage = () => {
  return <Documents />;
};

export default DashboardDocumentsPage;
