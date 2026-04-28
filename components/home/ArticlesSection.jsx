'use client';

import React, { useMemo, useRef, useState } from 'react';
import ArticleCard from '@/components/common/ArticleCard';
import { useRouter } from 'next/navigation';
import { trackNavigationClick } from '@/lib/analytics/events.js';

const ArticlesSection = ({ articles = [] }) => {
  const router = useRouter();
  const elementRef = useRef(null);
  const [arrowDisable, setArrowDisable] = useState(true);

  const mobileArticles = useMemo(() => articles.slice(0, 2), [articles]);

  const handleHorizantalScroll = (element, speed, distance, step) => {
    if (!element) {
      return;
    }

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
          Browse the latest published guides from our blog.
        </p>
        <button
          className="bg-main text-white font-semibold px-5 py-2 mt-6 rounded-md hidden md:block"
          onClick={() => {
            trackNavigationClick({
              location: 'home_articles',
              label: 'explore_resources',
              destination: '/blogs',
            });
            router.push('/blogs');
          }}
        >
          Explore more Resources &rarr;
        </button>
      </div>

      <div className="md:w-2/3 w-full mt-10 md:mt-0">
        {articles.length > 0 ? (
          <>
            <div
              ref={elementRef}
              className="hidden md:flex overflow-x-auto gap-5 scrollbar-hide px-2 pb-2"
            >
              {articles.map((item) => (
                <ArticleCard key={item.id} post={item} />
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
              {mobileArticles.map((item) => (
                <ArticleCard key={item.id} post={item} />
              ))}
            </div>
          </>
        ) : (
          <div className="bg-light rounded-xl px-6 py-8 text-center text-[#6f556f]">
            Published blog posts will appear here once available.
          </div>
        )}

        <button
          className="bg-main text-white font-semibold px-5 py-2 mt-6 mx-auto rounded-md block md:hidden"
          onClick={() => {
            trackNavigationClick({
              location: 'home_articles_mobile',
              label: 'explore_resources',
              destination: '/blogs',
            });
            router.push('/blogs');
          }}
        >
          Explore more Resources &rarr;
        </button>
      </div>
    </div>
  );
};

export default ArticlesSection;
