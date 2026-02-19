import Image from 'next/image';

import React from 'react';
const quote = '/images/about-us/quote.svg';
const advisors = '/images/about-us/Ram.jpg';
import Heading from '@components/higherOrderComponents/Heading';
const Founder = () => {
  return (
    <div className="my-20">
      <Heading heading="Our Founder Speaks" />
      <div className="md:ml-[200px]  bg-light flex flex-col md:flex-row md:rounded-2xl relative right-0 items-center">
        <Image
          unoptimized
          width={0}
          height={0}
          sizes="100vw"
          src={quote}
          alt=""
          className="absolute md:ml-20 -top-5 left-5"
        />
        <Image
          unoptimized
          width={0}
          height={0}
          sizes="100vw"
          src={advisors}
          alt=""
          className="block md:hidden [clip-path:circle()] object-cover object-center"
        />
        <div className="md:pl-10 md:w-2/3 w-full md:py-10 p-5">
          <p className="font-bold text-xl md:pt-5">Ram Nivas</p>
          <p className="text-main ">Founder</p>
          <p className="pt-5 md:pr-10 md:mr-20">
            &quot;The overseas education industry hasn&apos;t seen real
            innovation in decades. Students deserve better than slow, expensive,
            and generic advice that treats them like just another number.
            That&apos;s why we built Plan My Admission—to democratize access to
            world-class education consulting through artificial intelligence and
            human experts working together.
            <br />
            Our leadership brings together deep expertise in education,
            technology, and student success. With years of experience
            understanding the challenges students face when pursuing
            international studies, we&apos;ve shaped Plan My Admission into
            India&apos;s topmost AI-powered overseas education platform with AI
            innovation at its core, building on the industry&apos;s learning
            over the last few decades. We strongly believe in empowering every
            student with personalized, data-driven guidance and the right
            technological tools to achieve their academic dreams, regardless of
            their background or budget.&quot;
          </p>
        </div>
        <Image
          unoptimized
          width={0}
          height={0}
          sizes="100vw"
          src={advisors}
          alt=""
          className="maskFounder md:w-[430px] hidden md:block absolute right-0 translate-x-14 lg:-translate-x-5 "
        />
      </div>
    </div>
  );
};
export default Founder;
