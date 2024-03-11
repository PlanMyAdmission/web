import React from "react";
import icon from "../../assets/about-us/icon.svg";

const OurCoreValues = () => {
  return (
    <div className="my-20 mx-5 bg-light rounded-md p-[30px] flex flex-col max-w-7xl md:mx-auto justify-center">
      <div className="grid md:grid-cols-3 grid-cols-1 gap-5">
        <div className="flex justify-center items-center max-w-[250px] mx-auto">
          <span className="md:pl-3 pl-1 md:text-5xl text-3xl font-bold border-l-[11px] border-main leading-10 flex ">
            Our Core Values
          </span>
        </div>
        <Card />
        <Card1 />
        <Card2 />
        <Card3 />
        <Card4 />
      </div>
    </div>
  );
};

function Card() {
  return (
    <div className={`py-10 flex flex-col w-full`}>
      <img src={icon} className="w-[44px] h-[44px]" alt="icon" />

      <h1 className="font-bold text-xl pt-4 ">Technology First</h1>
      <span className=" mt-[10px] py-5 border-b-4 border-main pr-4">
        At Planmyadmission, we harness the power of technology to provide our clients with the most efficient and effective solutions. Our AI/ML technology allows us to personalize our services and provide each student with tailored recommendations for their journey.

      </span>
    </div>
  );
}
function Card1() {
  return (
    <div className={`py-10 flex flex-col w-full`}>
      <img src={icon} className="w-[44px] h-[44px]" alt="icon" />

      <h1 className="font-bold text-xl pt-4 ">Transparency</h1>
      <span className=" mt-[10px] py-5 border-b-4 border-main pr-4">
        We believe in maintaining transparency in all our interactions with students, ensuring they are well-informed and involved in the decision-making process. Our team provides honest and open communication to build trust and foster a strong relationship with our clients.
      </span>
    </div>
  );
}
function Card2() {
  return (
    <div className={`py-10 flex flex-col w-full`}>
      <img src={icon} className="w-[44px] h-[44px]" alt="icon" />

      <h1 className="font-bold text-xl pt-4 ">Commitment</h1>
      <span className=" mt-[10px] py-5 border-b-4 border-main pr-4">
        Our commitment to the success of our clients is unwavering. We go above and beyond to provide them with the best opportunities and support throughout their study abroad journey. Our team is dedicated to helping students achieve their dreams of studying in their dream university.

      </span>
    </div>
  );
}
function Card3() {
  return (
    <div className={`py-10 flex flex-col w-full`}>
      <img src={icon} className="w-[44px] h-[44px]" alt="icon" />

      <h1 className="font-bold text-xl pt-4 ">Innovation</h1>
      <span className=" mt-[10px] py-5 border-b-4 border-main pr-4">
        We constantly strive to innovate and improve our services to stay at the forefront of the education industry. Our team embraces new ideas and technologies to enhance our clients' experience and provide them with the best possible outcomes.

      </span>
    </div>
  );
}
function Card4() {
  return (
    <div className={`py-10 flex flex-col w-full`}>
      <img src={icon} className="w-[44px] h-[44px]" alt="icon" />

      <h1 className="font-bold text-xl pt-4 ">Excellence</h1>
      <span className=" mt-[10px] py-5 border-b-4 border-main pr-4">
        We hold ourselves to the highest standards of excellence in everything we do. Our team is committed to delivering exceptional services to our clients, ensuring their satisfaction and success. We take pride in our work and strive for excellence in all aspects of our business.

      </span>
    </div>
  );
}

export default OurCoreValues;
