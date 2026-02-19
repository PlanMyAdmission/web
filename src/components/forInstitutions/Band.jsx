"use client";

import React from "react";
import { useRouter } from "next/navigation";

const Band = ({ 
  line, 
  cta,
  btn1 = "Register Now",
  btn2 = "Book Your Free Consultation", 
  btn3 = "AI Personal Admission Coach",
  btn4 = "AI University Search",
  forInstitutions = false 
}) => {
  const router = useRouter();

  // Scroll smoothly to the top of the page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
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
        
        {/* Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Button 1 - Register Now */}
          <button
            disabled={forInstitutions}
            className={`px-4 py-3 rounded-md text-white font-semibold ${
              forInstitutions
                ? "bg-main cursor-not-allowed opacity-70"
                : "bg-main hover:bg-opacity-90"
            }`}
            onClick={() => {
              if (!forInstitutions) window.location.href = "https://portal.planmyadmission.com/sign-up";
            }}
          >
            {btn1}
          </button>

          {/* Button 2 - Book Free Consultation */}
          <button
            className="px-4 py-3 rounded-md border border-main text-main hover:bg-gray-50 font-semibold"
            onClick={() => {
              router.push('/');
            }}
          >
            {btn2}
          </button>

          {/* Button 3 - AI Personal Admission Coach */}
          <button
            className="px-4 py-3 rounded-md bg-blurpink text-white hover:bg-opacity-90 font-semibold"
            onClick={(e) => {
              try {
                console.log('🎯 Band: AI Personal Admission Coach button clicked');
                e.preventDefault();
                e.stopPropagation();
                
                // Dispatch custom event to open AI chatbot
                const event = new CustomEvent('openAIChatbot', { 
                  detail: { source: 'band-admission-coach-button' }
                });
                window.dispatchEvent(event);
                console.log('🎯 Band: openAIChatbot event dispatched');
              } catch (error) {
                console.error('🎯 Band: Error dispatching event', error);
              }
            }}
          >
            {btn3}
          </button>

          {/* Button 4 - AI University Search */}
          <button
            className="px-4 py-3 rounded-md border border-blurpink text-blurpink hover:bg-gray-50 font-semibold"
            onClick={() => {
              router.push('/ai-university-search');
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
