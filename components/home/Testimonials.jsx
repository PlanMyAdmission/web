import React from 'react';
import Image from 'next/image';
import StarRateIcon from '@mui/icons-material/StarRate';
const Testimonials = ({ props }) => {
  return (
    <div className="w-full border-[1px] border-main md:m-2  md:p-5 p-3 bg-white">
      <div className="text-main">
        <StarRateIcon className="pr-1 font-bold" />
        <StarRateIcon className="pr-1 font-bold" />
        <StarRateIcon className="pr-1 font-bold" />
        <StarRateIcon className="pr-1 font-bold" />
        <StarRateIcon className="pr-1 font-bold" />
      </div>
      <p className="py-3 ">{props.content}</p>
      <div className="flex leading-4  items-center">
        <Image
          src={props.img}
          alt=""
          className="rounded-full border-[1px] border-main w-10"
          width={40}
          height={40}
          unoptimized
        />
        <section className="p-2">
          <h2 className="font-semibold">{props.author}</h2>
          <p className="text-main">{props.univ}</p>
        </section>
      </div>
    </div>
  );
};
export default Testimonials;
