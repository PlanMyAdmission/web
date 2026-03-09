import React from 'react';
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
import ScrollDown from '@components/common/ScrollDown';
const Home = ({ content = {}, articles = [] }) => {
  return (
    <>
      <Hero content={content.hero} />
      <TechnologyPoweredBy items={content.technologyPoweredBy?.items} />
      <PlanYourAdmission contentData={content.planYourAdmission} />
      <HowpmaIsDifferent
        heading={content.howDifferent?.heading}
        sections={content.howDifferent?.sections}
      />
      <OurPartners />

      <SuccessStories />
      <ArticlesSection articles={articles} />

      <FAQ />
      <HowItWorksSection
        heading={content.howItWorks?.heading}
        sectionText={content.howItWorks?.sectionText}
        startHeading={content.howItWorks?.startHeading}
        timeline={content.howItWorks?.timeline}
      />
      <JoinUs />
      <ScrollDown />
    </>
  );
};
export default Home;
