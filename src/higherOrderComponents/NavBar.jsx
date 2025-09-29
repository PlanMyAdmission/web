import React from "react";
import { useState, useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../assets/homeAssets/logo.svg";
import mobile_logo from "../assets/homeAssets/logo_mobile.svg";
import CloseIcon from "@mui/icons-material/Close";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const NavBar = () => {
  const [nav, setNav] = useState(false);
  const toggleMobileNav = () => setNav(!nav);
  const [show, setShow] = useState(false);
  const router = useLocation();
  const navigate = useNavigate();

  const [showDropdown, setShowDropdown] = useState(false);
  const { currentUser, logout } = useAuth();

  const [photoURL, setPhotoURL] = useState(
    "https://imgs.search.brave.com/IfCu-rlEANrldypDGTbEYE4_XyiekbuS1xeWWgBNJ7M/rs:fit:1000:1080:1/g:ce/aHR0cHM6Ly9jZG4x/LnZlY3RvcnN0b2Nr/LmNvbS9pLzEwMDB4/MTAwMC83MS84NS9t/YWxlLWF2YXRhci1w/cm9maWxlLWljb24t/cm91bmQtbWFuLWZh/Y2UtdmVjdG9yLTE4/MzA3MTg1LmpwZw"
  );

  useEffect(() => {
    if (currentUser?.photoURL) {
      setPhotoURL(currentUser.photoURL);
      console.log(currentUser.photoURL);
    }
    setShow(false)
  }, [currentUser]);

  const handelNav = () => {
    setNav(!nav);
  };
  return (
    <div className="">
      <div className="flex flex-row justify-between  max-w-7xl border-b-2 border-main mx-auto items-end py-2 sm:px-4 xl:px-0">
        <Link to="/">
          {/* <h1 className="text-4xl px-5 font-bold text-main">pma.</h1> */}
          <img
            src={logo}
            alt="logo"
            className="hidden md:block relative md:-translate-x-6  md:h-12 h-10 md:scale-150 scale-110 md:top-4 top-2 w-100 mx-2 md:px-4"
            onClick={() => {
              localStorage.removeItem("button")
            }}
          />
          <img
            src={mobile_logo}
            alt="logo"
            className="md:hidden block relative h-10 scale-110 w-100 mx-2 md:px-4"
          />
        </Link>
        <ul className="hidden md:flex text-main text-[18px] space-x-5 md:items-center md:text-[15px] lg:text-[18px] ">
          <NavLink to="/">
            <li
              className={`hover:underline ${router.pathname === "/" ? "font-bold" : ""
                }`}
              onClick={() => {
                localStorage.removeItem("button")
              }}
            >
              Home
            </li>
          </NavLink>
          <Link to="/how-it-works">
            <li
              className={`hover:underline ${router.pathname === "/how-it-works" ? "font-bold" : ""
                }`}
              onClick={() => {
                localStorage.removeItem("button")
              }}
            >
              How It Works
            </li>
          </Link>
          <Link to="/pricing">
            <li
              className={`hover:underline ${router.pathname === "/pricing" ? "font-bold" : ""
                }`}
              onClick={() => {
                localStorage.removeItem("button")
              }}
            >
              Pricing
            </li>
          </Link>

          <Link to="/about">
            <li
              className={`hover:underline ${router.pathname === "/about" ? "font-bold" : ""
                }`}
              onClick={() => {
                localStorage.removeItem("button")
              }}
            >
              About Us
            </li>
          </Link>
          <Link to="/blogs">
            <li
              className={`hover:underline ${router.pathname === "/blogs" ? "font-bold" : ""
                }`}
              onClick={() => {
                localStorage.removeItem("button")
              }}
            >
              Blogs
            </li>
          </Link>
          <Link to="/ai-university-search">
            <li
              className={`hover:underline ${router.pathname === "/ai-university-search" ? "font-bold" : ""
                }`}
              onClick={() => {
                localStorage.removeItem("button")
              }}
            >
              AI University Search
            </li>
          </Link>
          <Link to="/contact">
            <li
              className={`hover:underline ${router.pathname === "/contact" ? "font-bold" : ""
                }`}
              onClick={() => {
                localStorage.removeItem("button")
              }}
            >
              Contact Us
            </li>
          </Link>
        </ul>
        <>
        {currentUser ? (
            <div className="relative">
              <img
                src={photoURL}
                alt="profile"
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-10 h-10 rounded-full cursor-pointer border-2 border-main"
              />
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-main rounded shadow-md z-50 text-sm">
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-light"
                    onClick={() => {
                      setShowDropdown(false);
                      navigate("/dashboard/profile#about");
                    }}
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
              <a href="https://portal.planmyadmission.com/login">
                <button className="bg-main border border-main text-white px-4 py-1 rounded-sm hover:bg-dark-blue transition">
                  Login
                </button>
              </a>
              <a href="https://portal.planmyadmission.com/sign-up">
                <button className="bg-white border border-main text-main px-4 py-1 rounded-sm hover:bg-main hover:text-white transition">
                  Register
                </button>
              </a>
            </div>
          )}
        </>
        <div onClick={handelNav} className="block md:hidden px-4 text-main">
          {!nav ? <MenuIcon /> : <CloseIcon />}
        </div>

        <div
          className={
            nav
              ? "bg-white fixed left-0 top-0 w-[60%] h-full border-r border-r-black-900 duration-700 ease-in-out z-50"
              : "bg-white duration-10 h-0 ease-in border-none fixed left-[-100%]"
          }
          onClick={handelNav}
        >
          <Link to="/">
            <img src={logo} alt="logo" className="scale-120 my-5 " />
          </Link>
          <ul className="mt-5">
            <Link to="/">
              <li
                className={`p-2 pl-5 text-[18px]  ${router.pathname === "/" ? "font-bold" : ":"
                  }`}
              >
                Home
              </li>
            </Link>
            <Link to="/how-it-works">
              <li
                className={`p-2 pl-5 text-[18px]  ${router.pathname === "/how-it-works" ? "font-bold" : ":"
                  }`}
              >
                How It Works
              </li>
            </Link>
            <Link to="/pricing">
              <li
                className={`p-2 pl-5 text-[18px]  ${router.pathname === "/pricing" ? "font-bold" : ":"
                  }`}
              >
                Pricing
              </li>
            </Link>
            <Link to="/about">
              <li
                className={`p-2 pl-5 text-[18px]  ${router.pathname === "/about" ? "font-bold" : ":"
                  }`}
              >
                About Us
              </li>
            </Link>
            <Link to="/blogs">
              <li
                className={`p-2 pl-5 text-[18px]  ${router.pathname === "/blogs" ? "font-bold" : ":"
                  }`}
              >
                Blogs
              </li>
            </Link>
            <Link to="/ai-university-search">
              <li
                className={`p-2 pl-5 text-[18px]  ${router.pathname === "/ai-university-search" ? "font-bold" : ":"
                  }`}
              >
                AI University Search
              </li>
            </Link>
            <Link to="/contact">
              <li
                className={`p-2 pl-5 text-[18px]  ${router.pathname === "/contact" ? "font-bold" : ":"
                  }`}
              >
                Contact us
              </li>
            </Link>
          </ul>
          <div className="mt-6 border-t border-main pt-4">
          {currentUser ? (
            <>
              <button
                className="block w-full text-left px-4 py-2 text-main hover:bg-light"
                onClick={() => {
                  navigate("/dashboard/profile#about");
                  toggleMobileNav();
                }}
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
              <a href="https://portal.planmyadmission.com/login">
                <p className="px-4 py-2 text-main bg-main text-white rounded-sm text-center">Login</p>
              </a>
              <a href="https://portal.planmyadmission.com/sign-up">
                <p className="px-4 py-2 border border-main text-main rounded-sm text-center mt-2 hover:bg-main hover:text-white transition">Register</p>
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
