import Image from 'next/image';

import React from 'react';
import Heading from '@components/higherOrderComponents/Heading';
const ArticleImage = '/images/homeAssets/ArticleImage.svg';
const HowItWorksSection = () => {
  return (
    <div className="py-12">
      <Heading heading="How it works" />
      <Section />
      <Heading heading="How to get Started" />
      <Timeline />
    </div>
  );
};
const Section = () => {
  return (
    <div className="flex flex-col-reverse md:flex-row items-center justify-evenly max-w-6xl px-2 sm:px-5 md:mx-auto md:mb-20 mb-5 mx-5">
      <p className="md:px-10 md:mx-10 w-full py-5 ">
        Studying at a prestigious university abroad is something that thousands
        of students from all over the world dream about. Researching and
        applying to these universities is a complicated and time-consuming
        hassle. But it doesn&apos;t have to be. Plan My Admission is the simple
        one stop shop for all your higher education requirements.
      </p>
      <Image
        unoptimized
        width={0}
        height={0}
        sizes="100vw"
        src={ArticleImage}
        alt="image"
        className="h-[250px] object-cover object-center"
      />
    </div>
  );
};
const Timeline = () => {
  return (
    <div className="flex flex-col mx-auto max-w-3xl mb-20">
      <ul className="">
        {data.map((item) => {
          return (
            <div
              key={item.id}
              className="bg-light mb-8 rounded-lg md:px-10 px-5 py-5 flex flex-row items-center justify-center relative "
            >
              <span className="w-[90px] rounded-full inline-flex bg-main sm:mr-8 mr-4 md:p-5 p-4 text-white font-bold text-2xl object-cover object-center">
                {item.id}
              </span>
              <div>
                <li className="font-bold sm:text-2xl text-xl pb-2">
                  {item.title}
                </li>
                <p>{item.detatils}</p>
              </div>
              <div
                className={
                  item.id !== '04'
                    ? 'bg-main w-1 h-24 -z-40 absolute -bottom-10 md:left-[70px] left-[50px]'
                    : ''
                }
              ></div>
            </div>
          );
        })}
      </ul>
    </div>
  );
};
const data = [
  {
    id: '01',
    title: 'Create your account',
    detatils:
      'Hey there! Take the first step towards studying abroad by creating an account on our website.',
  },
  {
    id: '02',
    title: 'Shortlist University',
    detatils:
      'Fill up your profile information and our AI technology provides recommendation and saves you time and money at every step of the application process.',
  },
  {
    id: '03',
    title: 'Consult your expert',
    detatils:
      'Schedule a one-on-one session with our in-house experts to get guidance on factors like- SOP, LOR, Scholarships, Visa application, and more!',
  },
  {
    id: '04',
    title: 'Apply',
    detatils:
      'We will help you apply to multiple programs and universities around the world. Then, you wait for your university acceptance and get ready to fly!',
  },
];
export default HowItWorksSection;
