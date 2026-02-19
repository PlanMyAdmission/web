'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
const ArticleCard = ({ props }) => {
  const router = useRouter();
  return (
    <div className="">
      <div className=" w-full h-[100%] transition duration-500 ease-in-out mx-auto bg-white p-3">
        <Image
          className="w-full rounded-lg"
          src={props.image}
          alt="ArticleImage"
          width={640}
          height={360}
          unoptimized
        />
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
