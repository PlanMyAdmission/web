'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
const ContentSection = ({
  id,
  content,
  features = [],
  btn1 = 'Register',
  btn2 = 'Learn More',
  btn3,
  btn4,
  video,
  forInstitutions = false,
}) => {
  const router = useRouter();
  const scrollToBottom = () => {
    window.scrollTo({
      top: Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
      ),
      behavior: 'smooth',
    });
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  return (
    <section id={id} className="w-full bg-light py-10 md:py-14">
      <div className="flex flex-col md:flex-row justify-between max-w-7xl mx-auto px-5 md:px-0 gap-10">
        {}
        <div className="flex-1">
          <p className="text-gray-800 text-sm md:text-base leading-relaxed mb-4">
            {content}
          </p>
          <ul className="list-disc space-y-2 md:px-8 marker:text-main text-sm text-gray-700">
            {features.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <div className="text-sm text-gray-700 pt-2">
            {' '}
            Explore our free Student AI Portal to research overseas options and
            manage your entire admission journey effortlessly. Plus, book your
            free personalized consultation today!
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 md:px-8">
            <button
              disabled={forInstitutions}
              className={`px-4 py-2 rounded-md text-white sm:w-full ${forInstitutions ? 'bg-main cursor-not-allowed opacity-70' : 'bg-main hover:bg-opacity-90'}`}
              onClick={() => {
                if (!forInstitutions)
                  window.location.href =
                    'https://portal.planmyadmission.com/sign-up';
              }}
            >
              {btn1}
            </button>
            <button
              className="px-4 py-2 rounded-md border border-main text-main hover:bg-light sm:w-full"
              onClick={scrollToTop}
            >
              {btn2}
            </button>
            {btn3 && (
              <button
                className="px-4 py-2 rounded-md bg-blurpink text-white hover:bg-opacity-90 sm:w-full"
                onClick={(e) => {
                  try {
                    e.preventDefault();
                    e.stopPropagation();
                    const event = new CustomEvent('openAIChatbot', {
                      detail: {
                        source: 'admission-coach-button',
                      },
                    });
                    window.dispatchEvent(event);
                  } catch (error) {
                    console.error(
                      '🎯 ContentSection: Error dispatching event',
                      error,
                    );
                  }
                }}
              >
                {btn3}
              </button>
            )}
            {btn4 && (
              <button
                className="px-4 py-2 rounded-md border border-blurpink text-blurpink hover:bg-gray-50 sm:w-full"
                onClick={() => {
                  router.push('/ai-university-search');
                }}
              >
                {btn4}
              </button>
            )}
          </div>
        </div>

        {}
        {video && (
          <div className="flex-1">
            <div className="aspect-w-16 aspect-h-9 rounded-md overflow-hidden shadow-sm">
              <iframe
                src={video}
                title="Plan My Admission"
                className="w-full h-full rounded-md"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
export default ContentSection;
