'use client';

import Image from 'next/image';

import React from 'react';
import logo from '@assets/homeAssets/logo.svg';
import human from '@assets/Human.svg';
import { useRouter } from 'next/navigation';
const Error_Page = () => {
  const router = useRouter();
  return (
    <>
      <div className="flex flex-col bg-light justify-center items-center max-w-7xl mx-auto h-screen">
        <Image
          unoptimized
          width={0}
          height={0}
          sizes="100vw"
          src={human}
          alt="human"
          className="md:block md:h-[300px] "
        />
        <h1 className="text-[100px] font-bold text-main opacity-40 ">404</h1>
        <p className="text-main font-medium text-4xl">Page Not Found</p>
        <button
          type="submit"
          className="text-white uppercase rounded-lg md:w-1/4 w-1/3 px-4 py-2 bg-main m-5 mx-auto hover:bg-light hover:text-main transition-2 hover:outline "
          onClick={() => {
            router.push('/');
          }}
        >
          Back to Home
        </button>
      </div>
    </>
  );
};
export default Error_Page;
