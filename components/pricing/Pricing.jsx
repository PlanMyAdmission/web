import React from 'react';
import { pricingPlans } from '@/components/pricing/data.js';
import Card from '@/components/common/PricingCard';
import Header from '@/components/common/Header';
const Pricing = ({ content }) => {
  return (
    <main>
      <Header heading={content?.headerHeading || 'pricing'} />

      <section className="max-w-7xl mx-auto bg-light px-6 py-16 md:p-20 rounded-3xl shadow-sm">
        <h1 className="font-bold text-center text-3xl md:text-5xl pb-4">
          {content?.title || 'Ready to Get Started?'}
        </h1>
        <p className="text-center text-base md:text-lg text-gray-600 mb-10">
          {content?.subtitle || 'Choose a plan tailored to your needs'}
        </p>

        <div className="flex sm:flex-row flex-col justify-center gap-6 max-w-6xl mx-auto">
          {(content?.pricingPlans || pricingPlans).map((plan, index) => (
            <Card key={index} {...plan} useFor="pricing" />
          ))}
        </div>
      </section>
    </main>
  );
};
export default Pricing;
