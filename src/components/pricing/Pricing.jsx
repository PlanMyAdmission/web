import React from 'react';
import { pricingPlans } from './data';
import Card from '../../higherOrderComponents/PricingCard';
import FAQ from '../home/FAQ';
import Header from '../../higherOrderComponents/Header';
import { pricingFAQ } from './data';

const Pricing = () => {
  return (
    <main>
      <Header heading="pricing" />

      <section className="max-w-7xl mx-auto bg-light px-6 py-16 md:p-20 rounded-3xl shadow-sm">
        <h1 className="font-bold text-center text-3xl md:text-5xl pb-4">
          Ready to Get Started?
        </h1>
        <p className="text-center text-base md:text-lg text-gray-600 mb-10">
          Choose a plan tailored to your needs
        </p>

        <div className="flex sm:flex-row flex-col justify-center gap-6 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <Card key={index} {...plan} useFor="pricing" />
          ))}
        </div>
      </section>

      <section className="mt-16">
        <FAQ data={pricingFAQ} />
      </section>
    </main>
  );
};

export default Pricing;
