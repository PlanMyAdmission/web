'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@context/AuthProvider';
import { trackAdminAction } from '@lib/analytics.js';

const GoogleMark = () => (
  <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
    <path
      d="M21.8 12.23c0-.77-.07-1.51-.2-2.23H12v4.22h5.49a4.7 4.7 0 0 1-2.04 3.08v2.56h3.3c1.93-1.78 3.05-4.39 3.05-7.63Z"
      fill="#4285F4"
    />
    <path
      d="M12 22c2.76 0 5.08-.92 6.77-2.5l-3.3-2.56c-.92.62-2.09.99-3.47.99-2.67 0-4.94-1.8-5.75-4.22H2.84v2.64A10 10 0 0 0 12 22Z"
      fill="#34A853"
    />
    <path
      d="M6.25 13.71A5.98 5.98 0 0 1 5.93 12c0-.59.11-1.16.32-1.71V7.65H2.84A10 10 0 0 0 2 12c0 1.61.38 3.13 1.04 4.35l3.21-2.64Z"
      fill="#FBBC04"
    />
    <path
      d="M12 6.07c1.5 0 2.85.52 3.91 1.53l2.93-2.93C17.07 3.03 14.75 2 12 2A10 10 0 0 0 2.84 7.65l3.41 2.64c.81-2.42 3.08-4.22 5.75-4.22Z"
      fill="#EA4335"
    />
  </svg>
);

const AdminLogin = ({ nextPath = '/admin/leads', loginError = '' }) => {
  const router = useRouter();
  const {
    authLoading,
    adminLoading,
    currentUser,
    isAdminUser,
    adminGoogleSignIn,
    logout,
  } =
    useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading || adminLoading) {
      return;
    }

    if (currentUser && isAdminUser) {
      router.replace(nextPath);
    }
  }, [adminLoading, authLoading, currentUser, isAdminUser, nextPath, router]);

  useEffect(() => {
    if (loginError === 'unauthorized') {
      setErrorMessage('This Google account is not allowed for admin access.');
    }
  }, [loginError]);

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    setErrorMessage('');
    trackAdminAction({
      action: 'login',
      target: 'admin_workspace',
      status: 'started',
      method: 'google',
    });

    try {
      await adminGoogleSignIn();
      trackAdminAction({
        action: 'login',
        target: 'admin_workspace',
        status: 'success',
        method: 'google',
      });
      router.replace(nextPath);
    } catch (error) {
      trackAdminAction({
        action: 'login',
        target: 'admin_workspace',
        status: 'error',
        method: 'google',
      });
      setErrorMessage(error?.message || 'Unable to sign in with Google.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showWrongAccountState =
    !authLoading &&
    !adminLoading &&
    currentUser &&
    !isAdminUser &&
    Boolean(currentUser.email);

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#faf7f9] px-4 py-8">
      <div className="w-full max-w-md rounded-[24px] border border-main/10 bg-white p-8 shadow-[0_12px_36px_rgba(157,19,95,0.06)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-main/50">
          Plan My Admission
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-[#3f1831]">Admin Login</h1>
        <p className="mt-2 text-sm leading-7 text-[#6f556f]">
          Sign in with a Google account that is either listed in the admin email
          allowlist or has an active record in
          <code className="mx-1 rounded bg-[#f6eff3] px-1.5 py-0.5 text-xs">admin_users</code>
          to access the admin dashboard.
        </p>

        {showWrongAccountState && (
          <div className="mt-5 rounded-[16px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Signed in as <span className="font-semibold">{currentUser.email}</span>, but
            this account is not allowed.
          </div>
        )}

        {errorMessage && (
          <div className="mt-5 rounded-[16px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <button
          type="button"
          disabled={isSubmitting || authLoading}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-[16px] border border-main/12 bg-white px-4 py-3 text-sm font-semibold text-[#3f1831] transition hover:bg-[#fff8fb] disabled:cursor-not-allowed disabled:opacity-70"
          onClick={handleGoogleLogin}
        >
          <GoogleMark />
          {isSubmitting ? 'Connecting...' : 'Continue with Google'}
        </button>

        {showWrongAccountState && (
          <button
            type="button"
            onClick={() => logout('/admin/login')}
            className="mt-3 w-full rounded-[16px] border border-main/12 px-4 py-3 text-sm font-semibold text-main transition hover:bg-[#fff8fb]"
          >
            Sign out
          </button>
        )}

        <div className="mt-6 border-t border-main/10 pt-4">
          <Link href="/" className="text-sm text-main transition hover:opacity-80">
            Back to site
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AdminLogin;
