'use client';

import { ToastContainer } from 'react-toastify';

export default function GlobalClientUI() {
  return (
    <ToastContainer
      position="top-center"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
      theme="colored"
    />
  );
}
