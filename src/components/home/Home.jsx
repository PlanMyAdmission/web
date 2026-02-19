"use client";

import React, { useRef } from "react";
import ArticlesSection from "./ArticlesSection";
import FAQ from "./FAQ";
import Hero from "./Hero";
import HowpmaIsDifferent from "./HowpmaIsDifferent";
import HowItWorksSection from "./HowItWorksSection";
import JoinUs from "./JoinUs";
import OurPartners from "./OurPartners";
import PlanYourAdmission from "./PlanYourAdmission";
import SuccessStories from "./SuccessStories";
import TechnologyPoweredBy from "./TechnologyPoweredBy";
import ScrollDown from "../../higherOrderComponents/ScrollDown";

const Home = () => {
  const myRef = useRef()
  return (
    <>
      <Hero />
      <TechnologyPoweredBy />
      <PlanYourAdmission props={myRef} />
      <HowpmaIsDifferent />
      <OurPartners />

      <SuccessStories />
      {/* <Universities /> */}
      <ArticlesSection />

      <FAQ />
      <HowItWorksSection />
      <JoinUs ref={myRef} />
      <ScrollDown />
    </>
  );
};

export default Home;
