import React from 'react';
import Header from '@components/common/Header';
import AboutUsDescription from '@/components/about/AboutUsDescription.jsx';
import OurCoreValues from '@/components/about/OurCoreValues.jsx';
import Founder from '@/components/about/Founder.jsx';
import Band from '@/components/for-institutions/Band.jsx';
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
