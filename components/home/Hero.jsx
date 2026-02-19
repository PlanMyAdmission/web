'use client';

import Image from 'next/image';

import React, { useState, useEffect } from 'react';
import human from '@/assets/Human.svg';
import Arrow from '@/assets/homeAssets/Arrow.svg';
import Plane from '@/assets/Plane.svg';
import algoliasearch from 'algoliasearch/lite';
import Autosuggest from 'react-autosuggest';
import { matchSorter } from 'match-sorter';
import { useRouter } from 'next/navigation';
import JoinUsForm from '@/components/home/JoinUsForm.jsx';
const Hero = () => {
  const [search, setSearch] = useState('');
  const router = useRouter();
  const searchClient = algoliasearch(
    '8CPNZ7GSBE',
    'd5e280b4cfd33be419ebfd25c236e5e0',
  );
  const index = searchClient.initIndex('explore');
  const inputProps = {
    type: 'search',
    placeholder: 'Search Universites,Courses...',
    value: search,
    onChange: (event, { newValue }) => {
      setSearch(newValue);
    },
    className:
      'inline p-3 pl-10 w-full text-sm rounded-lg ring-main ring-offset-1 ring-1 bg-transparent focus:outline-none placeholder:text-[11px] md:placeholder:text-[14px]',
    placeholder: 'Search Universites,Courses and more...',
  };
  const containerProps = {
    className: 'absolute w-full',
  };
  const handleDirectSelection = (topic) => {
    router.push(`/explore?topic=${topic}`);
  };
  return (
    <div className="flex md:flex-row flex-col max-w-7xl lg:mx-auto gap-5 md:items-center md:my-10 my-10 xl:px-2 sm:px-10 px-5">
      <div className="md:w-[60%] w-full grow flex-1">
        <Image
          unoptimized
          width={0}
          height={0}
          sizes="100vw"
          src={Plane}
          alt="/"
          className="md:hidden block "
        />
        <div className="relative flex flex-row">
          <h1 className="lg:text-7xl md:text-5xl text-4xl uppercase font-bold">
            BRING YOUR OVERSEAS EDUCATION
            <br />
            <span className="text-main">dreams to life!!</span>
          </h1>
          <Image
            unoptimized
            width={0}
            height={0}
            sizes="100vw"
            src={Arrow}
            alt="img"
            className="absolute hidden lg:right-0 lg:w-1/4 lg:block"
          />
        </div>
        <p className="font-bold text-[18px] md:w-1/2 py-4 leading-[20px]">
          Put the power of AI & Industry experts to work for you
        </p>
        {}
        <JoinUsForm />
      </div>
      <div className="">
        <Image
          unoptimized
          width={0}
          height={0}
          sizes="100vw"
          src={human}
          alt="human"
          className="md:block md:h-[400px] xl:h-full hidden lg:scale-105"
        />
      </div>
    </div>
  );
};
const Button = ({ text, showText }) => {
  return (
    <button
      className="border border-main md:py-2 px-4 m-1 rounded-full hover:bg-light md:text-[14px] text-main text-[10px] py-1"
      onClick={() => showText()}
    >
      {text}
    </button>
  );
};
export default Hero;
