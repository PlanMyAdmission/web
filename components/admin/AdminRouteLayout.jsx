'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@context/AuthProvider';

const navItems = [
  {
    href: '/admin/leads',
    label: 'Leads',
    eyebrow: 'Admissions',
    description: 'Manage captured student enquiries and follow-up status.',
  },
  {
    href: '/admin/conversations',
    label: 'Chats',
    eyebrow: 'Chatbot',
    description: 'Review saved conversations and inspect transcripts.',
  },
  {
    href: '/admin/blogs',
    label: 'Blogs',
    eyebrow: 'Editorial',
    description: 'Edit and publish study abroad content.',
  },
];

const SidebarLinks = ({ pathname, onNavigate }) => (
  <nav className="flex gap-2 overflow-x-auto px-3 py-3 md:flex-1 md:flex-col md:px-4 md:py-6 md:space-y-2">
    {navItems.map((item) => {
      const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);

      return (
        <Link key={item.href} href={item.href} onClick={onNavigate}>
          <div
            className={`flex items-center gap-3 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm transition-colors ${
              isActive
                ? 'bg-white/10 text-white'
                : 'text-[#888888] hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="font-medium">{item.label}</span>
          </div>
        </Link>
      );
    })}
  </nav>
);

const SidebarContent = ({
  pathname,
  currentUser,
  logout,
  onNavigate,
  onCloseMobile,
  isMobile = false,
}) => (
  <>
    <div className="border-b border-[#222222] px-4 py-4 md:px-6 md:py-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-lg font-bold text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
              <span className="text-sm font-bold text-white">PM</span>
            </div>
            Admin
          </h1>
          <p className="mt-2 text-xs leading-5 text-[#888888]">
            Internal workspace for leads, chats, and content.
          </p>
        </div>

        {isMobile ? (
          <button
            type="button"
            onClick={onCloseMobile}
            className="rounded-lg border border-[#2a2a2a] bg-white/5 px-3 py-2 text-xs font-medium text-[#d0d0d0] hover:bg-white/10 hover:text-white"
          >
            Close
          </button>
        ) : null}
      </div>
    </div>

    <SidebarLinks pathname={pathname} onNavigate={onNavigate} />

    <div className="border-t border-[#222222] px-4 py-4 md:space-y-4 md:px-4 md:py-6">
      <div className="rounded-lg bg-white/5 px-4 py-3">
        <p className="mb-1 text-xs text-[#888888]">Logged in as</p>
        <p className="truncate text-sm font-medium text-white">
          {currentUser.displayName || currentUser.email}
        </p>
        <p className="mt-1 text-xs text-[#888888]">{currentUser.email}</p>
      </div>

      <div className="grid gap-2">
        <Link
          href="/"
          onClick={onNavigate}
          className="rounded-lg border border-[#2a2a2a] bg-white/5 px-4 py-2.5 text-center text-sm font-medium text-[#d0d0d0] transition-colors hover:bg-white/10 hover:text-white"
        >
          Back to Site
        </Link>
        <button
          type="button"
          onClick={() => logout('/admin/login')}
          className="rounded-lg px-4 py-2.5 text-left text-sm font-medium text-[#888888] transition-colors hover:bg-white/5 hover:text-white"
        >
          Logout
        </button>
      </div>
    </div>
  </>
);

const AccessCard = ({ eyebrow, title, description, children }) => (
  <div className="w-full max-w-lg rounded-2xl border border-[#e5e5e5] bg-white p-6 shadow-sm">
    <p className="text-xs font-semibold uppercase tracking-wide text-[#888888]">{eyebrow}</p>
    <h1 className="mt-2 text-2xl font-bold text-[#111111]">{title}</h1>
    <p className="mt-3 text-sm leading-7 text-[#666666]">{description}</p>
    <div className="mt-5">{children}</div>
  </div>
);

const AdminRouteLayout = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { authLoading, adminLoading, currentUser, isAdminUser, logout } = useAuth();
  const isLoginPage = pathname === '/admin/login';
  const loginHref = `/admin/login?next=${encodeURIComponent(pathname || '/admin')}`;
  const activeItem =
    navItems.find((item) => pathname === item.href || pathname?.startsWith(`${item.href}/`)) ||
    navItems[0];
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (isLoginPage || authLoading || currentUser) {
      return;
    }

    router.replace(loginHref);
  }, [authLoading, currentUser, isLoginPage, loginHref, router]);

  useEffect(() => {
    if (!mobileSidebarOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileSidebarOpen]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (authLoading || adminLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f7f7] px-4">
        <AccessCard
          eyebrow="Admin Session"
          title="Restoring workspace"
          description="Checking authentication and loading your admin access."
        >
          <div className="inline-flex rounded-lg border border-[#e5e5e5] bg-[#fafafa] px-4 py-2 text-sm text-[#666666]">
            Please wait...
          </div>
        </AccessCard>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f7f7] px-4">
        <AccessCard
          eyebrow="Admin Access"
          title="Sign in to continue"
          description="Use an approved admin Google account to open the internal workspace."
        >
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href={loginHref}
              className="rounded-lg bg-[#111111] px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-[#222222]"
            >
              Continue to Login
            </Link>
            <Link
              href="/"
              className="rounded-lg border border-[#e5e5e5] bg-white px-4 py-2.5 text-center text-sm font-medium text-[#111111] hover:bg-[#fafafa]"
            >
              Back to Site
            </Link>
          </div>
        </AccessCard>
      </div>
    );
  }

  if (!isAdminUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f7f7] px-4">
        <AccessCard
          eyebrow="Access Denied"
          title="This account does not have admin access"
          description={`Signed in as ${currentUser.email}. Use an approved account or update the allowlist first.`}
        >
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => logout('/admin/login')}
              className="rounded-lg bg-[#111111] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#222222]"
            >
              Logout
            </button>
            <Link
              href="/"
              className="rounded-lg border border-[#e5e5e5] bg-white px-4 py-2.5 text-center text-sm font-medium text-[#111111] hover:bg-[#fafafa]"
            >
              Go Home
            </Link>
          </div>
        </AccessCard>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white md:flex-row">
      {mobileSidebarOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/30 md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Close sidebar backdrop"
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-full max-w-[280px] flex-col border-r border-[#222222] bg-[#111111] md:hidden">
            <SidebarContent
              pathname={pathname}
              currentUser={currentUser}
              logout={logout}
              onNavigate={() => setMobileSidebarOpen(false)}
              onCloseMobile={() => setMobileSidebarOpen(false)}
              isMobile
            />
          </aside>
        </>
      ) : null}

      <aside className="hidden w-56 flex-col border-r border-[#222222] bg-[#111111] md:flex">
        <SidebarContent
          pathname={pathname}
          currentUser={currentUser}
          logout={logout}
          onNavigate={() => {}}
          onCloseMobile={() => {}}
        />
      </aside>

      <main className="min-h-0 flex-1 overflow-auto bg-white">
        <header className="border-b border-[#e5e5e5] px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileSidebarOpen(true)}
                  className="rounded-lg border border-[#e5e5e5] bg-white px-3 py-2 text-xs font-medium text-[#555555] hover:bg-[#fafafa] md:hidden"
                >
                  Menu
                </button>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#888888]">
                    {activeItem.eyebrow}
                  </p>
                  <h1 className="mt-1 text-xl font-bold text-[#111111] sm:text-2xl">
                    {activeItem.label}
                  </h1>
                </div>
              </div>
              <p className="mt-2 max-w-2xl text-sm text-[#666666]">{activeItem.description}</p>
            </div>
          </div>
        </header>

        <div className="min-h-0 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
      </main>
    </div>
  );
};

export default AdminRouteLayout;
