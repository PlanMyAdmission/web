'use client';

import Image from 'next/image';

import React from 'react';
const Bussiness = '/images/institutions/Bussiness.svg';
import { useRouter } from 'next/navigation';
const Banner = ({ content }) => {
  const router = useRouter();
  return (
    <div className="flex flex-col-reverse md:flex-row items-center max-w-7xl mx-auto my-10 md:px-10 xl:px-0 px-5">
      <div>
        <h1 className="md:text-7xl text-5xl md:pl-0 pl-5 font-bold uppercase">
          {content?.heading || 'Let us bring'}
          <span className="text-main">
            <br className="hidden sm:block" /> {content?.accent || 'dreams into Life'}
          </span>
        </h1>
        <p className="py-5 font-bold md:pl-0 px-5">
          {content?.subtext ||
            'Plan My Admission increases student conversion rates, streamlines global student-institution connections, and boosts enrollment through advanced technology and a large student network.'}
        </p>
        <button
          className="bg-main px-5 md:px-0 py-2 text-white rounded-md block my-3 w-[40vw] md:w-[10vw] ml-5 md:ml-0 text-center font-semibold"
          onClick={() => {
            router.push('/for-institutions');
          }}
        >
          {content?.cta || 'Know More'}
        </button>
      </div>
      <Image
        unoptimized
        width={1200}
        height={800}
        sizes="100vw"
        src={content?.image || Bussiness}
        alt="Bussiness"
        className="w-[500px]"
      />
    </div>
  );
};
export default Banner;
