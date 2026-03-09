'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@context/AuthProvider';

const navItems = [
  {
    href: '/admin/leads',
    label: 'Leads',
  },
  {
    href: '/admin/blogs',
    label: 'Blogs',
  },
];

const shellBg = 'bg-[#f7f5f6]';

const SidebarLinks = ({ pathname, onNavigate, collapsed = false }) => (
  <nav className="mt-5 space-y-1">
    {navItems.map((item) => {
      const isActive =
        pathname === item.href || pathname?.startsWith(`${item.href}/`);

      return (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className={`flex items-center justify-between rounded-md px-3 py-2 text-sm transition ${
            isActive
              ? 'bg-[#fff3f9] font-medium text-main'
              : 'text-[#5f4a5b] hover:bg-[#f4f1f3]'
          } ${collapsed ? 'lg:px-2 lg:py-2 lg:text-xs' : ''}`}
        >
          <span className={collapsed ? 'lg:mx-auto' : ''}>{item.label}</span>
          {!collapsed && isActive && <span className="h-2 w-2 rounded-full bg-main" />}
        </Link>
      );
    })}
  </nav>
);

const SidebarInner = ({
  pathname,
  currentUser,
  collapsed,
  onNavigate,
  onToggleDesktop,
  onCloseMobile,
  logout,
  isMobile = false,
}) => (
  <>
    <div className="flex items-center justify-between border-b border-main/10 px-4 py-4">
      <div className={collapsed ? 'lg:w-full' : ''}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-main/45">
          {collapsed && !isMobile ? 'PMA' : 'Plan My Admission'}
        </p>
        <p
          className={`mt-1 font-semibold text-[#3f1831] ${
            collapsed && !isMobile ? 'lg:hidden' : ''
          }`}
        >
          Admin
        </p>
      </div>

      <div className="flex items-center gap-2">
        {!isMobile && (
          <button
            type="button"
            onClick={onToggleDesktop}
            className="hidden rounded-md border border-main/12 px-2 py-1 text-xs text-main transition hover:bg-[#fff7fb] lg:block"
          >
            {collapsed ? '>' : '<'}
          </button>
        )}
        {isMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="rounded-md border border-main/12 px-2 py-1 text-xs text-main transition hover:bg-[#fff7fb]"
          >
            Close
          </button>
        )}
      </div>
    </div>

    <div className="flex-1 overflow-y-auto px-3 py-3">
      <SidebarLinks
        pathname={pathname}
        onNavigate={onNavigate}
        collapsed={collapsed && !isMobile}
      />

      <div className={`mt-5 border-t border-main/10 pt-4 ${collapsed && !isMobile ? 'lg:hidden' : ''}`}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-main/45">
          Account
        </p>
        <p className="mt-2 text-sm font-medium text-[#3f1831]">
          {currentUser.displayName || currentUser.email}
        </p>
        <p className="mt-1 text-xs text-[#7a6173]">{currentUser.email}</p>
      </div>
    </div>

    <div className="border-t border-main/10 px-3 py-3">
      <div className={`flex gap-2 ${collapsed && !isMobile ? 'lg:flex-col' : 'flex-col'}`}>
        <Link
          href="/"
          onClick={onNavigate}
          className="rounded-md border border-main/12 px-3 py-2 text-center text-xs font-medium text-main transition hover:bg-[#fff7fb]"
        >
          Home
        </Link>
        <button
          type="button"
          className="rounded-md bg-[#3f1831] px-3 py-2 text-xs font-medium text-white transition hover:bg-[#2c1022]"
          onClick={() => logout('/admin/login')}
        >
          Sign Out
        </button>
      </div>
    </div>
  </>
);

const AdminRouteLayout = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { authLoading, adminLoading, currentUser, isAdminUser, logout } = useAuth();
  const isLoginPage = pathname === '/admin/login';
  const activeItem =
    navItems.find(
      (item) => pathname === item.href || pathname?.startsWith(`${item.href}/`),
    ) || navItems[0];
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (isLoginPage || authLoading || currentUser) {
      return;
    }

    router.replace(`/admin/login?next=${encodeURIComponent(pathname || '/admin')}`);
  }, [authLoading, currentUser, isLoginPage, pathname, router]);

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
      <div className={`min-h-screen ${shellBg} flex items-center justify-center px-4`}>
        <div className="rounded-lg border border-main/10 bg-white px-6 py-5 text-center">
          <p className="text-sm font-medium text-[#3f1831]">Restoring admin session...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className={`min-h-screen ${shellBg} flex items-center justify-center px-4`}>
        <div className="rounded-lg border border-main/10 bg-white px-6 py-5 text-center">
          <p className="text-sm font-medium text-[#3f1831]">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (!isAdminUser) {
    return (
      <div className={`min-h-screen ${shellBg} flex items-center justify-center px-4`}>
        <div className="w-full max-w-lg rounded-lg border border-main/10 bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-main/45">
            Access Denied
          </p>
          <h1 className="mt-2 text-xl font-semibold text-[#3f1831]">
            This account does not have admin access.
          </h1>
          <p className="mt-3 text-sm leading-7 text-[#6f556f]">
            Signed in as {currentUser.email}.
          </p>
          <div className="mt-5 flex gap-2">
            <button
              className="rounded-md bg-[#3f1831] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#2c1022]"
              onClick={() => logout('/admin/login')}
            >
              Sign Out
            </button>
            <Link
              href="/"
              className="rounded-md border border-main/12 px-3 py-2 text-sm font-medium text-main transition hover:bg-[#fff7fb]"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen overflow-hidden ${shellBg}`}>
      {mobileSidebarOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Close sidebar backdrop"
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-full max-w-full flex-col border-r border-main/10 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] sm:max-w-[320px] lg:hidden">
            <SidebarInner
              pathname={pathname}
              currentUser={currentUser}
              collapsed={false}
              onNavigate={() => setMobileSidebarOpen(false)}
              onToggleDesktop={() => {}}
              onCloseMobile={() => setMobileSidebarOpen(false)}
              logout={logout}
              isMobile
            />
          </aside>
        </>
      )}

      <div
        className={`mx-auto grid h-screen max-w-[1600px] ${
          desktopCollapsed
            ? 'lg:grid-cols-[84px_minmax(0,1fr)]'
            : 'lg:grid-cols-[232px_minmax(0,1fr)]'
        }`}
      >
        <aside className="hidden min-h-0 border-r border-main/10 bg-white lg:flex lg:h-screen lg:flex-col">
          <SidebarInner
            pathname={pathname}
            currentUser={currentUser}
            collapsed={desktopCollapsed}
            onNavigate={() => {}}
            onToggleDesktop={() => setDesktopCollapsed((value) => !value)}
            onCloseMobile={() => {}}
            logout={logout}
          />
        </aside>

        <div className="flex min-h-0 min-w-0 flex-col">
          <header className="sticky top-0 z-20 border-b border-main/10 bg-white/96">
            <div className="flex items-center justify-between px-4 py-3 md:px-5 lg:px-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="rounded-md border border-main/12 px-3 py-2 text-xs font-medium text-main transition hover:bg-[#fff7fb] lg:hidden"
                  onClick={() => setMobileSidebarOpen(true)}
                >
                  Menu
                </button>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-main/45">
                    {activeItem.label}
                  </p>
                </div>
              </div>
              <p className="hidden text-xs text-[#8a7385] md:block">{currentUser.email}</p>
            </div>
          </header>

          <main className="min-h-0 flex-1 overflow-y-auto px-4 py-4 md:px-5 md:py-5 lg:px-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminRouteLayout;
