'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import NavBar from '@components/higherOrderComponents/NavBar';
import Footer from '@components/higherOrderComponents/Footer';
import GoToTop from '@components/higherOrderComponents/GoToTop';
import AISuiteLauncher from '@components/AISuiteLauncher';
import AIChatbot from '@components/AIChatbot';
import SchemaOrg from '@components/seo/SchemaOrg.jsx';
const Shell = ({ children }) => {
  const pathname = usePathname();
  const isAdminPath = pathname?.startsWith('/admin');

  return (
    <>
      <SchemaOrg />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
      {!isAdminPath && <NavBar />}
      {!isAdminPath && <GoToTop />}
      {children}
      {!isAdminPath && <AISuiteLauncher />}
      {!isAdminPath && <AIChatbot />}
      {!isAdminPath && <Footer />}
    </>
  );
};
export default Shell;
