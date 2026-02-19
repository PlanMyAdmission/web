'use client';

import React from 'react';
import { useRef } from 'react';
import {
  BasicDetailsSection,
  EntryRequirementsSection,
  ExamRequirementsSection,
  RankingSection,
} from '@/components/explore_university/ExploreMainSections.jsx';
const TAB_STYLE =
  'py-2 px-4 focus:bg-white focus:font-bold active:font-bold active:bg-white focus:outline-none outline-none mx-2 my-2 rounded-md transition-all duration-100 ease-in-out';

const ExploreMainPage = ({ props }) => {
  const basic = useRef(null);
  const rank = useRef(null);
  const exam = useRef(null);
  const entry = useRef(null);
  const tabs = [
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

  return (
    <>
      <div className="max-w-5xl mx-auto bg-light rounded my-5 sticky top-1">
        <div className=" bg-light md:max-w-7xl md:mx-auto flex justify-between rounded-md text-1.5lr overflow-x-auto  hide-scroll-bar whitespace-nowrap snap-x my-10 ">
          {tabs.map((topic) => {
            return (
              <span key={topic.id}>
                <button
                  autoFocus={false}
                  className={TAB_STYLE}
                  onClick={() => {
                    topic.ref.current.scrollIntoView();
                  }}
                >
                  {topic.name}
                </button>
              </span>
            );
          })}
        </div>
      </div>
      {props &&
        props.map((data) => {
          return (
            <>
              <BasicDetailsSection ref={basic} data={data} />
              <RankingSection ref={rank} data={data} />
              <ExamRequirementsSection ref={exam} data={data} />
              <EntryRequirementsSection ref={entry} data={data} />
            </>
          );
        })}
    </>
  );
};
export default ExploreMainPage;
