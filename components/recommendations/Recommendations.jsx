'use client';

import React, { useRef } from 'react';
import RecommendationsMain from '@/components/recommendations/RecommendationsMain.jsx';
import { trackEvent } from '@/lib/analytics/events.js';

const Recommendations = () => {
  const builderRef = useRef(null);

  const handleOpenBuilder = () => {
    trackEvent('recommendations_tool_open', {
      surface: 'recommendations_page',
    });
    builderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="px-4 py-10 md:px-6 md:py-14">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-[32px] bg-gradient-to-r from-main to-[#ff8ab3] px-6 py-10 text-white shadow-lg md:px-10 md:py-12">
          <p className="text-sm uppercase tracking-[0.2em] text-white/75">
            Recommendations
          </p>
          <h1 className="mt-3 text-3xl font-semibold md:text-5xl">
            Build a shortlist from your profile, target country, and budget.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-white/85 md:text-base">
            This tool pulls matching universities and courses from the current
            dataset, then links each recommendation back into the explore flow.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-main transition duration-200 hover:bg-[#fff3f8]"
              onClick={handleOpenBuilder}
            >
              Start Recommendation Builder
            </button>
            <p className="text-sm text-white/80">
              Country, degree, state, and discipline are required.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-[28px] bg-light px-6 py-7 shadow-sm">
            <p className="text-sm font-semibold text-main">
              1. Academic profile
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Choose your country, state, degree, discipline, and intake cycle.
            </p>
          </div>
          <div className="rounded-[28px] bg-light px-6 py-7 shadow-sm">
            <p className="text-sm font-semibold text-main">2. Test details</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Add your score, certifications, aptitude tests, and English
              proficiency.
            </p>
          </div>
          <div className="rounded-[28px] bg-light px-6 py-7 shadow-sm">
            <p className="text-sm font-semibold text-main">
              3. Matching results
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Review course matches and jump directly to the relevant university
              page.
            </p>
          </div>
        </div>

        <div
          ref={builderRef}
          id="recommendation-builder"
          className="mt-8 scroll-mt-28"
        >
          <RecommendationsMain />
        </div>
      </div>
    </section>
  );
};
export default Recommendations;
