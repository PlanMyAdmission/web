'use client';

import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
const ExploreMainPage = ({ props }) => {
  const basic = useRef(null);
  const rank = useRef(null);
  const exam = useRef(null);
  const entry = useRef(null);
  const [univdata, setUnivdata] = useState([]);
  useEffect(() => {
    setUnivdata(props);
  }, [props]);
  useEffect(() => {}, [univdata]);
  const data = [
    {
      id: 1,
      name: 'Basic Details',
      ref: basic,
    },
    {
      id: 2,
      name: 'Ranking',
      ref: rank,
    },
    {
      id: 3,
      name: 'Exam Requirements',
      ref: exam,
    },
    {
      id: 4,
      name: 'Entry Requirements',
      ref: entry,
    },
  ];
  const style =
    'py-2 px-4 focus:bg-white focus:font-bold active:font-bold active:bg-white focus:outline-none outline-none mx-2 my-2 rounded-md transition-all duration-100 ease-in-out  ';
  return (
    <>
      <div className="max-w-5xl mx-auto bg-light rounded my-5 sticky top-1">
        <div className=" bg-light md:max-w-7xl md:mx-auto flex justify-between rounded-md text-1.5lr overflow-x-auto  hide-scroll-bar whitespace-nowrap snap-x my-10 ">
          {data.map((topic) => {
            return (
              <span key={topic.id}>
                <button
                  autoFocus={false}
                  className={style}
                  onClick={() => {
                    {
                      topic.ref.current.scrollIntoView();
                    }
                  }}
                >
                  {topic.name}
                </button>
              </span>
            );
          })}
        </div>
      </div>
      {univdata &&
        univdata.map((data) => {
          return (
            <>
              <div ref={basic} className="mt-5 ml-8 mb-8">
                <label className="text text-1.7lr font-bold">
                  <label className="underline underline-offset-8 decoration-main">
                    Bas
                  </label>
                  ic Details
                </label>
                <div className="flex flex-col sm:flex-row bg-light justify-between mt-8 mb-5 rounded-lg p-3">
                  <div className="w-full px-1 md:w-1/2 md:px-2 text text-2xs">
                    <div className="flex flex-row justify-between border-b-2 border-solid border-main my-3 p-1">
                      <label>Duration</label>
                      <label>
                        {data.Duration ? data.Duration : '-'} months
                      </label>
                    </div>
                    <div className="flex flex-row justify-between border-b-2 border-solid border-main my-3 p-1">
                      <label>Study Level</label>
                      <label>{data.Studylvl ? data.Studylvl : '-'}</label>
                    </div>
                    <div className="flex flex-row justify-between border-b-2 border-solid border-main my-3 p-1">
                      <label>Intakes</label>
                      <label>{data.Intakes ? data.Intakes : '-'}</label>
                    </div>
                    {}
                    <div className="flex flex-row justify-between border-b-2 border-solid border-main my-3 p-1">
                      <label>Scholarship</label>
                      <label>
                        {data.ScholarshipAvailable
                          ? 'Available'
                          : 'Not Available'}
                      </label>
                    </div>
                  </div>
                  <div className="w-full px-1 md:w-1/2 md:px-2 text text-2xs">
                    <div className="flex flex-row justify-between border-b-2 border-solid border-main my-3 p-1">
                      <label>Application Fee Wavier</label>
                      <label>
                        {data.AppFeeWaiverAvailable
                          ? 'Available'
                          : 'Not Available'}
                      </label>
                    </div>
                    <div className="flex flex-row justify-between border-b-2 border-solid border-main my-3 p-1">
                      <label>Course Mode</label>
                      <label>
                        {data.IsOnlineCourse ? 'Online' : 'In-Person'}
                      </label>
                    </div>
                    <div className="flex flex-row justify-between border-b-2 border-solid border-main my-3 p-1">
                      <label>Required Work Expirence</label>
                      <label>{data.WorkExp ? data.WorkExp : '0'} years</label>
                    </div>
                    <div className="flex flex-row justify-between border-b-2 border-solid border-main my-3 p-1">
                      <label>Tuition Fee</label>
                      <label>{data.TutionFee ? data.TutionFee : '-'}</label>
                    </div>
                  </div>
                </div>
              </div>

              <div ref={rank} className="mt-5 ml-8 mb-8">
                <label className="text text-1.7lr font-bold">
                  <label className="underline underline-offset-8 decoration-main">
                    Ran
                  </label>
                  king
                </label>
                <div className="flex flex-col sm:flex-row bg-light justify-between mt-8 mb-5 rounded-lg p-3">
                  <div className="w-full px-1 md:w-1/2 md:px-2 text text-2xs">
                    <div className="flex flex-row justify-between border-b-2 border-solid border-main my-3 p-1">
                      <label>National Rank</label>
                      <label>
                        {data.WebomatricsNationalRanking
                          ? data.WebomatricsNationalRanking
                          : '-'}
                      </label>
                    </div>
                  </div>
                  <div className="w-full px-1 md:w-1/2 md:px-2 text text-2xs">
                    <div className="flex flex-row justify-between border-b-2 border-solid border-main my-3 p-1">
                      <label>World Rank</label>
                      <label>
                        {data.WebomatricsWorldRanking
                          ? data.WebomatricsWorldRanking
                          : '-'}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div ref={exam} className="mt-5 ml-8 mb-8">
                <label className="text text-1.7lr font-bold">
                  <label className="underline underline-offset-8 decoration-main">
                    Exa
                  </label>
                  m Requirements
                </label>
                <div className="flex flex-col sm:flex-row bg-light justify-between mt-8 mb-5 rounded-lg p-3">
                  <div className="w-full px-1 md:w-1/2 md:px-2 text text-2xs">
                    <div className="flex flex-row justify-between border-b-2 border-solid border-main my-3 p-1">
                      <label>SAT Score</label>
                      <label>
                        {data.SatRequired ? data.SatScore : 'Not Required'}
                      </label>
                    </div>
                    <div className="flex flex-row justify-between border-b-2 border-solid border-main my-3 p-1">
                      <label>GMAT Score</label>
                      <label>
                        {data.GmatRequired ? data.GmatScore : 'Not Required'}
                      </label>
                    </div>
                    <div className="flex flex-row justify-between border-b-2 border-solid border-main my-3 p-1">
                      <label>ACT Score</label>
                      <label>
                        {data.ActRequired ? data.ActScore : 'Not Required'}
                      </label>
                    </div>
                    <div className="flex flex-row justify-between border-b-2 border-solid border-main my-3 p-1">
                      <label>GRE Score</label>
                      <label>
                        {data.GreRequired ? data.GreScore : 'Not Required'}
                      </label>
                    </div>
                  </div>
                  <div className="w-full px-1 md:w-1/2 md:px-2 text text-2xs">
                    <div className="flex flex-row justify-between border-b-2 border-solid border-main my-3 p-1">
                      <label>TOEFL Score</label>
                      <label>
                        {data.ToeflRequired ? data.ToeflScore : 'Not Required'}
                      </label>
                    </div>
                    <div className="flex flex-row justify-between border-b-2 border-solid border-main my-3 p-1">
                      <label>PTE Score</label>
                      <label>
                        {data.PteRequired ? data.PteScore : 'Not Required'}
                      </label>
                    </div>
                    <div className="flex flex-row justify-between border-b-2 border-solid border-main my-3 p-1">
                      <label>DET Score</label>
                      <label>
                        {data.DETRequired ? data.DETScore : 'Not Required'}{' '}
                      </label>
                    </div>
                    {}
                    <div className="flex flex-row justify-between border-b-2 border-solid border-main my-3 p-1">
                      <label>IELTS Score</label>
                      <label>
                        {data.IeltsRequired
                          ? data.IeltsOverall
                          : 'Not Required'}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div ref={entry} className="mt-5 ml-8 mb-8">
                <label className="text text-1.7lr font-bold">
                  <label className="underline underline-offset-8 decoration-main">
                    Ent
                  </label>
                  ry Requirements
                </label>
                <div className="flex flex-col sm:flex-row bg-light justify-between mt-8 mb-5 rounded-lg p-3">
                  <div className="w-full px-1 md:w-1/2 md:px-2 text text-2xs">
                    <div className="flex flex-row justify-between border-b-2 border-solid border-main my-3 p-1">
                      <label>12th (out of 4)</label>
                      <label>
                        {data.EntryRequirementTwelfthOutOf4
                          ? data.EntryRequirementTwelfthOutOf4
                          : 'None'}
                      </label>
                    </div>
                    <div className="flex flex-row justify-between border-b-2 border-solid border-main my-3 p-1">
                      <label>12th (out of 5)</label>
                      <label>
                        {data.EntryRequirementTwelfthOutOf5
                          ? data.EntryRequirementTwelfthOutOf5
                          : 'None'}
                      </label>
                    </div>
                    <div className="flex flex-row justify-between border-b-2 border-solid border-main my-3 p-1">
                      <label>12th (out of 7)</label>
                      <label>
                        {data.EntryRequirementTwelfthOutOf7
                          ? data.EntryRequirementTwelfthOutOf7
                          : 'None'}
                      </label>
                    </div>
                    <div className="flex flex-row justify-between border-b-2 border-solid border-main my-3 p-1">
                      <label>12th (out of 10)</label>
                      <label>
                        {data.EntryRequirementTwelfthOutOf10
                          ? data.EntryRequirementTwelfthOutOf10
                          : 'None'}
                      </label>
                    </div>
                    <div className="flex flex-row justify-between border-b-2 border-solid border-main my-3 p-1">
                      <label>12th (out of 100)</label>
                      <label>
                        {data.EntryRequirementTwelfthOutOf100
                          ? data.EntryRequirementTwelfthOutOf100
                          : 'None'}
                      </label>
                    </div>
                  </div>
                  <div className="w-full px-1 md:w-1/2 md:px-2 text text-2xs">
                    <div className="flex flex-row justify-between border-b-2 border-solid border-main my-3 p-1">
                      <label>UG (out of 4)</label>
                      <label>
                        {data.EntryRequirementUgOutOf4
                          ? data.EntryRequirementUgOutOf4
                          : 'None'}
                      </label>
                    </div>
                    <div className="flex flex-row justify-between border-b-2 border-solid border-main my-3 p-1">
                      <label>UG (out of 5)</label>
                      <label>
                        {data.EntryRequirementUgOutOf5
                          ? data.EntryRequirementUgOutOf5
                          : 'None'}
                      </label>
                    </div>
                    <div className="flex flex-row justify-between border-b-2 border-solid border-main my-3 p-1">
                      <label>UG (out of 7)</label>
                      <label>
                        {data.EntryRequirementUgOutOf7
                          ? data.EntryRequirementUgOutOf7
                          : 'None'}
                      </label>
                    </div>
                    <div className="flex flex-row justify-between border-b-2 border-solid border-main my-3 p-1">
                      <label>UG (out of 10)</label>
                      <label>
                        {data.EntryRequirementUgOutOf10
                          ? data.EntryRequirementUgOutOf10
                          : 'None'}
                      </label>
                    </div>
                    <div className="flex flex-row justify-between border-b-2 border-solid border-main my-3 p-1">
                      <label>UG (out of 100)</label>
                      <label>
                        {data.EntryRequirementUgOutOf100
                          ? data.EntryRequirementUgOutOf100
                          : 'None'}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
        })}
    </>
  );
};
export default ExploreMainPage;
