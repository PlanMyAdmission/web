import React from "react";
import Heading from "../../higherOrderComponents/Heading";
import Universities from "../home/Universities";
import Card from "../../higherOrderComponents/PricingCard";
import Band from "./Band";
import Banner from "./Banner";
import Features from "./Features";
import { pricingPlans } from "./pricingData";
const Institutions = () => {
  return (
    <>
      <Banner />
      <Heading heading="Features" />
      <Features />
      <Universities usedFor="institutions" />
      <Heading heading="Flexible Plans" />
      <div className="container relative grid lg:grid-cols-3 grid-cols-1 lg:gap-8 gap-10 max-w-6xl mx-auto mt-10 p-10 ">
        <div className="absolute inset-0 bottom-20 -z-10 bg-light rounded-3xl"></div>
        {pricingPlans.map((plan, index) => {
          return <Card key={index} {...plan} />; //card
        })}
      </div>
      {/* <div className="hidden md:block mt-10 bg-white h-5"></div> */}
      <Band line="Looking for more details" cta="Learn More" />
    </>
  );
};

export default Institutions;
