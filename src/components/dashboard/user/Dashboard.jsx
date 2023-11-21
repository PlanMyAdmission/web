import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Documents from "./Documents";
import Profile from "./Profile";
import Recommendations from "./Recommendations";
import { Helmet } from "react-helmet";
import logo from "../../../assets/homeAssets/logo.svg"

// const Dashboard = () => {
//   const [tab, setTab] = useState("dashboard");
//   const GET_CURRENT_LOCATION = window.location.pathname;
//   // console.log(GET_CURRENT_LOCATION);
//   const style =
//     "py-2 px-4  focus:bg-white active:bg-white   focus:outline-none outline-none mx-2 my-1 rounded-md transition-all duration-500 ease-in-out  ";
//   return (
//     <div className="max-w-7xl mx-auto">
//       <div className=" bg-light md:max-w-7xl md:mx-auto flex justify-start rounded-md overflow-x-auto  hide-scroll-bar whitespace-nowrap snap-x my-10 ">
//         <Link to="/dashboard">
//           <button
//             autoFocus={true}
//             className={style}
//             onClick={() => setTab("dashboard")}
//           >
//             Dashboard
//           </button>
//         </Link>
//         <Link to="recommendations">
//           <button className={style} onClick={() => setTab("recommendations")}>
//             Recommendations
//           </button>
//         </Link>
//         <Link to="profile">
//           <button className={style} onClick={() => setTab("profile")}>
//             Profile
//           </button>
//         </Link>
//         <Link to="documents">
//           <button className={style} onClick={() => setTab("documents")}>
//             Documents
//           </button>
//         </Link>
//       </div>
//       <>
//         {tab === "profile" && <Profile />}
//         {tab === "dashboard" && <Dashboard_mini />}
//         {tab === "documents" && <Documents />}
//         {tab === "recommendations" && <Recommendations />}
//       </>
//     </div>
//   );
// };

const data = [
  {
    id: 1,
    name: "Shortlisted",
    url: "shortlisted",
  },
  {
    id: 2,
    name: "Profile",
    url: "profile",
  },
  {
    id: 3,
    name: "Recommendations",
    url: "recommendations",
  },
  {
    id: 4,
    name: "Documents",
    url: "documents",
  },
];

const Dashboard = () => {
  const style =
    "py-2 px-4  focus:bg-white active:bg-white focus:outline-none outline-none mx-2 my-1 rounded-md transition-all duration-500 ease-in-out  ";
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Dashboard - Plan My Admission</title>
        <link rel="icon" href={logo} />
      </Helmet>
      <div className="max-w-7xl mx-auto">
        <div className=" bg-light md:max-w-7xl md:mx-auto flex justify-start rounded-md overflow-x-auto hide-scroll-bar whitespace-nowrap snap-x my-10 ">
          {data.map((topic) => {
            return (
              <span key={topic.id}>
                <Link to={topic.url}>
                  <button autoFocus={false} className={style}>
                    {topic.name}
                  </button>
                </Link>
              </span>
            );
          })}
        </div>
        <Outlet />
      </div>
    </>
  );
};

export default Dashboard;
