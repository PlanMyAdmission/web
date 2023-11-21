import React from "react";
import ArticleImage from "../assets/homeAssets/ArticleImage.svg";
//md:hover:border-b-main
const ArticleCard = () => {
  return (
    <div className="snap-center shrink-0">
      <div className="md:max-w-sm w-full transition duration-500 ease-in-out border-b-4 border-white  mx-auto md:mx-0 mb-3 md:mb-0">
        <img className="w-full" src={ArticleImage} alt="ArticleImage" />
        <div className="py-3">
          <p className="md:text-2xl text-xl font-semibold leading-tight">
            Guide for studying abroad after 12th for Indian Students
          </p>
          <p className="py-2">
            Studying for a bachelor's degree overseas is on of...
          </p>
          <button className="text-main p-3">Read More {">"} </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
