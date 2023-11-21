import React from "react";
import university from "../../assets/universityLogo.svg";

const UniversityCard = ({ usedFor, props }) => {
  return (
    <div
      className={`${usedFor === "institutions"
        ? "justify-evenly h-50 py-10"
        : "h-60 justify-between"
        } bg-white drop-shadow-xl  rounded-md md:w-[168px] mx-4 flex flex-col items-center  text-center pt-4 shrink-0 border-[1px] border-light`}
    >
      <img src={props.img} alt="" className="w-1/2" />
      <p className="font-bold px-4 ">
        {props.name}
        <br />
        <span className="text-main font-medium ">{props.location}</span>
      </p>
      <button
        className={`${usedFor === "institutions" ? "hidden" : " "
          } bg-main w-full p-1 text-white rounded-b-lg `}
      >
        Apply
      </button>
    </div>
  );
};

export default UniversityCard;

//https://play.tailwindcss.com/yIA6qPX4Js
