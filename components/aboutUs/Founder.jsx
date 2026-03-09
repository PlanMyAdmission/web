import Image from 'next/image';

import React from 'react';
const quote = '/images/about/quote.svg';
const advisors = '/images/about/Ram.jpg';
import Heading from '@components/higherOrderComponents/Heading';
const defaultQuote =
  '"The overseas education industry hasn\'t seen real innovation in decades. Students deserve better than slow, expensive, and generic advice that treats them like just another number. That\'s why we built Plan My Admission—to democratize access to world-class education consulting through artificial intelligence and human experts working together.\nOur leadership brings together deep expertise in education, technology, and student success. With years of experience understanding the challenges students face when pursuing international studies, we\'ve shaped Plan My Admission into India\'s topmost AI-powered overseas education platform with AI innovation at its core, building on the industry\'s learning over the last few decades. We strongly believe in empowering every student with personalized, data-driven guidance and the right technological tools to achieve their academic dreams, regardless of their background or budget."';

const Founder = ({ content }) => {
  const quoteLines = `${content?.quote || defaultQuote}`.split('\n').filter(Boolean);

  return (
    <div className="my-20">
      <Heading heading={content?.heading || 'Our Founder Speaks'} />
      <div className="md:ml-[200px]  bg-light flex flex-col md:flex-row md:rounded-2xl relative right-0 items-center">
        <Image
          unoptimized
          width={90}
          height={90}
          sizes="90px"
          src={content?.quoteImage || quote}
          alt=""
          className="absolute md:ml-20 -top-5 left-5"
        />
        <Image
          unoptimized
          width={260}
          height={260}
          sizes="260px"
          src={content?.image || advisors}
          alt=""
          className="block md:hidden w-[260px] h-[260px] [clip-path:circle()] object-cover object-center"
        />
        <div className="md:pl-10 md:w-2/3 w-full md:py-10 p-5">
          <p className="font-bold text-xl md:pt-5">{content?.name || 'Ram Nivas'}</p>
          <p className="text-main ">{content?.role || 'Founder'}</p>
          <p className="pt-5 md:pr-10 md:mr-20">
            {quoteLines.length > 0
              ? quoteLines.map((line, index) => (
                  <React.Fragment key={`${line}-${index}`}>
                    {line}
                    {index < quoteLines.length - 1 && <br />}
                  </React.Fragment>
                ))
              : null}
          </p>
        </div>
        <Image
          unoptimized
          width={430}
          height={520}
          sizes="430px"
          src={content?.image || advisors}
          alt=""
          className="maskFounder md:w-[430px] hidden md:block absolute right-0 translate-x-14 lg:-translate-x-5 "
        />
      </div>
    </div>
  );
};
export default Founder;
