import React from "react";
import { useNavigate } from "react-router-dom";

const Band = ({ line, cta }) => {
  const navigate = useNavigate()
  return (
    <div className="w-full bg-light py-5 md:my-20 my-10">
      <div className="max-w-7xl mx-auto flex items-center md:flex-row flex-col text-center md:text-left leading-10 md:leading-none">
        <h1 className="flex-1 text-[45px] py-3 text-main font-bold px-5">
          {line}
        </h1>
        <button className="bg-main px-5 md:py-3 py-2 my-2 md:my-0 block text-center rounded-md text-white font-semibold " onClick={() => {
          navigate("/register")
        }}>
          {cta}
        </button>
      </div>
    </div>
  );
};

export default Band;
