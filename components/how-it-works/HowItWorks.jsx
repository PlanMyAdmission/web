import Image from 'next/image';

import React from 'react';
import Header from '@components/higherOrderComponents/Header';
import Heading from '@components/higherOrderComponents/Heading';
const ArticleImage = '/images/home/ArticleImage.svg';
import Timeline from '@/components/how-it-works/Timeline.jsx';
const HowItWorks = () => {
  return (
    <div>
      <Header heading={'How it works'} />
      <Heading heading="Simplifying Application Process" />
      <Section />
      <Heading heading="How to get Started" />
      <Timeline />
    </div>
  );
};
const Section = () => {
  return (
    <div className="flex flex-col-reverse md:flex-row items-center justify-evenly max-w-6xl px-2 sm:px-5 md:mx-auto md:mb-20 mb-10 mx-5">
      <p className="md:px-10 md:mx-10 w-full py-10 ">
        Studying at a prestigious university abroad is something that thousands
        of students from all over the world dream about. Researching and
        applying to these universities is a complicated and time-consuming
        hassle. But it doesn&apos;t have to be. Plan My Admission is the simple
        one stop shop for all your higher education requirements.
      </p>
      <Image
        unoptimized
        width={350}
        height={250}
        sizes="350px"
        src={ArticleImage}
        alt="image"
        className="h-[250px] w-auto object-cover object-center"
      />
    </div>
  );
};
export default HowItWorks;
