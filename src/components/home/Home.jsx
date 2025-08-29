import React from "react";
import { Outlet } from "react-router-dom";
import ArticlesSection from "./ArticlesSection";
import FAQ from "./FAQ";
import Hero from "./Hero";
import HowpmaIsDifferent from "./HowpmaIsDifferent";
import JoinUs from "./JoinUs";
import OurPartners from "./OurPartners";
import PlanYourAdmission from "./PlanYourAdmission";
import SuccessStories from "./SuccessStories";
import TechnologyPoweredBy from "./TechnologyPoweredBy";
import Universities from "./Universities";
import ScrollDown from "../../higherOrderComponents/ScrollDown";
import { Helmet } from "react-helmet"
import { useRef } from "react";

const Home = () => {
  const myRef = useRef()
  return (
    <>
      <Helmet>
        <title>Plan My Admission - Trusted Overseas Education Consultants 2025</title>
        <meta name="title" content="Plan My Admission - Trusted Overseas Education Consultants 2025" />
        <meta name="description" content="Plan My Admission offers expert overseas education consulting with personalized university admissions guidance, student visa support, and career planning. Leveraging advanced AI tools to enhance your study abroad experience and success." />
        <meta name="keywords" content="overseas education consultant, study abroad admission help, student visa assistance, international university counselling, best education consultants 2025, study abroad guidance, AI-powered education consulting, university admission experts, career planning abroad" />
        <link rel="canonical" href="https://planmyadmission.com/" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="Unlock Opportunities: Apply for Study Abroad 2024 Courses" />
        <meta property="og:description" content="Discover the best study abroad options for 2024 with expert advice on colleges, courses, exams, and the admission process. Get free counselling for your international journey." />
        <meta property="og:image" content="https://planmyadmission.com" />
        <meta property="og:url" content="https://planmyadmission.com" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Unlock Opportunities: Apply for Study Abroad 2024 Courses" />
        <meta name="twitter:description" content="Discover the best study abroad options for 2024 with expert advice on colleges, courses, exams, and the admission process. Get free counselling for your international journey" />
      </Helmet>

      <Hero />
      <TechnologyPoweredBy />
      <PlanYourAdmission props={myRef} />
      <HowpmaIsDifferent />
      <OurPartners />

      <SuccessStories />
      {/* <Universities /> */}
      <ArticlesSection />

      <FAQ />
      <JoinUs ref={myRef} />
      <ScrollDown />
      <Outlet />
    </>
  );
};

export default Home;
