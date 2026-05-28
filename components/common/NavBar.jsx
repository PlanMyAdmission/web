'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const logo = '/images/home/logo.svg';
const mobileLogo = '/images/home/logo_mobile.svg';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/ai-university-matchmaker', label: 'AI University Matchmaker' },
  { href: '/essay-review', label: 'Essay Reviewer' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/blogs', label: 'Blogs' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact Us' },
];

const isActive = (pathname, href) => {
  if (!pathname) return false;
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
};

const NavBar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const handleLinkClick = () => {
    localStorage.removeItem('button');
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-main">
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 xl:px-0 flex items-center justify-between h-14">
        {/* Logo */}
        <Link href="/" onClick={() => localStorage.removeItem('button')}>
          <Image
            unoptimized
            src={logo}
            alt="PlanMyAdmission"
            width={160}
            height={40}
            className="hidden md:block h-9 w-auto"
          />
          <Image
            unoptimized
            src={mobileLogo}
            alt="PlanMyAdmission"
            width={120}
            height={36}
            className="md:hidden h-8 w-auto"
          />
        </Link>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => localStorage.removeItem('button')}
              className={`text-[15px] lg:text-[17px] font-medium transition-colors hover:text-main ${
                isActive(pathname, item.href)
                  ? 'text-main font-semibold underline underline-offset-4'
                  : 'text-[#3f1831]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Hamburger */}
        <button
          className="md:hidden p-2 text-main focus:outline-none"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {open ? (
              <>
                <line x1="4" y1="4" x2="20" y2="20" />
                <line x1="20" y1="4" x2="4" y2="20" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown — overlays content, expands from navbar */}
      <div
        className={`absolute inset-x-0 top-full md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white shadow-lg ${
          open ? 'max-h-[600px] border-t border-main/20' : 'max-h-0'
        }`}
      >
        <nav className="bg-white px-4 pb-4 pt-2">
          {navLinks.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[16px] font-medium transition-colors ${
                  active
                    ? 'bg-main/10 text-main font-semibold'
                    : 'text-[#3f1831] hover:bg-main/5 hover:text-main'
                }`}
              >
                {active && <span className="w-1.5 h-1.5 rounded-full bg-main shrink-0" />}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
