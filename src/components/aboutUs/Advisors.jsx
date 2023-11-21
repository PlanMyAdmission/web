import React from "react";
import advisors from "../../assets/about-us/leader.svg";
import Heading from "../../higherOrderComponents/Heading";

const Advisors = () => {
  return (
    <div className="my-20">
      <Heading heading="Our Top Advisors" />
      <div className="flex justify-center sm:flex-row flex-col items-center">
        <Leaders name="Full Name" desig="Founder" />
        <Leaders name="Full Name" desig="Founder" />
        <Leaders name="Full Name" desig="Founder" />
      </div>
    </div>
  );
};

const Leaders = ({ name, desig }) => {
  return (
    <div className="m-2">
      <img src={advisors} alt="" className="" />
      <div className="text-white relative -top-12 px-3 bg-gradient-to-t  from-blurpink to-transparent py-3 flex justify-between">
        <p>{name}</p>
        <p>{desig}</p>
      </div>
    </div>
  );
};

export default Advisors;
