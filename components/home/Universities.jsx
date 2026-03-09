'use client';

import React, { useRef } from 'react';
import Heading from '@components/common/Heading';
import UniversityCard from '@/components/home/UniversityCard.jsx';
const harvard = '/images/home/harvard.png';
const oxford = '/images/home/oxford.png';
const stanford = '/images/home/stanford.png';
const cambridge = '/images/home/cambridge.png';
const toronto = '/images/home/toronto.png';
const Universities = ({ usedFor }) => {
  const hold = useRef(null);
  const handelwheel = (e) => {
    hold.current.scrollLeft += e.deltaY;
  };
  return (
    <div className="relative md:my-16  md:bg-gradient-to-t from-main to-main bg-[length:100%_75%] bg-no-repeat bg-center flex flex-col md:flex-row md:ml-[20%] md:w-[80%] ">
      <h1 className="hidden md:flex items-center px-5 py-3 text-2xl font-bold text-white md:text-5xl">
        Top Universities with us
      </h1>
      <div className="md:hidden block">
        <Heading heading={'Our Top Universites'} />
      </div>
      <div className="md:overflow-hidden overflow-x-auto hide-scroll-bar min-w-0">
        <div className="md:animate-carousel flex">
          {data &&
            data.map((univ) => {
              return (
                <UniversityCard key={univ.id} usedFor={usedFor} props={univ} />
              );
            })}
        </div>
      </div>
    </div>
  );
};
const data = [
  {
    id: 1,
    name: 'Harvard University',
    location: 'Cambridge, USA',
    img: harvard,
  },
  {
    id: 2,
    name: 'Oxford University',
    location: 'Oxford, GBR',
    img: oxford,
  },
  {
    id: 3,
    name: 'Stanford University',
    location: 'Stanford, USA',
    img: stanford,
  },
  {
    id: 4,
    name: 'University of Toronto',
    location: 'Toronto, CAN',
    img: toronto,
  },
  {
    id: 5,
    name: 'University of Cambridge',
    location: 'Cambridge, GBR',
    img: cambridge,
  },
];
export default Universities;
