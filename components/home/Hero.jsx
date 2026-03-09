'use client';

import Image from 'next/image';
import React from 'react';
const human = '/images/ui/Human.svg';
const Arrow = '/images/home/Arrow.svg';
const Plane = '/images/ui/Plane.svg';
import JoinUsForm from '@/components/home/JoinUsForm.jsx';
const Hero = ({ content }) => {
  return (
    <div className="flex md:flex-row flex-col max-w-7xl lg:mx-auto gap-5 md:items-center md:my-10 my-10 xl:px-2 sm:px-10 px-5">
      <div className="md:w-[60%] w-full grow flex-1">
        <Image
          unoptimized
          width={500}
          height={170}
          sizes="(max-width: 900px) 100vw, 500px"
          src={Plane}
          alt="/"
          className="md:hidden block "
        />
        <div className="relative flex flex-row">
          <h1 className="lg:text-7xl md:text-5xl text-4xl uppercase font-bold">
            {content?.heading || 'BRING YOUR OVERSEAS EDUCATION'}
            <br />
            <span className="text-main">
              {content?.accent || 'dreams to life!!'}
            </span>
          </h1>
          <Image
            unoptimized
            width={230}
            height={230}
            sizes="230px"
            src={Arrow}
            alt="img"
            className="absolute hidden lg:right-0 lg:w-1/4 lg:block"
          />
        </div>
        <p className="font-bold text-[18px] md:w-1/2 py-4 leading-[20px]">
          {content?.subtext || 'Put the power of AI & Industry experts to work for you'}
        </p>
        <JoinUsForm sourcePage="home_hero" />
      </div>
      <div className="">
        <Image
          unoptimized
          width={700}
          height={700}
          sizes="(max-width: 900px) 100vw, 700px"
          src={human}
          alt="human"
          className="md:block md:h-[400px] xl:h-full hidden lg:scale-105"
        />
      </div>
    </div>
  );
};
export default Hero;
