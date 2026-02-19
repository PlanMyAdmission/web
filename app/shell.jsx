'use client';

import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/ReactToastify.css';
import NavBar from '@components/higherOrderComponents/NavBar';
import Footer from '@components/higherOrderComponents/Footer';
import GoToTop from '@components/higherOrderComponents/GoToTop';
import AISuiteLauncher from '@components/AISuiteLauncher';
import AIChatbot from '@components/AIChatbot';
const Shell = ({ children }) => {
  return (
    <>
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
      <NavBar />
      <GoToTop />
      {children}
      <AISuiteLauncher />
      <AIChatbot />
      <Footer />
    </>
  );
};
export default Shell;
