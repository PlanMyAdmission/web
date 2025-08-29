import React from "react";
import { pricingPlans } from "./data";
import Card from "../../higherOrderComponents/PricingCard";
import FAQ from "../home/FAQ";
import Header from "../../higherOrderComponents/Header";
import { Helmet } from "react-helmet";

const Pricing = () => {
  return (
    <main>
      <Helmet>
        <title>Craft Your Academic Journey with our Exclusive Pricing and Plans</title>
        <meta name="title" content="Craft Your Academic Journey with our Exclusive Pricing and Plans" />
        <meta name="description" content="Discover affordable excellence with planmyadmission’s budget-friendly pricing options" />
        <link rel="canonical" href="https://planmyadmission.com/pricing" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <meta property="og:title" content="Craft Your Academic Journey with our Exclusive Pricing and Plans" />
        <meta property="og:description" content="Discover affordable excellence with planmyadmission’s budget-friendly pricing options" />
        <meta property="og:image" content="https://planmyadmission.com" />
        <meta property="og:url" content="https://planmyadmission.com/pricing" />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Craft Your Academic Journey with our Exclusive Pricing and Plans" />
        <meta name="twitter:description" content="Discover affordable excellence with planmyadmission’s budget-friendly pricing options" />
      </Helmet>

      <Header heading="pricing" />

      <section className="max-w-7xl mx-auto bg-light px-6 py-16 md:p-20 rounded-3xl shadow-sm">
        <h1 className="font-bold text-center text-3xl md:text-5xl pb-4">
          Ready to Get Started?
        </h1>
        <p className="text-center text-base md:text-lg text-gray-600 mb-10">
          Choose a plan tailored to your needs
        </p>

        <div className="flex flex-wrap justify-center gap-10 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <Card key={index} {...plan} useFor="pricing" />
          ))}
        </div>
      </section>

      <section className="mt-16">
        <FAQ />
      </section>
    </main>
  );
};

export default Pricing;
