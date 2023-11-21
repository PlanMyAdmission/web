import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import advisors from "../../../assets/about-us/leader.svg";
import Education from "./profile/Education";
import Experience from "./profile/Experience";
import Preferences from "./profile/Preferences";
import Test_Scores from "./profile/Test_Scores";
import About from "./profile/About";
import { useAuth } from "../../../context/AuthProvider";

const Profile = () => {
  const [show, setShow] = useState("#about");
  const { uploadImage, currentUser, logout, profileData } = useAuth();
  const [photoURL, setPhotoURL] = useState(
    "https://imgs.search.brave.com/IfCu-rlEANrldypDGTbEYE4_XyiekbuS1xeWWgBNJ7M/rs:fit:1000:1080:1/g:ce/aHR0cHM6Ly9jZG4x/LnZlY3RvcnN0b2Nr/LmNvbS9pLzEwMDB4/MTAwMC83MS84NS9t/YWxlLWF2YXRhci1w/cm9maWxlLWljb24t/cm91bmQtbWFuLWZh/Y2UtdmVjdG9yLTE4/MzA3MTg1LmpwZw"
  );
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    console.log("handling change....");
    let file = e.target.files[0];
    const fileExtension = file.name.split(".").at(-1);
    const allowedFileTypes = ["jpg", "png"];
    if (!allowedFileTypes.includes(fileExtension)) {
      window.alert(
        `File does not support ${fileExtension} Files type must be ${allowedFileTypes.join(
          ", "
        )}`
      );
      return false;
    }

    if (file) {
      setPhoto(file);
      console.log("uploading....." + e.target.files[0].size);
      // handleSubmit();
      uploadImage(file, fileExtension, setLoading);
    }
  };

  const handleSubmit = () => { };

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      setShow(location.hash);
    }
  }, [location]);

  useEffect(() => {
    if (currentUser?.photoURL) {
      setPhotoURL(currentUser.photoURL);
      console.log(currentUser.photoURL);
    }
  }, [currentUser]);

  const buttons =
    "border-t-2 border-white ease-in-out duration-10 active:border-main cursor-pointer w-full py-2 px-2";
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="font-bold text-3xl">User Profile</h1>
      <div className="bg-light my-10 flex p-5 rounded-md justify-between">
        <div class="relative flex items-center justify-center md:h-24 md:w-24 h-14 w-14 rounded-full bg-gray-300">
          <img
            className="h-full w-full rounded-full object-cover"
            src={profileData?.photoURL ? profileData.photoURL : photoURL}
            alt="Avatar"
          />
          <label for="upload-avatar" className="absolute bottom-0 right-0">
            <svg
              className="md:h-6 md:w-6 h-4 w-4 text-white rounded-full p-1 cursor-pointer bg-main"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9 10V3h2v7h7v2h-7v7h-2v-7H3v-2h6z" />
            </svg>
            <input
              id="upload-avatar"
              type="file"
              accept="image/*"
              className="absolute opacity-0 bottom-0 right-0 cursor-pointer"
              onChange={handleChange}
            />
          </label>
        </div>
        <button className="" onClick={logout}>
          Sign Out
        </button>
      </div>

      <div className="border-b-2 border-main max-w-5xl mx-auto flex my-10 text-center overflow-x-auto whitespace-nowrap hide-scroll-bar">
        <Link
          to="#about"
          className={`${buttons} +${location.hash === "#about" ? "border-t border-main" : " "
            }`}
        >
          <button className="px-4 md:px-0">About</button>
        </Link>
        <Link
          to="#experience"
          className={`${buttons} +${location.hash === "#experience" ? "border-t border-main" : " "
            }`}
        >
          <button className="px-4 md:px-0">Experience</button>
        </Link>
        <Link
          to="#education"
          className={`${buttons} +${location.hash === "#education" ? "border-t border-main" : " "
            }`}
        >
          <button className="px-4 md:px-0">Education</button>
        </Link>
        <Link
          to="#test_score"
          className={`${buttons} +${location.hash === "#test_score" ? "border-t border-main" : " "
            }`}
        >
          <button className="px-4 md:px-0">Test Scores</button>
        </Link>
        {/* <Link
          to="#preferences"
          className={`${buttons} +${
            location.hash === "#preferences" ? "border-t border-main" : " "
          }`}
        >
          <button className="px-4 md:px-0">Preferences</button>
        </Link> */}
      </div>
      <div>
        {show === "#about" && <About />}
        {show === "#experience" && <Experience />}
        {show === "#education" && <Education />}
        {show === "#test_score" && <Test_Scores />}
        {/* {show === "#preferences" && <Preferences />} */}
      </div>
    </div>
  );
};

export default Profile;
