import React from "react";

const Heading = ({ heading }) => {
  return (
    <h1 className="flex items-center flex-col text-center md:text-[45px] text-2xl  md:pb-[50px] p-10 font-bold ">
      {heading}
      <span className="border-b-4 md:ml-4 ml-3 border-b-main md:w-[98px] w-[50px] md:py-2 py-1 mb-[10px]"></span>
    </h1>
  );
};

export default Heading;


// <div className="my-10">
// <h1 className="md:text-[45px] text-2xl font-bold text-center my-10 relative after:content['']  after:absolute after:md:w-[7vw] after:w-[20vw] after:border-b-[5px] after:border-b-main after:md:-bottom-4 after:-bottom-2 after:left-[50%] after:-translate-x-[50%]">{heading}</h1>
// </div>