import React from "react";
import Header from "../../higherOrderComponents/Header";
import AboutUsDescription from "./AboutUsDescription";
import OurCoreValues from "./OurCoreValues";
import Founder from "./Founder";
import Advisors from "./Advisors";
import Team from "./Team";
import Band from "../forInstitutions/Band";

const About = () => {
  return (
    <>

      <Header heading="About Us" />
      <AboutUsDescription />
      <OurCoreValues />
      <Founder />
      {/* <Advisors /> */}
      {/* <Team /> */}
      <Band line="Fast Track your journey" cta="Register Now" />
    </>
  );
};

export default About;
