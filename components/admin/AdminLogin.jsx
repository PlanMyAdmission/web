'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@context/AuthProvider';

const AdminLogin = ({ nextPath = '/admin/leads', loginError = '' }) => {
  const router = useRouter();
  const { authLoading, currentUser, isAdminUser, adminSignIn, adminGoogleSignIn } =
    useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (currentUser && isAdminUser) {
      router.replace(nextPath);
    }
  }, [authLoading, currentUser, isAdminUser, nextPath, router]);

  useEffect(() => {
    if (loginError === 'unauthorized') {
      setErrorMessage('This account is not allowed to access the admin dashboard.');
    }
  }, [loginError]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      setErrorMessage('Enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await adminSignIn(formData.email.trim(), formData.password);
      router.replace(nextPath);
    } catch (error) {
      setErrorMessage(error?.message || 'Unable to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await adminGoogleSignIn();
      router.replace(nextPath);
    } catch (error) {
      setErrorMessage(error?.message || 'Unable to sign in with Google.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(244,0,118,0.16),_transparent_42%),linear-gradient(180deg,#fffafc_0%,#f9edf4_100%)] px-4 py-10">
      <div className="max-w-md mx-auto">
        <div className="bg-white border border-main/20 rounded-[28px] shadow-[0_24px_60px_rgba(132,8,68,0.12)] p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-main/70 font-semibold">
            Plan My Admission
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-main">Admin Login</h1>
          <p className="mt-3 text-sm text-gray-600 leading-6">
            This login is only for internal admin access. Student login and registration remain on the public portal.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-main/25 px-4 py-3 outline-none focus:border-main"
                placeholder="admin@planmyadmission.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-main/25 px-4 py-3 outline-none focus:border-main"
                placeholder="Enter password"
              />
            </div>

            {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

            <button
              type="submit"
              disabled={isSubmitting || authLoading}
              className="w-full rounded-xl bg-main text-white py-3 font-semibold disabled:opacity-70"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4">
            <button
              type="button"
              disabled={isSubmitting || authLoading}
              className="w-full rounded-xl border border-main/25 text-main py-3 font-semibold disabled:opacity-70"
              onClick={handleGoogleLogin}
            >
              Continue with Google
            </button>
          </div>

          <div className="mt-6 pt-5 border-t border-main/10">
            <Link href="/" className="text-sm text-main hover:underline">
              Back to site
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminLogin;
