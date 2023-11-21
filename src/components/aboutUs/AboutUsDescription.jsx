import React from "react";
import aboutusTeam from "../../assets/about-us/about-us.svg";

const AboutUsDescription = () => {
  return (
    <div className="max-w-7xl md:mx-auto flex md:flex-row flex-col mt-20 justify-center items-center px-5 gap-5">
      <div className="md:w-1/2 w-full">
        <img src={aboutusTeam} alt="" className="" />
      </div>
      <div className="md:w-1/2 md:px-10">
        At Planmyadmission, we are a young and dynamic team dedicated to making overseas education a seamless and stress-free experience for students. Our company was founded with a vision to revolutionize the education industry by using AI/ML technology to assist students in finding the best opportunities for their academic and career growth.

      </div>
    </div>
  );
};

export default AboutUsDescription;
{
  /* <div className=" w-[73px] bg-main h-[4px] "></div>
        <div className=" font-bold py-2 md:mr-20">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam ad
          porro temporibus distinctio a, et maxime quasi quia fuga cum! In.
        </div> */
}
