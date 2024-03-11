import React, { useState } from "react";
import ContentSection from "../../higherOrderComponents/ContentSection";
import data from "./featureData";

const Features = () => {
  const style =
    "py-2 px-2 font-semibold focus:bg-white active:bg-white  focus:outline-none outline-none mx-2 my-1 w-full rounded-md transition-all duration-500 ease-in-out  ";

  const [show, setShow] = useState("firstCard");

  return (
    <div>
      <div className="bg-light md:max-w-5xl md:mx-auto flex justify-safe rounded-md overflow-x-auto  hide-scroll-bar whitespace-nowrap snap-x ">
        <button
          autoFocus={true}
          className={style}
          onClick={() => setShow("firstCard")}
        >
          Enrollment Suite
        </button>
        <button className={style} onClick={() => setShow("secondCard")}>
          Employment Suite
        </button>
        <button className={style} onClick={() => setShow("thirdCard")}>
          Graduation Suite
        </button>
        <button className={style} onClick={() => setShow("fourthCard")}>
          AI Tools and 24/7 Support
        </button>
      </div>
      <div className="my-20">
        {show === "firstCard" && (
          <ContentSection
            className=" transition-all duration-1000 ease-in"
            {...data[0]}
          />
        )}
        {show === "secondCard" && (
          <ContentSection
            className=" transition-all duration-1000 ease-in"
            {...data[1]}
          />
        )}
        {show === "thirdCard" && (
          <ContentSection
            className=" transition-all duration-1000 ease-in"
            {...data[2]}
          />
        )}
        {show === "fourthCard" && (
          <ContentSection
            className=" transition-all duration-1000 ease-in"
            {...data[3]}
          />
        )}
      </div>
    </div>
  );
};

export default Features;
