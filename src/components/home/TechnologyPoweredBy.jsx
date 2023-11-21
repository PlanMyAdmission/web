import React from "react";
import MicroSoft from "../../assets/Microsoft.png";
import google from "../../assets/google.svg";

const TechnologyPoweredBy = () => {
  return (
    <div className="flex md:flex-row flex-col md:justify-evenly justify-center items-center bg-light md:p-4 my-[40px] md:h-[79px] sm:h-[40px] w-full  ">
      <div className="grid grid-cols-2 sm:grid-cols-4 items-center h-full w-full">
        <div className=" col-span-1 flex justify-center border sm:border-0 p-4 sm:p-0">
          <p className="font-medium text-[10px] md:text-xl"><label className="text-main">10+ Years Experts</label><br></br> Plan Your Overseas Journey</p>
        </div>
        <div className="col-span-1 flex justify-center border sm:border-0 p-4 sm:p-0 bg-white sm:bg-light">
          <p className="font-medium text-[10px] md:text-xl"><label className="text-main">1500+ University</label><br></br> 95%+ Visa Success Rate</p>
        </div>
        <div className="col-span-1 flex justify-center border sm:border-0 p-4 sm:p-0 bg-white sm:bg-light">
          <p className="font-medium text-[10px] md:text-xl"><label className="text-main">AI + Human</label><br></br>To Ensure Your Success</p>
        </div>
        <div className="col-span-1 flex justify-center border sm:border-0 p-4 sm:p-0 ">
          <p className="font-medium text-[10px] md:text-xl"><label className="text-main">Zero Service Charges</label><br></br>Till NOV'2023</p>
        </div>
      </div>
    </div>
  );
};

export default TechnologyPoweredBy;
