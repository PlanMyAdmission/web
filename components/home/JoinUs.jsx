import Image from 'next/image';

import React from 'react';
const joinUs = '/images/home/JoinUs.svg';
import Heading from '@components/higherOrderComponents/Heading';
import JoinUsForm from '@/components/home/JoinUsForm.jsx';
const JoinUs = () => {
  return (
    <div>
      <Heading heading="Join Us" />
      <div className="flex md:flex-row flex-col md:justify-evenly items-center sm:px-5">
        <div className="md:w-[500px] w-full px-5 items-center justify-center">
          <p className="font-medium ">
            Register with us to get started for your overseas study admission
            journey
          </p>
          <Image
            unoptimized
            width={0}
            height={0}
            sizes="100vw"
            src={joinUs}
            alt="joinUs"
            className="relative top-14 -z-10 overflow-hidden sm:left-20"
          />
        </div>
        <div className="md:w-[400px] w-[90%] flex items-center justify-center mt-10 md:mt-0">
          <Image
            unoptimized
            width={0}
            height={0}
            sizes="100vw"
            src={'/images/qr/register-qr.jpeg'}
            alt="Join Us Illustration"
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>
        {}
      </div>
    </div>
  );
};
export default JoinUs;
