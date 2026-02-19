'use client';

import React from 'react';
import { AuthProvider } from '@context/AuthProvider';
const AppProviders = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};
export default AppProviders;
