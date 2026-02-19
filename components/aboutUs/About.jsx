import React from 'react';
import Header from '@components/higherOrderComponents/Header';
import AboutUsDescription from '@/components/aboutUs/AboutUsDescription.jsx';
import OurCoreValues from '@/components/aboutUs/OurCoreValues.jsx';
import Founder from '@/components/aboutUs/Founder.jsx';
import Advisors from '@/components/aboutUs/Advisors.jsx';
import Team from '@/components/aboutUs/Team.jsx';
import Band from '@/components/forInstitutions/Band.jsx';
const About = () => {
  return (
    <>
      <Header heading="About Us" />
      <AboutUsDescription />
      <OurCoreValues />
      <Founder />
      {}
      {}
      <Band line="Fast Track your journey" cta="Register Now" />
    </>
  );
};
export default About;
