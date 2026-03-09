'use client';

import Image from 'next/image';
import React from 'react';

const icon = '/images/about/icon.svg';

const defaultItems = [
  {
    title: 'Technology First',
    description:
      'At Plan My Admission, we harness the power of artificial intelligence and machine learning to provide our clients with the most efficient and effective solutions. Our proprietary AI technology analyzes over 500+ universities across USA, Canada, UK, and Australia to deliver personalized university recommendations in record time. We believe technology should empower human potential, not replace the personal touch that makes each student\'s journey unique.',
  },
  {
    title: 'Transparency',
    description:
      'We believe in maintaining complete transparency in all our interactions with students, ensuring they are well-informed and involved in every step of the decision-making process. Unlike traditional consultants who rely on subjective opinions, our AI-powered recommendations are backed by comprehensive data and clear reasoning. Our team provides honest and open communication about admission chances, costs, and timelines to build trust and foster strong relationships with our clients.',
  },
  {
    title: 'Commitment',
    description:
      'Our commitment to the success of our clients is unwavering. We go above and beyond traditional consulting by offering Human + AI support, real-time application tracking and their own Student own portal increasing the success guarantee. Our team is dedicated to helping students achieve their dreams of studying at their ideal international university while providing ongoing support throughout their entire journey.',
  },
  {
    title: 'Innovation',
    description:
      'We constantly strive to innovate and improve our services to stay at the forefront of the education technology revolution. Our team embraces cutting-edge AI algorithms, natural language processing for essay optimization, and interactive interview simulation tools to enhance our clients\' experience. We\'re not just following industry trends—we\'re creating them, with features like instant university matching, Admission Coach , intelligent document analysis that competitors can\'t match.',
  },
  {
    title: 'Excellence',
    description:
      'We hold ourselves to the highest standards of excellence in everything we do. Our team is committed to delivering exceptional services to our clients, ensuring their satisfaction and success. We take pride in our work and strive for excellence in all aspects of our business.',
  },
];

const OurCoreValues = ({ heading = 'Our Core Values', items = defaultItems }) => {
  return (
    <div className="my-20 mx-5 bg-light rounded-md p-[30px] flex flex-col max-w-7xl md:mx-auto justify-center">
      <div className="grid md:grid-cols-3 grid-cols-1 gap-5">
        <div className="flex justify-center items-center max-w-[250px] mx-auto">
          <span className="md:pl-3 pl-1 md:text-5xl text-3xl font-bold border-l-[11px] border-main leading-10 flex ">
            {heading}
          </span>
        </div>
        {items.map((item) => (
          <div key={item.title} className="py-10 flex flex-col w-full">
            <Image
              unoptimized
              width={44}
              height={44}
              sizes="44px"
              src={icon}
              className="w-[44px] h-[44px]"
              alt="icon"
            />
            <h1 className="font-bold text-xl pt-4 ">{item.title}</h1>
            <span className=" mt-[10px] py-5 border-b-4 border-main pr-4">
              {item.description}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurCoreValues;
