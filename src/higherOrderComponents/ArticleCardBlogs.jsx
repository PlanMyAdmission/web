import React from "react";
import ArticleImage from "../assets/homeAssets/ArticleImage.svg";
import article from "../assets/articles/article1.png"
import { useNavigate } from "react-router-dom";
//md:hover:border-b-main
const ArticleCard = ({ props }) => {
  const nav = useNavigate()
  return (
    <div className="">
      <div className=" w-full h-[100%] transition duration-500 ease-in-out mx-auto bg-white p-3">
        <img className="w-full rounded-lg" src={props.image} alt="ArticleImage" />
        <div className="py-3">
          <p className="md:text-2xl text-xl font-semibold leading-tight">
            {props.head}
          </p>
          <p className="py-2">
            {props.desc}
          </p>
          <button className="text-main p-3" onClick={() => {
            nav(props.link)
          }}>Read More {">>"} </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
