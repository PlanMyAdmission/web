import React from "react";
import { useState, useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../assets/homeAssets/logo.svg";
import mobile_logo from "../assets/homeAssets/logo_mobile.svg";
import CloseIcon from "@mui/icons-material/Close";
import {
  Link,
  Navigate,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const NavBar = () => {
  const [nav, setNav] = useState(false);
  const [show, setShow] = useState(false);
  const router = useLocation();
  const navigate = useNavigate();
  const [loginClick, setClick] = useState(0)
  const { currentUser, logout, profileData } = useAuth();
  const showSignOut = () => {
    // console.log("sign out....");
    setShow(!show);
  };
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
              setClick(0)
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
                setClick(0)
                localStorage.removeItem("button")
              }}
            >
              Home
            </li>
          </NavLink>
          <Link to="/explore">
            <li
              className={`hover:underline ${router.pathname === "/explore" ? "font-bold" : ""
                }`}
              onClick={() => {
                setClick(0)
                localStorage.removeItem("button")
              }}
            >
              Explore University
            </li>
          </Link>
          <Link to="/about">
            <li
              className={`hover:underline ${router.pathname === "/about" ? "font-bold" : ""
                }`}
              onClick={() => {
                setClick(0)
                localStorage.removeItem("button")
              }}
            >
              About
            </li>
          </Link>
          <Link to="/pricing">
            <li
              className={`hover:underline ${router.pathname === "/pricing" ? "font-bold" : ""
                }`}
              onClick={() => {
                setClick(0)
                localStorage.removeItem("button")
              }}
            >
              Pricing
            </li>
          </Link>
          <Link to="/contact">
            <li
              className={`hover:underline ${router.pathname === "/contact" ? "font-bold" : ""
                }`}
              onClick={() => {
                setClick(0)
                localStorage.removeItem("button")
              }}
            >
              Contact Us
            </li>
          </Link>
        </ul>
        <>
          {currentUser ? (
            <div className="flex flex-col">
              <img
                className="w-10 h-auto rounded-full cursor-pointer btn dropdown-toggle" style={{ border: "transparent" }}
                id="dropdownMenuLink" data-bs-toggle="dropdown"
                src={profileData?.photoURL ? profileData.photoURL : photoURL}
                alt="profile"
                // onClick={showSignOut}
                onClick={() => {
                  // if (window.location.href.includes("dashboard")) {
                  //   showSignOut()
                  // }
                  // else {
                  //   navigate("/dashboard/profile#about")
                  // }

                  // console.log(window.location.href)
                  showSignOut()
                  console.log(show)
                }}
              />
              {show && (
                // <div className="absolute w-1/6 left-1/2 transform -translate-x-1/2  sm:top-16 bg-main sm:w-1/7 sm:right-2 text-light rounded-md p-1 outline-none">
                <div className={show ? `dropdown-menu flex flex-col` : "hidden"}>
                  <button
                    className="invisible absolute dropdown-item py-1 mt-11 rounded-sm bg-main text-light px-2 right-1/2 translate-x-full sm:right-2 sm:-translate-x-0 2xl:right-10 2xl:-translate-x-12 2xl:mr-10 md:visible"
                    onClick={logout}
                  >
                    Sign Out
                  </button>
                  <button
                    className="invisible absolute dropdown-item py-1 mt-2 rounded-sm bg-main text-light px-2 right-1/2 translate-x-full sm:right-2 sm:-translate-x-0 2xl:right-10 2xl:-translate-x-12 2xl:mr-10 md:visible"
                    onClick={() => {
                      if (!window.location.href.includes("dashboard")) {
                        navigate("/dashboard/profile#about")
                      }
                      setShow(!show);

                    }}
                  >
                    Dashboard
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex justify-center items-end space-x-1">
              <Link to="/login">
                <button className={localStorage.getItem("button") == "login" ? "text-white outline outline-main w-[100px] text-[18px] bg-main uppercase p-1 outline mr-1" : "w-[100px] text-main text-[18px] uppercase p-1 outline mr-1 hover:bg-light duration-100"}
                  onClick={() => {
                    localStorage.setItem("button", "login")
                  }}>
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className={localStorage.getItem("button") == "reg" ? "text-white outline outline-main w-[100px] text-[18px] bg-main uppercase p-1 outline mr-1" : "w-[100px] text-main text-[18px] uppercase p-1 outline mr-1 hover:bg-light duration-100"}
                  onClick={() => {
                    localStorage.setItem("button", "reg")
                  }}>
                  Register
                </button>
              </Link>
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
            <Link to="/explore">
              <li
                className={`p-2 pl-5 text-[18px]  ${router.pathname === "/explore" ? "font-bold" : ":"
                  }`}
              >
                Explore Universities
              </li>
            </Link>
            <Link to="/about">
              <li
                className={`p-2 pl-5 text-[18px]  ${router.pathname === "/about" ? "font-bold" : ":"
                  }`}
              >
                About
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
            <Link to="/contact">
              <li
                className={`p-2 pl-5 text-[18px]  ${router.pathname === "/contact" ? "font-bold" : ":"
                  }`}
              >
                Contact us
              </li>
            </Link>
          </ul>
          {currentUser ? <div className="flex flex-col text-main font-semibold">
            {/*  */}
            <button
              className="py-1 mt-12 rounded-sm bg-main text-light p-1 ml-5 w-1/2 text-2xs sm:text-base sm:w-1/3"
              onClick={() => {
                if (!window.location.href.includes("dashboard")) {
                  navigate("/dashboard/profile#about")
                }
                setShow(!show);

              }}
            >
              Dashboard
            </button>
            <button
              className="py-1 mt-2 rounded-sm bg-main text-light p-2 ml-5 w-1/2 text-2xs sm:text-base sm:w-1/3"
              onClick={logout}
            >
              Sign Out
            </button>
          </div> : <div className="flex flex-col text-main font-semibold">
            <Link to="/login">
              <p className="p-2 pl-5 text-[18px] ">Login</p>
            </Link>
            <Link to="/register">
              <p className="p-2 pl-5 text-[18px] ">Register</p>
            </Link>
          </div>}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
