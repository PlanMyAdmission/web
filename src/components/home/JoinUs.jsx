import React from "react";
import joinUs from "../../assets/JoinUs.svg";
import Heading from "../../higherOrderComponents/Heading";
import JoinUsForm from "./JoinUsForm";

const JoinUs = () => {


  return (
    <div>
      <Heading heading="Join Us" />
      <div className="flex md:flex-row flex-col md:justify-evenly items-center sm:px-5">
        <div className="md:w-[500px] w-full px-5 items-center justify-center">
          <p className="font-medium ">
            Register with us to get started for your overseas study admission journey
          </p>
          <img
            src={joinUs}
            alt="joinUs"
            className="relative top-14 -z-10 overflow-hidden sm:left-20"
          />
        </div>
        <JoinUsForm className={"md:w-[400px] w-[90%]"} />
      </div>
    </div>
  );
};

export default JoinUs;
