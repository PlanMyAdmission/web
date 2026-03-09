'use client';

import React from 'react';
import Image from 'next/image';

const LocationIcon = () => (
  <svg
    aria-hidden="true"
    className="w-3 h-3 text-main"
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
);

const AcceptanceBadge = ({ acceptanceLabel }) => (
  <li className="flex flex-row items-center flex-wrap ">
    <svg
      aria-hidden="true"
      className="w-4 h-4 text-main mt-1"
      fill="none"
      stroke="black"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M10.354 6.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708 0z"
      />
      <path d="m10.273 2.513-.921-.944.715-.698.622.637.89-.011a2.89 2.89 0 0 1 2.924 2.924l-.01.89.636.622a2.89 2.89 0 0 1 0 4.134l-.637.622.011.89a2.89 2.89 0 0 1-2.924 2.924l-.89-.01-.622.636a2.89 2.89 0 0 1-4.134 0l-.622-.637-.89.011a2.89 2.89 0 0 1-2.924-2.924l.01-.89-.636-.622a2.89 2.89 0 0 1 0-4.134l.637-.622-.011-.89a2.89 2.89 0 0 1 2.924-2.924l.89.01.622-.636a2.89 2.89 0 0 1 4.134 0l-.715.698a1.89 1.89 0 0 0-2.704 0l-.92.944-1.32-.016a1.89 1.89 0 0 0-1.911 1.912l.016 1.318-.944.921a1.89 1.89 0 0 0 0 2.704l.944.92-.016 1.32a1.89 1.89 0 0 0 1.912 1.911l1.318-.016.921.944a1.89 1.89 0 0 0 2.704 0l.92-.944 1.32.016a1.89 1.89 0 0 0 1.911-1.912l-.016-1.318.944-.921a1.89 1.89 0 0 0 0-2.704l-.944-.92.016-1.32a1.89 1.89 0 0 0-1.912-1.911l-1.318.016z" />
    </svg>
    <label className="text-bold text-main font-bold text-2xs">{acceptanceLabel}</label>
    <label className="text text-2.5xs sm:ml-2">Acceptance Rate</label>
  </li>
);

const UniversityCourseCard = ({ course, universityInfo, onEnroll }) => {
  const logo = universityInfo?.logo || '';
  const university = universityInfo?.name || 'University';
  const fee = universityInfo?.tuition_value || 0;
  const curr = universityInfo?.tuition_currency || '';
  const accept = universityInfo?.acceptance_rate;
  const acceptanceLabel = typeof accept === 'number' ? `${accept}%` : 'N/A';

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-7 items-center bg-white m-2 rounded-lg py-2 px-5 ring-main ring-1 ring-offset-1 my-5">
      <div className="col-span-1 sm:col-span-1 h-10 sm:h-20 relative">
        {logo ? (
          <Image
            src={logo}
            alt={university}
            fill
            className="object-contain rounded-md"
            sizes="80px"
          />
        ) : (
          <div className="w-full h-full bg-light rounded-md" aria-hidden="true" />
        )}
      </div>
      <div className="col-span-2 sm:col-span-5">
        <h1 className="text-lr font-bold px-5">
          {course?.degree} in {course?.name}
        </h1>
        <ul className="text-2xs px-5 mt-3">
          <li className="text-main flex flex-row items-center">
            <LocationIcon />
            {`${course?.state}, ${course?.country}`}
          </li>
          <li className="mt-1">
            <label className="text font-bold">University: </label>
            {university}
          </li>
          <li>
            <label className="text font-bold">Yearly Tuition Fee: </label>
            {curr} {fee}
          </li>
          <AcceptanceBadge acceptanceLabel={acceptanceLabel} />
        </ul>
      </div>
      <div className="col-span-2 sm:col-span-1 flex flex-col justify-end">
        <button
          type="button"
          className="block text-main w-full uppercase bg-transparent p-1 font-bold text-lg mb-0 mt-5"
          onClick={onEnroll}
        >
          Enroll
        </button>
      </div>
    </div>
  );
};

export const UniversityListSpinner = () => (
  <div role="status" className="flex align-items-center justify-center ">
    <svg
      aria-hidden="true"
      className="w-12 h-12 mr-2 text-gray-200 animate-spin fill-blue-600 text-main"
      viewBox="0 0 100 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="currentColor"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentFill"
      />
    </svg>
  </div>
);

export default UniversityCourseCard;
