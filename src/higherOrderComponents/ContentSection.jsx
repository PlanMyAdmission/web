import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import JoinUs from "../components/home/JoinUs";


const ContentSection = ({ id, content, features, btn1, btn2, video, props }) => {
  const navigate = useNavigate()
  const [scrollTo, setScrollTo] = useState(false);
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight - 1150,
      behavior: 'smooth'
      /* you can also use 'auto' behaviour  
         in place of 'smooth' */
    });
  };
  return (
    <div className="flex md:flex-row flex-col-reverse justify-center font-medium max-w-7xl mx-auto px-5 md:px-0 ">
      <div className="px-5 md:mb-14 flex-1">
        <p className="sm:m-2 md:text-left ">{content}</p>
        <ul className="list-disc py-4 md:px-12 px-2 marker:text-main marker:text-[20px]">
          {features.map((item, index) => {
            return <li key={index.toString()}>{item}</li>;
          })}
        </ul>
        <div className="grid grid-cols-2 gap-3 text-2.75xs sm:text-base mb-4">
          <button className="border border-main px-4 py-2 rounded-md bg-main text-white sm:w-2/3 justify-center sm:ml-12" onClick={() => { navigate("/register") }}>
            {btn1}
          </button>
          <button className="border border-main px-4 py-2  sm:w-2/3 rounded-md hover:bg-light " onClick={scrollToBottom}>
            {btn2}
          </button>
        </div>
      </div>
      <div className="flex-1 max-w-md ml-5 sm:ml-28 md:ml-0 mb-5 md:mb-0 md:pr-4">
        <div className="aspect-w-16 aspect-h-9">
          <iframe
            src={video}
            title="Plan my admission"
            // className="pb-10 px-2 md:px-0 h-[300px] rounded-md md:w-[400px] xs:w-[350px] w-[300px] aspect-video"
            className="rounded-sm"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContentSection;
