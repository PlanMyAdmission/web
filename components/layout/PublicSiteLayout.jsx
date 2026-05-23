import NavBar from '@/components/common/NavBar';
import Footer from '@/components/common/Footer';
import GoToTop from '@/components/common/GoToTop';
import AISuiteLauncher from '@/components/ai-admission-suite/AISuiteLauncher';
import AIChatbot from '@/components/ai-chatbot/AIChatbot';
import SchemaOrg from '@/components/seo/SchemaOrg.jsx';
import PageFAQ from '@/components/common/PageFAQ.jsx';

export default function PublicSiteLayout({ children }) {
  return (
    <>
      <SchemaOrg />
      <NavBar />
      <GoToTop />
      {children}
      <PageFAQ />
      <AISuiteLauncher />
      <AIChatbot />
      <Footer />
    </>
  );
}
