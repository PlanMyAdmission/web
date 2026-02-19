'use client';

import React, { useRef } from 'react';
import ArticlesSection from '@/components/home/ArticlesSection.jsx';
import FAQ from '@/components/home/FAQ.jsx';
import Hero from '@/components/home/Hero.jsx';
import HowpmaIsDifferent from '@/components/home/HowpmaIsDifferent.jsx';
import HowItWorksSection from '@/components/home/HowItWorksSection.jsx';
import JoinUs from '@/components/home/JoinUs.jsx';
import OurPartners from '@/components/home/OurPartners.jsx';
import PlanYourAdmission from '@/components/home/PlanYourAdmission.jsx';
import SuccessStories from '@/components/home/SuccessStories.jsx';
import TechnologyPoweredBy from '@/components/home/TechnologyPoweredBy.jsx';
import ScrollDown from '@components/higherOrderComponents/ScrollDown';
const Home = () => {
  const myRef = useRef();
  return (
    <>
      <Hero />
      <TechnologyPoweredBy />
      <PlanYourAdmission props={myRef} />
      <HowpmaIsDifferent />
      <OurPartners />

      <SuccessStories />
      {}
      <ArticlesSection />

      <FAQ />
      <HowItWorksSection />
      <JoinUs />
      <ScrollDown />
    </>
  );
};
export default Home;
