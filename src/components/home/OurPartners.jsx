import React from "react";
import MicroSoft from "../../assets/Microsoft.png";
import google from "../../assets/google.svg";
import Heading from "../../higherOrderComponents/Heading";

const OurPartners = () => {
  return (
    <>
      <Heading heading={"Technology Powered by"} />
      <div className="flex flex-row  justify-evenly items-center md:p-4  h-full w-full">
        <div className="w-1/4 flex justify-center">
          <img src={google} alt="" />
        </div>
        <div className="w-1/4 flex justify-center">
          <img src={MicroSoft} alt="" />
        </div>
        <div className="w-1/4 flex justify-center">
          <p className="font-medium text-lg sm:text-3xl text-main">PMA AI Tools</p>
        </div>
      </div>
    </>
  );
};

export default OurPartners;
