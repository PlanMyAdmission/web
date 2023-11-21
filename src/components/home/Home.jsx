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
        <meta charSet="utf-8" />
        <title>Home - Plan My Admission</title>
      </Helmet>
      <Hero />
      <TechnologyPoweredBy />
      <PlanYourAdmission props={myRef} />
      <HowpmaIsDifferent />
      <Universities />
      <OurPartners />
      <ArticlesSection />
      <SuccessStories />
      <FAQ />
      <JoinUs ref={myRef} />
      <ScrollDown />
      <Outlet />
    </>
  );
};

export default Home;
