'use client';

import React, { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import RecommendationResults from '@/components/recommendations/RecommendationResults.jsx';
import {
  StepOne,
  StepThree,
  StepTwo,
} from '@/components/recommendations/RecommendationSteps.jsx';
import { trackEvent } from '@/lib/analytics/events.js';

const RecommendationsMain = () => {
  const [degrees] = useState([]);
  const [disciplines] = useState([]);
  const [countries] = useState([]);
  const [show, setShow] = useState(false);
  const [filterData, setFilterData] = useState({
    country: '',
    degree: '',
    discipline: '',
    year: '',
    month: '',
    score: '',
    certification: '',
    aptitude: '',
    proficiency: '',
    state: '',
    budget: '',
  });


  const handleFilterChange = (event) => {
    const value = event.target.value;
    setFilterData((current) => ({
      ...current,
      state: event.target.name === 'country' ? '' : current.state,
      [event.target.name]: value,
    }));
  };

  const states = useMemo(() => {
    if (!countries.length || !filterData.country) {
      return [];
    }

    const selectedCountry = countries.find(
      (cnt) => cnt.name === filterData.country,
    );
    return selectedCountry?.states || [];
  }, [countries, filterData.country]);

  const universitiesKey = useMemo(
    () => JSON.stringify(filterData),
    [filterData],
  );

  return (
    <div className="rounded-[32px] bg-light px-4 py-6 shadow-sm md:px-8 md:py-10">
      {!show && (
        <form className="space-y-8">
          <div className="border-b border-black/5 pb-6">
            <p className="text-sm uppercase tracking-[0.18em] text-main/80">
              Recommendation Builder
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900 md:text-3xl">
              Tell us what you want to study.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">
              Fill in the essentials below and we will surface matching courses
              from the university dataset for your selected market.
            </p>
          </div>

          <section className="rounded-[28px] border border-main/10 bg-white px-2 py-4 md:px-4 md:py-6">
            <p className="px-3 text-lg font-semibold text-slate-900">
              General Details
            </p>
            <p className="px-3 pt-1 text-sm text-slate-600">
              Start with the country, state, degree, and discipline you want to
              target.
            </p>
            <StepOne
              countries={countries}
              states={states}
              degrees={degrees}
              disciplines={disciplines}
              filterData={filterData}
              onFilterChange={handleFilterChange}
            />
          </section>

          <section className="rounded-[28px] border border-main/10 bg-white px-5 py-6">
            <p className="text-lg font-semibold text-slate-900">
              Academic Details
            </p>
            <p className="pt-1 text-sm text-slate-600">
              Add your score and any certifications that strengthen your
              profile.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-6">
              <div className="col-span-1 sm:col-span-3 mt-2">
                <p>Enter your High School Score</p>
                <input
                  type="number"
                  placeholder="your score"
                  name="score"
                  className="bg-light px-4 py-2 rounded-md my-2 w-full sm:w-2/3"
                  value={filterData.score}
                  onChange={(event) => {
                    setFilterData({
                      ...filterData,
                      score: event.target.value,
                    });
                  }}
                />
              </div>
              <StepTwo
                filterData={filterData}
                onFilterChange={handleFilterChange}
              />
            </div>
          </section>

          <section className="rounded-[28px] border border-main/10 bg-white px-5 py-6">
            <p className="text-lg font-semibold text-slate-900">Test Details</p>
            <p className="pt-1 text-sm text-slate-600">
              Include aptitude and English proficiency exams if you have them.
            </p>
            <StepThree
              filterData={filterData}
              onFilterChange={handleFilterChange}
            />
          </section>

          <section className="rounded-[28px] border border-main/10 bg-white px-5 py-6">
            <p className="text-lg font-semibold text-slate-900">Preferences</p>
            <p className="pt-1 text-sm text-slate-600">
              Set your budget so the generated results stay relevant.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-6">
              <div className="col-span-1 sm:col-span-3">
                <p className="py-2">What is your Budget</p>
                <input
                  type="number"
                  placeholder="budget"
                  className="bg-light rounded-md px-4 py-2 mb-2 w-full sm:w-2/3"
                  name="budget"
                  min={0}
                  max={10000000}
                  value={filterData.budget}
                  onChange={(event) => {
                    setFilterData({
                      ...filterData,
                      budget: event.target.value,
                    });
                  }}
                />
              </div>
            </div>
          </section>

          <div className="flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              Required fields: country, state, degree, and discipline.
            </p>
            <div className="w-full sm:w-auto">
              <button
                type="submit"
                className="bg-main text-white px-5 py-3 rounded-full w-full hover:bg-white hover:outline outline-main hover:text-main transition duration-200 sm:w-auto"
                onClick={(event) => {
                  event.preventDefault();
                  const allKeys =
                    filterData.country !== '' &&
                    filterData.state !== '' &&
                    filterData.degree !== '' &&
                    filterData.discipline !== '';
                  if (allKeys) {
                    trackEvent('recommendations_generate', {
                      surface: 'recommendations_page',
                      status: 'success',
                    });
                    setShow(true);
                  } else {
                    trackEvent('recommendations_generate', {
                      surface: 'recommendations_page',
                      status: 'validation_failed',
                    });
                    toast.error('Please enter the required details', {
                      className: 'foo-bar',
                      autoClose: 1500,
                    });
                  }
                }}
              >
                Generate Recommendations
              </button>
            </div>
          </div>
        </form>
      )}

      {show && (
        <RecommendationResults key={universitiesKey} props={filterData} />
      )}
    </div>
  );
};

export default RecommendationsMain;
