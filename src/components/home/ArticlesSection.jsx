'use client';

import React, { useRef, useState } from 'react';
import ArticleCard from '../../higherOrderComponents/ArticleCard';
import { useRouter } from 'next/navigation';
import article1 from '../../assets/articles/article1.png';
import article2 from '../../assets/articles/article2.png';
import article3 from '../../assets/articles/article3.png';
import article4 from '../../assets/articles/article4.png';

const ArticlesSection = () => {
  const router = useRouter();
  const elementRef = useRef(null);
  const [arrowDisable, setArrowDisable] = useState(true);

  const data = [
    {
      id: 1,
      image: article1,
      head: "Navigating the American Campus | A Student's Guide to Living in the USA",
      desc: 'Venturing into the United States for higher education is not just...',
      link: '/Navigating-the-American-Campus',
    },
    {
      id: 2,
      image: article2,
      head: 'Embarking on Excellence | A Comprehensive Guide to Studying Abroad',
      desc: 'Embarking on the adventure of studying abroad is a transformative...',
      link: '/Embarking-on-Excellence',
    },
    {
      id: 3,
      image: article3,
      head: 'Pennsylvania State University | Elevating Education to Unparalleled Heights',
      desc: 'In the realm of higher education, few institutions stand as tall and...',
      link: '/Pennsylvania-State-University',
    },
    {
      id: 4,
      image: article4,
      head: 'Mastering the Art of Financial Planning for Your Study Abroad Adventure',
      desc: 'Embarking on the journey of studying abroad is an exciting adventure...',
      link: '/Mastering-the-Art-of-Financial-Planning',
    },
  ];

  const handleHorizantalScroll = (element, speed, distance, step) => {
    let scrollAmount = 0;
    const slideTimer = setInterval(() => {
      element.scrollLeft += step;
      scrollAmount += Math.abs(step);
      if (scrollAmount >= distance) clearInterval(slideTimer);
      setArrowDisable(element.scrollLeft === 0);
    }, speed);
  };

  return (
    <div className="flex flex-col md:flex-row my-20 mx-4 2xl:justify-center">
      <div className="md:w-1/3 w-full px-4">
        <h1 className="font-bold text-2xl md:text-5xl text-center md:text-left leading-tight">
          Articles to help you prepare
        </h1>
        <div className="border-b-4 border-main w-1/5 mx-auto md:mx-0 my-4"></div>
        <p className="text-gray-700 text-base md:text-lg">
          From understanding campus life to mastering financial planning, our
          curated articles help you stay a step ahead.
        </p>
        <button
          className="bg-main text-white font-semibold px-5 py-2 mt-6 rounded-md hidden md:block"
          onClick={() => router.push('/blogs')}
        >
          Explore more Resources &rarr;
        </button>
      </div>

      <div className="md:w-2/3 w-full mt-10 md:mt-0">
        <div
          ref={elementRef}
          className="hidden md:flex overflow-x-auto space-x-6 scrollbar-hide px-2"
        >
          {data.map((item) => (
            <ArticleCard key={item.id} props={item} />
          ))}
        </div>

        <div className="hidden md:flex justify-center gap-4 mt-4">
          <button
            onClick={() =>
              handleHorizantalScroll(elementRef.current, 25, 150, -10)
            }
            className={`px-4 py-2 border-2 border-main rounded-md font-bold text-main hover:bg-main hover:text-white transition ${arrowDisable ? 'opacity-40 cursor-not-allowed' : ''}`}
            disabled={arrowDisable}
          >
            &larr;
          </button>
          <button
            onClick={() =>
              handleHorizantalScroll(elementRef.current, 25, 150, 10)
            }
            className="px-4 py-2 border-2 border-main rounded-md font-bold text-main hover:bg-main hover:text-white transition"
          >
            &rarr;
          </button>
        </div>

        <div className="flex flex-col md:hidden gap-6 mt-6">
          {data
            .filter((item) => item.id === 1 || item.id === 3)
            .map((item) => (
              <ArticleCard key={item.id} props={item} />
            ))}
        </div>

        <button
          className="bg-main text-white font-semibold px-5 py-2 mt-6 mx-auto rounded-md block md:hidden"
          onClick={() => router.push('/blogs')}
        >
          Explore more Resources &rarr;
        </button>
      </div>
    </div>
  );
};

export default ArticlesSection;
