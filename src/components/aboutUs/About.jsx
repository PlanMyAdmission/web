import React from "react";
import Header from "../../higherOrderComponents/Header";
import AboutUsDescription from "./AboutUsDescription";
import OurCoreValues from "./OurCoreValues";
import Founder from "./Founder";
import Advisors from "./Advisors";
import Team from "./Team";
import Band from "../forInstitutions/Band";
import { Helmet } from "react-helmet";

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Planmyadmission | Navigating Your Study Abroad Dreams in 2024</title>
        <meta name="title" content="About Planmyadmission | Navigating Your Study Abroad Dreams in 2024" />
        <meta name="description" content="Meet the team behind your 2024 study abroad journey. Learn about our mission and commitment to providing expert advice on colleges, courses, exams, and applications. Your success is our priority." />
        <link rel="canonical" href="https://planmyadmission.com/about" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="About Planmyadmission | Navigating Your Study Abroad Dreams in 2024" />
        <meta property="og:description" content="Meet the team behind your 2024 study abroad journey. Learn about our mission and commitment to providing expert advice on colleges, courses, exams, and applications. Your success is our priority." />
        <meta property="og:image" content="https://planmyadmission.com" />
        <meta property="og:url" content="https://planmyadmission.com/about" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Planmyadmission | Navigating Your Study Abroad Dreams in 2024" />
        <meta name="twitter:description" content="Meet the team behind your 2024 study abroad journey. Learn about our mission and commitment to providing expert advice on colleges, courses, exams, and applications. Your success is our priority." />
      </Helmet>

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
