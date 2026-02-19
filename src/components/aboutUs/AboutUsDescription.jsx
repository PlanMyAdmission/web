import React from 'react';
import aboutusTeam from '../../assets/about-us/about-us.svg';

const AboutUsDescription = () => {
  return (
    <div className="max-w-7xl md:mx-auto flex md:flex-row flex-col mt-20 justify-center items-center px-5 gap-5">
      <div className="md:w-1/2 w-full">
        <img src={aboutusTeam} alt="" className="" />
      </div>
      <div className="md:w-1/2 md:px-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Redefining What's Possible in Overseas Education
        </h2>

        <p className="mb-4 text-gray-700 leading-relaxed">
          Every year, 750,000 Indian students dream of studying abroad. Yet 80%
          never make it past the application stage—not because they lack talent,
          but because they lack access to the right guidance at the right time.
        </p>

        <p className="mb-6 text-gray-700 font-semibold">
          We exist to change that story.
        </p>

        <h3 className="text-xl font-bold mb-4 text-gray-800">
          Our Story: From Frustration to Revolution
        </h3>

        <p className="mb-4 text-gray-700 leading-relaxed">
          Plan My Admission was born from a simple yet powerful realization: the
          overseas education industry was broken. Students were paying
          exorbitant fees for outdated advice, waiting weeks for generic
          recommendations, and making life-changing decisions based on someone
          else's guesswork.
        </p>

        <p className="mb-4 text-gray-700 leading-relaxed">
          We asked ourselves: What if we could give every student access to the
          same quality of guidance that only the privileged few receive? What if
          technology could democratize dreams?
        </p>

        <p className="mb-6 text-gray-700 leading-relaxed">
          Today, we're not just another education consultancy. We're the
          architects of the future—where artificial intelligence meets human
          expertise to unlock unprecedented opportunities for students across
          India.
        </p>

        <p className="text-gray-700 leading-relaxed">
          At Plan My Admission, we are a young and dynamic team dedicated to
          revolutionizing overseas education through artificial intelligence and
          cutting-edge technology. Our company was founded with a vision to
          transform the traditional education consulting industry by leveraging
          AI/ML technology to provide students with instant, personalized, and
          data-driven guidance for their academic and career growth abroad.
        </p>
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
