import Image from 'next/image';

import React from 'react';
import Header from '@components/common/Header';
import Heading from '@components/common/Heading';
const ArticleImage = '/images/home/ArticleImage.svg';
import Timeline from '@/components/how-it-works/Timeline.jsx';
const HowItWorks = ({ content }) => {
  return (
    <div>
      <Header heading={content?.headerHeading || 'How it works'} />
      <Heading heading={content?.introHeading || 'Simplifying Application Process'} />
      <Section sectionText={content?.introText} />
      <Heading heading={content?.startHeading || 'How to get Started'} />
      <Timeline items={content?.timeline} />
    </div>
  );
};
const Section = ({ sectionText }) => {
  return (
    <div className="flex flex-col-reverse md:flex-row items-center justify-evenly max-w-6xl px-2 sm:px-5 md:mx-auto md:mb-20 mb-10 mx-5">
      <p className="md:px-10 md:mx-10 w-full py-10 ">
        {sectionText ||
          "Studying at a prestigious university abroad is something that thousands of students from all over the world dream about. Researching and applying to these universities is a complicated and time-consuming hassle. But it doesn't have to be. Plan My Admission is the simple one stop shop for all your higher education requirements."}
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
