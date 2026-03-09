'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { dispatchOpenAiChatbot } from '@lib/clientUtils.js';
import { portalSignupUrl } from '@lib/publicLinks.js';
const Band = ({
  line,
  cta,
  btn1 = 'Register Now',
  btn2 = 'Book Your Free Consultation',
  btn3 = 'AI Personal Admission Coach',
  btn4 = 'AI University Matchmaker',
  forInstitutions = false,
}) => {
  const router = useRouter();
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  return (
    <div className="w-full bg-light py-5 md:my-20 my-10">
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex items-center md:flex-row flex-col text-center md:text-left leading-10 md:leading-none mb-6">
          <h1 className="flex-1 text-[45px] py-3 text-main font-bold">
            {line}
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            disabled={forInstitutions}
            className={`px-4 py-3 rounded-md text-white font-semibold ${forInstitutions ? 'bg-main cursor-not-allowed opacity-70' : 'bg-main hover:bg-opacity-90'}`}
            onClick={() => {
              if (!forInstitutions)
                window.location.href = portalSignupUrl;
            }}
          >
            {btn1}
          </button>

          <button
            className="px-4 py-3 rounded-md border border-main text-main hover:bg-gray-50 font-semibold"
            onClick={() => {
              router.push('/');
            }}
          >
            {btn2}
          </button>

          <button
            className="px-4 py-3 rounded-md bg-blurpink text-white hover:bg-opacity-90 font-semibold"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              dispatchOpenAiChatbot('band-admission-coach-button');
            }}
          >
            {btn3}
          </button>

          <button
            className="px-4 py-3 rounded-md border border-blurpink text-blurpink hover:bg-gray-50 font-semibold"
            onClick={() => {
              router.push('/ai-university-matchmaker');
            }}
          >
            {btn4}
          </button>
        </div>
      </div>
    </div>
  );
};
export default Band;
