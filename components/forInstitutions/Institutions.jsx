import React from 'react';
import Heading from '@components/higherOrderComponents/Heading';
import Universities from '@/components/home/Universities.jsx';
import Card from '@components/higherOrderComponents/PricingCard';
import Banner from '@/components/forInstitutions/Banner.jsx';
import Features from '@/components/forInstitutions/Features.jsx';
import { pricingPlans } from '@/components/forInstitutions/pricingData.js';
const Institutions = ({ content }) => {
  return (
    <>
      <Banner content={content?.banner} />
      <Heading heading={content?.featuresHeading || 'Features'} />
      <Features sections={content?.featuresSections} />
      <Universities usedFor="institutions" />
      <Heading heading={content?.plansHeading || 'Flexible Plans'} />
      <div className="container relative grid lg:grid-cols-3 grid-cols-1 lg:gap-8 gap-10 max-w-6xl mx-auto mt-10 p-10 ">
        <div className="absolute inset-0 bottom-20 -z-10 bg-light rounded-3xl"></div>
        {(content?.pricingPlans || pricingPlans).map((plan, index) => {
          return <Card key={index} {...plan} />;
        })}
      </div>
    </>
  );
};
export default Institutions;
