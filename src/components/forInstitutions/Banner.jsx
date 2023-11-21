import React from "react";
import Bussiness from "../../assets/ForInstitutions/Bussiness.svg";

const Banner = () => {
  return (
    <div className="flex flex-col-reverse md:flex-row items-center max-w-7xl mx-auto my-10 md:px-10 xl:px-0 px-5">
      <div>
        <h1 className="md:text-7xl text-5xl md:pl-0 pl-5 font-bold uppercase">
          Let us bring
          <span className="text-main">
            <br className="hidden sm:block" /> dreams into Life
          </span>
        </h1>
        <p className="py-5 font-bold md:pl-0 px-5">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Veniam
          voluptatibus quidem in maiores assumenda ipsum doloremque recusandae
          adipisci harum, culpa deleniti, ex impedit, sunt quibusdam laboriosam
          quisquam facere placeat quis?
        </p>
        <button className="bg-main px-5 md:px-0 py-2 text-white rounded-md block my-3 w-[40vw] md:w-[10vw] ml-5 md:ml-0 text-center font-semibold">
          Know More
        </button>
      </div>
      <img src={Bussiness} alt="Bussiness" className="w-[500px]" />
    </div>
  );
};

export default Banner;
