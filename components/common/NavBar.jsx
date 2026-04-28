'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
const logo = '/images/home/logo.svg';
const mobileLogo = '/images/home/logo_mobile.svg';

const navLinks = [
  {
    href: '/',
    label: 'Home',
  },
  {
    href: '/ai-university-matchmaker',
    label: 'AI University Matchmaker',
  },
  {
    href: '/essay-review',
    label: 'Essay Reviewer',
  },
  {
    href: '/pricing',
    label: 'Pricing',
  },
  {
    href: '/blogs',
    label: 'Blogs',
  },
  {
    href: '/about',
    label: 'About Us',
  },
  {
    href: '/contact',
    label: 'Contact Us',
  },
];

const isNavLinkActive = (pathname, href) => {
  if (!pathname) {
    return false;
  }

  if (href === '/') {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
};

const NavBar = () => {
  const [nav, setNav] = useState(false);
  const pathname = usePathname();

  const closeMobileNav = () => setNav(false);

  const handleNavItemClick = () => {
    localStorage.removeItem('button');
    closeMobileNav();
  };

  return (
    <div>
      <div className="flex flex-row justify-between max-w-7xl border-b-2 border-main mx-auto items-end py-2 sm:px-4 xl:px-0">
        <Link href="/">
          <Image
            unoptimized
            width={220}
            height={80}
            sizes="220px"
            src={logo}
            alt="logo"
            className="hidden md:block relative md:-translate-x-6 md:h-12 h-10 md:scale-150 scale-110 md:top-4 top-2 w-auto mx-2 md:px-4"
            onClick={() => localStorage.removeItem('button')}
          />
          <Image
            unoptimized
            width={140}
            height={40}
            sizes="140px"
            src={mobileLogo}
            alt="logo"
            className="md:hidden block relative h-10 scale-110 w-auto mx-2 md:px-4"
          />
        </Link>

        <ul className="hidden md:flex text-main text-[18px] space-x-5 md:items-center md:text-[15px] lg:text-[18px]">
          {navLinks.map((item) => (
            <li
              key={item.href}
              className={`hover:underline ${isNavLinkActive(pathname, item.href) ? 'font-bold' : ''}`}
              onClick={() => localStorage.removeItem('button')}
            >
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>

        <div
          onClick={() => setNav((prev) => !prev)}
          className="block md:hidden px-4 text-main"
        >
          {!nav ? <MenuIcon /> : <CloseIcon />}
        </div>

        <div
          className={
            nav
              ? 'bg-white fixed left-0 top-0 w-[60%] h-full border-r border-r-black duration-700 ease-in-out z-50'
              : 'bg-white duration-100 h-0 ease-in border-none fixed left-[-100%]'
          }
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-main">
            <Link href="/" onClick={handleNavItemClick}>
              <Image
                unoptimized
                width={220}
                height={80}
                sizes="220px"
                src={logo}
                alt="logo"
                className="h-10 w-auto"
              />
            </Link>
            <button className="text-main" onClick={() => setNav(false)}>
              <CloseIcon />
            </button>
          </div>

          <ul className="mt-5" onClick={closeMobileNav}>
            {navLinks.map((item) => (
              <li
                key={`mobile-${item.href}`}
                className={`p-2 pl-5 text-[18px] ${isNavLinkActive(pathname, item.href) ? 'font-bold' : ''}`}
                onClick={handleNavItemClick}
              >
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
