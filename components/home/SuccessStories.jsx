'use client';

import { React, useState } from 'react';
import Image from 'next/image';
import Heading from '@/components/common/Heading';
import Testimonials from '@/components/home/Testimonials.jsx';
const Human = '/images/ui/Human.svg';
const bgArrow = '/images/ui/bgArrow.svg';
import Carousel from 'react-multi-carousel';
import Reviews from '@/components/home/Reviews.jsx';
const Bhavesh = '/images/home/Bhavesh .jpg';
const Mansi = '/images/home/Mansi .jpg';
const Deepanshi = '/images/home/Deepanshi .jpg';
const Mitransh = '/images/home/Mitransh .jpg';

const responsive = {
  mobile: {
    breakpoint: {
      max: 639,
      min: 0,
    },
    items: 1,
  },
  tablet: {
    breakpoint: {
      max: 1024,
      min: 640,
    },
    items: 2,
  },
  desktop: {
    breakpoint: {
      max: 4000,
      min: 1025,
    },
    items: 2,
  },
};
const dataYT = [
  {
    id: 1,
    videoId: 'vpnCunS28oM',
  },
  {
    id: 2,
    videoId: 'M7cM1c2qKmA',
  },
  {
    id: 3,
    videoId: '6Jcq9jwOya8',
  },
  {
    id: 4,
    videoId: 'Evyzp-rBRuA',
  },
];
const dataTestimo = [
  {
    id: 1,
    content:
      'PlanMyAdmission has been truly exceptional, with a seamless visa process, exceptional coaching from Nitin, and outstanding support from their loan and accounts team.',
    author: 'Mansi Soni',
    univ: 'University of North Texas',
    img: Mansi,
  },
  {
    id: 2,
    content:
      "Team at PlanMyAdmission is so easy to work with. They're always available, keep me in the loop, and everything goes smoothly. I'm really happy with them!",
    author: 'Deepanshi',
    univ: 'University of Greenwich',
    img: Deepanshi,
  },
  {
    id: 3,
    content:
      "No doubt The process was both efficient and hassle-free. Thanks to the coach, everything became more accessible. Leverage Edu's visa support and mock interviews not only boosted my confidence but also enhanced my responses.",
    author: 'Bhavesh Mathur',
    univ: 'University of Bristol',
    img: Bhavesh,
  },
  {
    id: 4,
    content:
      'Glad that I made the timely decision to choose PlanMyAdmission Their personalized approach to each student helps turn dreams into reality, with a team that is both motivating and supportive.',
    author: 'Mitransh Saini',
    univ: 'Angel Ruskin University',
    img: Mitransh,
  },
];
const SuccessStories = () => {
  return (
    <div className="bg-light ">
      <Heading heading="Success Stories" />
      <Reviews />
      <Heading heading="Testimonials" />
      <div className="relative">
        <Image
          src={bgArrow}
          alt=""
          className="hidden lg:block absolute w-full -top-20"
          width={1200}
          height={220}
          unoptimized
        />
        <div className="hidden sm:block">
          <section className="flex items-center justify-center z-20 px-4">
            <Carousel
              style={{
                width: '80vw',
                maxWidth: '1200px',
              }}
              className="z-30 crousel"
              responsive={responsive}
              arrows={false}
              infinite
            >
              {dataTestimo &&
                dataTestimo.map((item) => {
                  return <Item key={item.id} props={item} />;
                })}
            </Carousel>
          </section>
        </div>
        <div className="sm:hidden">
          <section className="flex items-stretch justify-center z-20 px-4">
            <Carousel
              style={{
                width: 'calc(100vw - 2rem)',
              }}
              className="z-30 flex items-stretch justify-center z-20"
              responsive={responsive}
              arrows={false}
              infinite
            >
              {dataTestimo &&
                dataTestimo.map((item) => {
                  return <Item key={item.id} props={item} />;
                })}
            </Carousel>
          </section>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto lg:py-20 py-10 sm:px-20 px-4 z-20">
          {dataYT &&
            dataYT.map((item) => {
              return <YouTube key={item.id} props={item} />;
            })}
        </div>
      </div>
    </div>
  );
};
const YouTube = ({ props }) => {
  const [play, setPlay] = useState(false);
  const thumbnail = `https://img.youtube.com/vi/${props.videoId}/hqdefault.jpg`;
  const embedUrl = `https://www.youtube.com/embed/${props.videoId}?autoplay=1&rel=0`;
  return (
    <div className="w-full max-w-sm mx-auto aspect-[9/16] relative rounded-xl overflow-hidden bg-black shadow-md">
      {play ? (
        <iframe
          src={embedUrl}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      ) : (
        <>
          <Image
            src={thumbnail}
            alt="Video Thumbnail"
            className="w-full h-full object-cover"
            fill
            unoptimized
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={() => setPlay(true)}
              className="flex items-center justify-center h-16 w-16 bg-main/70 hover:bg-main transition rounded-full shadow-xl border-2 border-white/30"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
const Item = ({ props }) => {
  return (
    <>
      <Testimonials props={props} />
    </>
  );
};
export default SuccessStories;
