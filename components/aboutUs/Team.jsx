import Image from 'next/image';

import React from 'react';
import Heading from '@components/higherOrderComponents/Heading';
const advisors = '/images/about/leader.svg';
const Team = () => {
  return (
    <>
      <Heading heading={'Our Team Members'} />
      <div className="flex justify-center flex-col md:flex-row items-center">
        <Name name="Full Name" desig="founder" />
        <Name name="Full Name" desig="founder" />
        <Name name="Full Name" desig="founder" />
        <Name name="Full Name" desig="founder" />
      </div>
    </>
  );
};
const Name = ({ name, desig }) => {
  return (
    <div className="m-2 text-white ">
      <Image
        unoptimized
        width={320}
        height={220}
        sizes="320px"
        src={advisors}
        alt=""
        className="w-full h-auto"
      />
      <div className="px-3 bg-main w-[90%]  relative -top-5 left-[15px] h-10 flex justify-between items-center ">
        <p className="font-bold ">{name}</p>
        <p>{desig}</p>
      </div>
    </div>
  );
};
export default Team;
