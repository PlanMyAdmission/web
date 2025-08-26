import React, { lazy, Suspense, useEffect, useState } from "react";
import { Route, Routes, useLocation, Outlet, Navigate } from "react-router-dom";
import Home from "./components/home/Home";
import Contact from "./components/contact-us/Contact";
import Dashboard from "./components/dashboard/user/Dashboard";
import Education from "./components/dashboard/user/profile/Education";
import Documents from "./components/dashboard/user/Documents";
import Recommendations from "./components/dashboard/user/Recommendations";
import { AuthProvider } from "./context/AuthProvider";
import Topic from "./components/dashboard/user/Topic";
import Landing from "./components/explore_university/Universities/University";
import Blog from "./components/home/Blog";
import ProtectedRoutes from "./components/ProtectedRoutes";
import { useAuth } from "./context/AuthProvider";
import ExploreUniversityData from "./components/explore_university/ExploreUniversityData"
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';






// import Article1 from "./higherOrderComponents/Articles/Article1";



//To be uncommented.....

const Explore = lazy(() => import("./components/explore_university/Explore"));
const Profile = lazy(() => import("./components/dashboard/user/Profile"));
const Pricing = lazy(() => import("./components/pricing/Pricing"));
const Terms = lazy(() => import("./components/privacy-policy/Terms"));
const Privacy = lazy(() => import("./components/privacy-policy/Privacy"));
const HowItWorks = lazy(() => import("./components/how-it-works/HowItWorks"));
const NotFound = lazy(() => import("./higherOrderComponents/404"));
const GoToTop = lazy(() => import("./higherOrderComponents/GoToTop"));
const About = lazy(() => import("./components/aboutUs/About"));
const Article1 = lazy(() => import("./higherOrderComponents/Articles/Article1"))
const Article2 = lazy(() => import("./higherOrderComponents/Articles/Article2"))
const Article3 = lazy(() => import("./higherOrderComponents/Articles/Article3"))
const Article4 = lazy(() => import("./higherOrderComponents/Articles/Article4"))
const Institutions = lazy(() =>
  import("./components/forInstitutions/Institutions")
);
const NavBar = lazy(() => import("./higherOrderComponents/NavBar"));
const Footer = lazy(() => import("./higherOrderComponents/Footer"));

const ScrollToTopOnMount = () => {
  const pathname = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);
  return null;
};




const App = () => {
  ScrollToTopOnMount();
  const [isSignedIn, setSignedIn] = useState(false)

  console.log("hello")
  // const { isSignedIn } = useAuth() ?? false
  useEffect(() => {
    setSignedIn(false)
    const lg = localStorage.getItem("logged")
    console.log(isSignedIn)
    if (lg != null) {
      setSignedIn(lg == "true" ? true : false)
    }

  })

  return (
    <AuthProvider>
      {/* <ProtectedRoutes checkAuth={checkAuth} /> */}
      <Suspense fallback={
        <div role="status" class="flex align-items-center justify-center ">
          <svg aria-hidden="true" class="w-12 h-12 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600 mt-80 text-main" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
          </svg>
          <span class="sr-only">Loading...</span>
        </div>
      }>
        <NavBar />
        <GoToTop />

        <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />

        <Routes>
          <Route path="/">
            <Route index path="/" element={<Home />} />
            <Route index path="home" element={<Home />} />
            <Route exact path="contact" element={<Contact />} />
            <Route exact path="about" element={<About />} />
            <Route exact path="pricing" element={<Pricing />} />
            <Route exact path="for-institutions" element={<Institutions />} />
            <Route exact path="terms&conditions" element={<Terms />} />
            <Route exact path="privacy-policy" element={<Privacy />} />
            <Route exact path="how-it-works" element={<HowItWorks />} />
            <Route exact path="/Navigating-the-American-Campus" element={<Article1 />} />
            <Route exact path="/Embarking-on-Excellence" element={<Article2 />} />
            <Route exact path="/Pennsylvania-State-University" element={<Article3 />} />
            <Route exact path="/Mastering-the-Art-of-Financial-Planning" element={<Article4 />} />
            {/* {isSignedIn == false ? <Route exact path="login" element={<Login />} />
              : <Route exact path="login" element={<NotFound />} />
            }
            {isSignedIn == false ? <Route exact path="register" element={<Register />} />
              : <Route exact path="register" element={<NotFound />} />
            } */}
            {/* Login and Register routes removed - now using external URLs */}
            {/* <Route exact path="register" element={<Register />} /> */}
            <Route exact path="explore" element={<Explore />} />
            {/* <Route element={<ProtectedRoutes />}> */}
            {/* {isSignedIn == true ?
              <Route path="dashboard" element={<Dashboard />}>
                      <Route index path="dashboard" element={<Dashboard />} />
                    <Route exact path="profile" element={<Profile />} />
                    <Route exact path="documents" element={<Documents />} />
                    <Route
                      exact
                      path="recommendations"
                      element={<Recommendations />}
                    />
                <Route path=":topic_url" element={<Topic />} />
                <Route path="recommendations/university" element={<Landing />} />
                <Route path="shortlisted/university" element={<Landing />} />
              </Route> : <Route path="dashboard" element={<NotFound />} />} */}
            {/* </Route> */}
            <Route exact path="explore/university" element={<ExploreUniversityData />} />
            <Route index path="blogs" element={<Blog />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <Outlet />
      </Suspense>
    </AuthProvider>
  );
};

export default App;
