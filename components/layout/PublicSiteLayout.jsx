import NavBar from '@components/common/NavBar';
import Footer from '@components/common/Footer';
import GoToTop from '@components/common/GoToTop';
import AISuiteLauncher from '@components/AISuiteLauncher';
import AIChatbot from '@components/AIChatbot';
import SchemaOrg from '@components/seo/SchemaOrg.jsx';

export default function PublicSiteLayout({ children }) {
  return (
    <>
      <SchemaOrg />
      <NavBar />
      <GoToTop />
      {children}
      <AISuiteLauncher />
      <AIChatbot />
      <Footer />
    </>
  );
}
