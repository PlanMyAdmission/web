'use client';

import React from 'react';

const SectionHeading = ({ label }) => (
  <label className="text-[#3f1831] text-1.7lr font-bold">
    <label className="underline underline-offset-8 decoration-main">
      {label.slice(0, 3)}
    </label>
    {label.slice(3)}
  </label>
);

const Row = ({ label, value }) => (
  <div className="flex flex-row justify-between border-b-2 border-solid border-main my-3 p-1">
    <label>{label}</label>
    <label>{value}</label>
  </div>
);

export const BasicDetailsSection = React.forwardRef(
  function BasicDetailsSection({ data }, ref) {
    return (
      <div ref={ref} className="mt-5 ml-8 mb-8">
        <SectionHeading label="Basic Details" />
        <div className="flex flex-col sm:flex-row bg-light justify-between mt-8 mb-5 rounded-lg p-3">
          <div className="w-full px-1 md:w-1/2 md:px-2 text-2xs">
            <Row
              label="Duration"
              value={`${data.Duration ? data.Duration : '-'} months`}
            />
            <Row
              label="Study Level"
              value={data.Studylvl ? data.Studylvl : '-'}
            />
            <Row label="Intakes" value={data.Intakes ? data.Intakes : '-'} />
            <Row
              label="Scholarship"
              value={data.ScholarshipAvailable ? 'Available' : 'Not Available'}
            />
          </div>
          <div className="w-full px-1 md:w-1/2 md:px-2 text-2xs">
            <Row
              label="Application Fee Wavier"
              value={data.AppFeeWaiverAvailable ? 'Available' : 'Not Available'}
            />
            <Row
              label="Course Mode"
              value={data.IsOnlineCourse ? 'Online' : 'In-Person'}
            />
            <Row
              label="Required Work Expirence"
              value={`${data.WorkExp ? data.WorkExp : '0'} years`}
            />
            <Row
              label="Tuition Fee"
              value={data.TutionFee ? data.TutionFee : '-'}
            />
          </div>
        </div>
      </div>
    );
  },
);

export const RankingSection = React.forwardRef(function RankingSection(
  { data },
  ref,
) {
  return (
    <div ref={ref} className="mt-5 ml-8 mb-8">
      <SectionHeading label="Ranking" />
      <div className="flex flex-col sm:flex-row bg-light justify-between mt-8 mb-5 rounded-lg p-3">
        <div className="w-full px-1 md:w-1/2 md:px-2 text-2xs">
          <Row
            label="National Rank"
            value={
              data.WebomatricsNationalRanking
                ? data.WebomatricsNationalRanking
                : '-'
            }
          />
        </div>
        <div className="w-full px-1 md:w-1/2 md:px-2 text-2xs">
          <Row
            label="World Rank"
            value={
              data.WebomatricsWorldRanking ? data.WebomatricsWorldRanking : '-'
            }
          />
        </div>
      </div>
    </div>
  );
});

export const ExamRequirementsSection = React.forwardRef(
  function ExamRequirementsSection({ data }, ref) {
    return (
      <div ref={ref} className="mt-5 ml-8 mb-8">
        <SectionHeading label="Exam Requirements" />
        <div className="flex flex-col sm:flex-row bg-light justify-between mt-8 mb-5 rounded-lg p-3">
          <div className="w-full px-1 md:w-1/2 md:px-2 text-2xs">
            <Row
              label="SAT Score"
              value={data.SatRequired ? data.SatScore : 'Not Required'}
            />
            <Row
              label="GMAT Score"
              value={data.GmatRequired ? data.GmatScore : 'Not Required'}
            />
            <Row
              label="ACT Score"
              value={data.ActRequired ? data.ActScore : 'Not Required'}
            />
            <Row
              label="GRE Score"
              value={data.GreRequired ? data.GreScore : 'Not Required'}
            />
          </div>
          <div className="w-full px-1 md:w-1/2 md:px-2 text-2xs">
            <Row
              label="TOEFL Score"
              value={data.ToeflRequired ? data.ToeflScore : 'Not Required'}
            />
            <Row
              label="PTE Score"
              value={data.PteRequired ? data.PteScore : 'Not Required'}
            />
            <Row
              label="DET Score"
              value={data.DETRequired ? data.DETScore : 'Not Required'}
            />
            <Row
              label="IELTS Score"
              value={data.IeltsRequired ? data.IeltsOverall : 'Not Required'}
            />
          </div>
        </div>
      </div>
    );
  },
);

export const EntryRequirementsSection = React.forwardRef(
  function EntryRequirementsSection({ data }, ref) {
    return (
      <div ref={ref} className="mt-5 ml-8 mb-8">
        <SectionHeading label="Entry Requirements" />
        <div className="flex flex-col sm:flex-row bg-light justify-between mt-8 mb-5 rounded-lg p-3">
          <div className="w-full px-1 md:w-1/2 md:px-2 text-2xs">
            <Row
              label="12th (out of 4)"
              value={
                data.EntryRequirementTwelfthOutOf4
                  ? data.EntryRequirementTwelfthOutOf4
                  : 'None'
              }
            />
            <Row
              label="12th (out of 5)"
              value={
                data.EntryRequirementTwelfthOutOf5
                  ? data.EntryRequirementTwelfthOutOf5
                  : 'None'
              }
            />
            <Row
              label="12th (out of 7)"
              value={
                data.EntryRequirementTwelfthOutOf7
                  ? data.EntryRequirementTwelfthOutOf7
                  : 'None'
              }
            />
            <Row
              label="12th (out of 10)"
              value={
                data.EntryRequirementTwelfthOutOf10
                  ? data.EntryRequirementTwelfthOutOf10
                  : 'None'
              }
            />
            <Row
              label="12th (out of 100)"
              value={
                data.EntryRequirementTwelfthOutOf100
                  ? data.EntryRequirementTwelfthOutOf100
                  : 'None'
              }
            />
          </div>
          <div className="w-full px-1 md:w-1/2 md:px-2 text-2xs">
            <Row
              label="UG (out of 4)"
              value={
                data.EntryRequirementUgOutOf4
                  ? data.EntryRequirementUgOutOf4
                  : 'None'
              }
            />
            <Row
              label="UG (out of 5)"
              value={
                data.EntryRequirementUgOutOf5
                  ? data.EntryRequirementUgOutOf5
                  : 'None'
              }
            />
            <Row
              label="UG (out of 7)"
              value={
                data.EntryRequirementUgOutOf7
                  ? data.EntryRequirementUgOutOf7
                  : 'None'
              }
            />
            <Row
              label="UG (out of 10)"
              value={
                data.EntryRequirementUgOutOf10
                  ? data.EntryRequirementUgOutOf10
                  : 'None'
              }
            />
            <Row
              label="UG (out of 100)"
              value={
                data.EntryRequirementUgOutOf100
                  ? data.EntryRequirementUgOutOf100
                  : 'None'
              }
            />
          </div>
        </div>
      </div>
    );
  },
);
