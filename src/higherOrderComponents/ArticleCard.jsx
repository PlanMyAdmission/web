'use client';

import React from 'react';
import ArticleImage from '../assets/homeAssets/ArticleImage.svg';
import article from '../assets/articles/article1.png';
import { useRouter } from 'next/navigation';

const ArticleCard = ({ props }) => {
  const router = useRouter();
  return (
    <div className="snap-center shrink-0">
      <div className="md:max-w-sm w-full transition duration-500 ease-in-out border-b-4 border-white  mx-auto md:mx-0 mb-3 md:mb-0">
        <img className="w-full" src={props.image} alt="ArticleImage" />
        <div className="py-3">
          <p className="md:text-2xl text-xl font-semibold leading-tight">
            {props.head}
          </p>
          <p className="py-2">{props.desc}</p>
          <button
            className="text-main p-3"
            onClick={() => {
              router.push(props.link);
            }}
          >
            Read More {'>>'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
