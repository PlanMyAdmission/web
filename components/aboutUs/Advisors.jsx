import Image from 'next/image';

import React from 'react';
const advisors = '/images/about/leader.svg';
import Heading from '@components/higherOrderComponents/Heading';
const Advisors = () => {
  return (
    <div className="my-20">
      <Heading heading="Our Top Advisors" />
      <div className="flex justify-center sm:flex-row flex-col items-center">
        <Leaders name="Full Name" desig="Founder" />
        <Leaders name="Full Name" desig="Founder" />
        <Leaders name="Full Name" desig="Founder" />
      </div>
    </div>
  );
};
const Leaders = ({ name, desig }) => {
  return (
    <div className="m-2">
      <Image
        unoptimized
        width={320}
        height={220}
        sizes="320px"
        src={advisors}
        alt=""
        className="w-full h-auto"
      />
      <div className="text-white relative -top-12 px-3 bg-gradient-to-t  from-blurpink to-transparent py-3 flex justify-between">
        <p>{name}</p>
        <p>{desig}</p>
      </div>
    </div>
  );
};
export default Advisors;
