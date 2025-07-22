import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Education from "./profile/Education";
import Experience from "./profile/Experience";
import Test_Scores from "./profile/Test_Scores";
import About from "./profile/About";
import { useAuth } from "../../../context/AuthProvider";

const TABS = [
  { id: "#about", label: "About" },
  { id: "#experience", label: "Experience" },
  { id: "#education", label: "Education" },
  { id: "#test_score", label: "Test Scores" },
];

const Profile = () => {
  const [show, setShow] = useState("#about");
  const { uploadImage, currentUser, logout, profileData } = useAuth();
  const [photoURL, setPhotoURL] = useState("");
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      setShow(location.hash);
    }
  }, [location.hash]);

  useEffect(() => {
    if (currentUser?.photoURL) {
      setPhotoURL(currentUser.photoURL);
    } else {
      setPhotoURL(
        "https://ui-avatars.com/api/?name=User&background=random&length=1"
      );
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const file = e.target.files[0];
    const fileExtension = file?.name?.split(".").pop().toLowerCase();
    const allowed = ["jpg", "jpeg", "png"];

    if (!allowed.includes(fileExtension)) {
      return alert(`Only ${allowed.join(", ")} files are allowed.`);
    }

    uploadImage(file, fileExtension);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-0">
      <h1 className="font-bold text-3xl mb-4">User Profile</h1>

      <div className="bg-light p-5 rounded-md flex items-center justify-between flex-wrap gap-4">
        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden">
          <img
            src={profileData?.photoURL || photoURL}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
          <label htmlFor="upload-avatar" className="absolute bottom-0 right-0 cursor-pointer">
            <input
              type="file"
              id="upload-avatar"
              accept="image/*"
              className="hidden"
              onChange={handleChange}
            />
            <div className="bg-main text-white p-1 rounded-full">
              <svg
                className="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 10V3h2v7h7v2h-7v7h-2v-7H3v-2h6z" />
              </svg>
            </div>
          </label>
        </div>
        <button
          onClick={logout}
          className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>

      <div className="flex mt-8 overflow-x-auto hide-scroll-bar border-b border-main">
        {TABS.map((tab) => (
          <Link key={tab.id} to={tab.id} className="flex-shrink-0">
            <button
              className={`py-2 px-4 text-sm md:text-base font-medium transition-colors duration-300 border-b-2 ${
                show === tab.id ? "border-main text-main" : "border-transparent text-gray-500 hover:text-main"
              }`}
            >
              {tab.label}
            </button>
          </Link>
        ))}
      </div>

      <div className="mt-6">
        {show === "#about" && <About />}
        {show === "#experience" && <Experience />}
        {show === "#education" && <Education />}
        {show === "#test_score" && <Test_Scores />}
      </div>
    </div>
  );
};

export default Profile;