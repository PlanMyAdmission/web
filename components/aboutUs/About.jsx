import React from 'react';
import Header from '@components/higherOrderComponents/Header';
import AboutUsDescription from '@/components/aboutUs/AboutUsDescription.jsx';
import OurCoreValues from '@/components/aboutUs/OurCoreValues.jsx';
import Founder from '@/components/aboutUs/Founder.jsx';
import Band from '@/components/forInstitutions/Band.jsx';
const About = ({ content }) => {
  return (
    <>
      <Header heading={content?.headerHeading || 'About Us'} />
      <AboutUsDescription content={content?.descriptionSection} />
      <OurCoreValues
        heading={content?.coreValues?.heading}
        items={content?.coreValues?.items}
      />
      <Founder content={content?.founder} />
      <Band {...content?.band} />
    </>
  );
};
export default About;
