'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@context/AuthProvider';

const AdminRouteLayout = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { authLoading, currentUser, isAdminUser, logout } = useAuth();
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage || authLoading || currentUser) {
      return;
    }

    router.replace(`/admin/login?next=${encodeURIComponent(pathname || '/admin')}`);
  }, [authLoading, currentUser, isLoginPage, pathname, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#fff7fb] flex items-center justify-center px-4">
        <div className="bg-white border border-main/20 rounded-3xl px-6 py-8 text-center shadow-sm">
          <p className="text-main text-lg font-semibold">Checking admin access...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#fff7fb] flex items-center justify-center px-4">
        <div className="bg-white border border-main/20 rounded-3xl px-6 py-8 text-center shadow-sm">
          <p className="text-main text-lg font-semibold">Redirecting to admin login...</p>
        </div>
      </div>
    );
  }

  if (!isAdminUser) {
    return (
      <div className="min-h-screen bg-[#fff7fb] flex items-center justify-center px-4">
        <div className="w-full max-w-lg bg-white border border-main/20 rounded-3xl p-8 shadow-sm">
          <p className="text-main text-2xl font-semibold">Admin access required</p>
          <p className="text-gray-600 mt-3">
            Signed in as {currentUser.email}, but this account is not allowed to access the admin dashboard.
          </p>
          <div className="mt-6 flex gap-3">
            <button
              className="px-4 py-2 rounded-md bg-main text-white"
              onClick={() => logout('/admin/login')}
            >
              Sign Out
            </button>
            <Link href="/" className="px-4 py-2 rounded-md border border-main text-main">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff7fb]">
      <header className="border-b border-main/15 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-main/70 font-semibold">
              Plan My Admission
            </p>
            <h1 className="text-main text-2xl font-semibold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-4 py-2 rounded-md border border-main text-main hover:bg-light transition"
              onClick={() => router.push('/admin/leads')}
            >
              Leads
            </button>
            <button
              className="px-4 py-2 rounded-md bg-main text-white hover:bg-main/90 transition"
              onClick={() => logout('/admin/login')}
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default AdminRouteLayout;
