'use client';

import React, { useState, useEffect } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import logo from '../assets/homeAssets/logo.svg';
import mobile_logo from '../assets/homeAssets/logo_mobile.svg';
import { useAuth } from '../context/AuthProvider';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/ai-university-search', label: 'AI University Search' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/blogs', label: 'Blogs' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact Us' },
];

const NavBar = () => {
  const [nav, setNav] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [photoURL, setPhotoURL] = useState(
    'https://imgs.search.brave.com/IfCu-rlEANrldypDGTbEYE4_XyiekbuS1xeWWgBNJ7M/rs:fit:1000:1080:1/g:ce/aHR0cHM6Ly9jZG4x/LnZlY3RvcnN0b2Nr/LmNvbS9pLzEwMDB4/MTAwMC83MS84NS9t/YWxlLWF2YXRhci1w/cm9maWxlLWljb24t/cm91bmQtbWFuLWZh/Y2UtdmVjdG9yLTE4/MzA3MTg1LmpwZw',
  );
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    if (currentUser?.photoURL) {
      setPhotoURL(currentUser.photoURL);
    }
    setShowDropdown(false);
  }, [currentUser]);

  const handleNavToggle = () => setNav((prev) => !prev);
  const closeMobileNav = () => setNav(false);

  const handleDashboardNavigate = () => {
    setShowDropdown(false);
    closeMobileNav();
    router.push('/dashboard/profile#about');
  };

  const handleNavItemClick = () => {
    localStorage.removeItem('button');
    closeMobileNav();
  };

  return (
    <div className="">
      <div className="flex flex-row justify-between  max-w-7xl border-b-2 border-main mx-auto items-end py-2 sm:px-4 xl:px-0">
        <Link href="/">
          <img
            src={logo}
            alt="logo"
            className="hidden md:block relative md:-translate-x-6  md:h-12 h-10 md:scale-150 scale-110 md:top-4 top-2 w-100 mx-2 md:px-4"
            onClick={() => localStorage.removeItem('button')}
          />
          <img
            src={mobile_logo}
            alt="logo"
            className="md:hidden block relative h-10 scale-110 w-100 mx-2 md:px-4"
          />
        </Link>
        <ul className="hidden md:flex text-main text-[18px] space-x-5 md:items-center md:text-[15px] lg:text-[18px] ">
          {navLinks.map((item) => (
            <li
              key={item.href}
              className={`hover:underline ${pathname === item.href ? 'font-bold' : ''}`}
              onClick={() => localStorage.removeItem('button')}
            >
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
        {currentUser ? (
          <div className="relative">
            <img
              src={photoURL}
              alt="profile"
              onClick={() => setShowDropdown((prev) => !prev)}
              className="w-10 h-10 rounded-full cursor-pointer border-2 border-main"
            />
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-main rounded shadow-md z-50 text-sm">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-light"
                  onClick={handleDashboardNavigate}
                >
                  Dashboard
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-light"
                  onClick={logout}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-x-2">
            <a
              href="https://portal.planmyadmission.com/login"
              rel="noreferrer"
              target="_blank"
            >
              <button className="bg-main border border-main text-white px-4 py-1 rounded-sm hover:bg-main/80 transition">
                Login
              </button>
            </a>
            <a
              href="https://portal.planmyadmission.com/sign-up"
              rel="noreferrer"
              target="_blank"
            >
              <button className="bg-white border border-main text-main px-4 py-1 rounded-sm hover:bg-main hover:text-white transition">
                Register
              </button>
            </a>
          </div>
        )}
        <div
          onClick={handleNavToggle}
          className="block md:hidden px-4 text-main"
        >
          {!nav ? <MenuIcon /> : <CloseIcon />}
        </div>

        <div
          className={
            nav
              ? 'bg-white fixed left-0 top-0 w-[60%] h-full border-r border-r-black-900 duration-700 ease-in-out z-50'
              : 'bg-white duration-10 h-0 ease-in border-none fixed left-[-100%]'
          }
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-main">
            <Link href="/" onClick={handleNavItemClick}>
              <img src={logo} alt="logo" className="h-10" />
            </Link>
            <button className="text-main" onClick={handleNavToggle}>
              <CloseIcon />
            </button>
          </div>
          <ul className="mt-5" onClick={handleNavToggle}>
            {navLinks.map((item) => (
              <li
                key={`mobile-${item.href}`}
                className={`p-2 pl-5 text-[18px] ${pathname === item.href ? 'font-bold' : ''}`}
                onClick={handleNavItemClick}
              >
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 border-t border-main pt-4 px-5">
            {currentUser ? (
              <>
                <button
                  className="block w-full text-left px-4 py-2 text-main hover:bg-light"
                  onClick={handleDashboardNavigate}
                >
                  Dashboard
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-main hover:bg-light"
                  onClick={logout}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <a
                  href="https://portal.planmyadmission.com/login"
                  rel="noreferrer"
                  target="_blank"
                >
                  <p className="px-4 py-2 text-main bg-main text-white rounded-sm text-center">
                    Login
                  </p>
                </a>
                <a
                  href="https://portal.planmyadmission.com/sign-up"
                  rel="noreferrer"
                  target="_blank"
                >
                  <p className="px-4 py-2 border border-main text-main rounded-sm text-center mt-2 hover:bg-main hover:text-white transition">
                    Register
                  </p>
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
