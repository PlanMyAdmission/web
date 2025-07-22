import React from "react";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import logo from "../../../assets/homeAssets/logo.svg";

const tabItems = [
  { id: 1, name: "Shortlisted", url: "shortlisted" },
  { id: 2, name: "Profile", url: "profile" },
  { id: 3, name: "Recommendations", url: "recommendations" },
  { id: 4, name: "Documents", url: "documents" },
];

const Dashboard = () => {
  const location = useLocation();
  const currentPath = location.pathname.split("/").pop(); // get last segment like 'profile'

const isRootDashboard = ["/dashboard", "/dashboard/"].includes(location.pathname);

if (isRootDashboard) {
  return <Navigate to="/dashboard/profile" replace />;
}

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Dashboard - Plan My Admission</title>
        <link rel="icon" href={logo} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4">
        <nav
          className="bg-light flex justify-start overflow-x-auto hide-scroll-bar whitespace-nowrap snap-x my-10 rounded-md shadow-sm"
          aria-label="Dashboard Tabs"
        >
          {tabItems.map((tab) => {
            const isActive = currentPath === tab.url ;
            return (
              <Link key={tab.id} to={tab.url} className="snap-start">
                <button
                  className={`py-2 px-4 mx-2 my-1 rounded-md transition-all duration-300 
                    ${
                      isActive
                        ? "bg-white text-main font-semibold shadow-md"
                        : "bg-light text-gray-700 hover:bg-white hover:text-main"
                    }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {tab.name}
                </button>
              </Link>
            );
          })}
        </nav>

        <div className="px-2 sm:px-0">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
