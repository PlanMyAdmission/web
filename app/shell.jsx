"use client";

import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "../src/higherOrderComponents/NavBar";
import Footer from "../src/higherOrderComponents/Footer";
import GoToTop from "../src/higherOrderComponents/GoToTop";
import AISuiteLauncher from "../src/components/AISuiteLauncher";
import AIChatbot from "../src/components/AIChatbot";

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
