'use client';

import React, { useState } from 'react';
const Course = (udata) => {
  const [isOpen, setOpen] = useState(false);
  const [readMore, setReadMore] = useState(false);
  const dis_cont = udata.about ? udata.about?.slice(0, 120) : 'No description';
  const extraContent = udata.about ? udata.about?.slice(120) : '';
  const linkName = readMore ? 'Read Less << ' : 'Read More >> ';
  const handleDropDown = () => {
    setOpen(!isOpen);
  };
  return (
    <div id={udata.id} className="bg-light mt-8 mb-5 rounded-lg p-3 px-7">
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-5 border-b-2 border-main pb-4">
        <div className="col-span-2 sm:col-span-4 self-center">
          <div className="flex flex-col flex-wrap" data-accordion="open">
            <button
              className="focus:outline-none bg-transparent p-0 text font-bold text-1.9lr inline-flex"
              onClick={handleDropDown}
            >
              {udata.course}
            </button>
            <div className="flex flex-col justify-left sm:flex-row mb-2">
              <div className="flex flex-row items-center text-main">
                <svg
                  aria-hidden="true"
                  className="w-3 h-3 text-main mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M18,4.48a8.45,8.45,0,0,0-12,12l5.27,5.28a1,1,0,0,0,1.42,0L18,16.43A8.45,8.45,0,0,0,18,4.48ZM16.57,15,12,19.59,7.43,15a6.46,6.46,0,1,1,9.14,0ZM9,7.41a4.32,4.32,0,0,0,0,6.1,4.31,4.31,0,0,0,7.36-3,4.24,4.24,0,0,0-1.26-3.05A4.3,4.3,0,0,0,9,7.41Zm4.69,4.68a2.33,2.33,0,1,1,.67-1.63A2.33,2.33,0,0,1,13.64,12.09Z"
                  ></path>
                </svg>
                <label className="mr-1">{udata?.state}</label>
              </div>
              <div className="flex flex-row items-center text-main">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
                  fill="currentColor"
                  className="bi bi-circle-fill mr-1"
                  viewBox="0 0 16 16"
                >
                  {' '}
                  <circle cx="8" cy="8" r="8" />{' '}
                </svg>
                {udata?.country}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-left justify-left text">
              <div className="flex flex-row sm:mr-10 items-center">
                <label className="text-bold text text-2xs">Degree</label>
                <label className="text-main ml-2">{udata?.degree}</label>
              </div>

              <div className="flex flex-row items-center">
                <label className="text-bold text text-2xs">Format</label>{' '}
                <label className="text-main ml-2">{udata?.format}</label>
              </div>
            </div>
          </div>
        </div>
        <a
          href={udata?.url}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer"
        >
          <div className="col-span-2 sm:col-span-1 flex flex-col justify-center">
            <button
              type="submit"
              className="block text-main w-full text-1.5lr bg-transparent uppercase font-bold py-1 px-4 rounded-lg"
            >
              Enr
              <label className="underline underline-offset-8 decoration-main">
                oll
              </label>
            </button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="20"
              fill="currentColor"
              className="bi bi-arrow-right text-main font-bold self-center ml-20 -translate-y-3"
              viewBox="0 0 16 16"
            >
              {' '}
              <path
                fillRule="evenodd"
                d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
              />{' '}
            </svg>
          </div>
        </a>
      </div>
      <div className={` pt-5 ${isOpen ? 'block' : 'hidden'}`}>
        <div className="grid grid-cols-2 sm:grid-cols-4 mb-4">
          <div className="col-span-2 sm:col-span-3">
            <label className="block text text-lr font-bold mb-0">About</label>
            <div className="mb-3 inline-block">
              <span className="text text-xs">
                {!readMore ? dis_cont : `${dis_cont}${extraContent}`}
              </span>
            </div>
            <a
              className="cursor-pointer text-main text-xs"
              onClick={() => {
                setReadMore(!readMore);
              }}
            >
              <h2>{linkName}</h2>
            </a>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label className="text text-xs text-main block">Discipline</label>
            <label className="text text-xs font-bold block">
              {udata?.discipline}
            </label>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="text text-xs text-main block">
              Sub-Discipline
            </label>
            <label className="text text-xs font-bold block">
              {udata?.sub_discipline}
            </label>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="text text-xs text-main block">Sub-Degree</label>
            <label className="text text-xs font-bold block">
              {udata?.sub_degree}
            </label>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row bg-light justify-between mt-4 mb-5 rounded-lg p-3">
          <div className="w-full px-1 md:w-1/2 md:px-2 text text-2xs">
            <div className="flex flex-row justify-between border-b-2 border-solid border-main my-3 p-1">
              <label>Tuition Fee</label>
              <label>{udata.fee}</label>
            </div>
            <div className="flex flex-row justify-between border-b-2 border-solid border-main my-3 p-1">
              <label>Acceptance Criteria</label>
              <label className="uppercase">{udata?.acceptance}</label>
            </div>
            <div className="flex flex-row justify-between border-b-2 border-solid border-main my-3 p-1">
              <label className="mr-10">Documents Required</label>
              <label className="uppercase pl-10">{udata?.docs}</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Course;
