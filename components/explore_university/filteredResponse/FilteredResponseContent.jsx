import Image from 'next/image';
import React from 'react';

const FilteredResponseContent = ({
  docs,
  countries,
  uniqueUniversities,
  sortByRank,
  setSortByRank,
  handleAddCountry,
  selectedCountries,
  setSelectedCountries,
  filteredDocs,
  visibleCount,
  setVisibleCount,
  imageByUniversityId,
  handleEnroll,
}) => (
  <div className="max-w-6xl mx-auto bg-transparent px-5 pt-10 pb-1 rounded my-1">
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-6">
      <div className="col-span-5 sm:col-span-6 w-full mx-auto bg-light px-5 py-2 rounded mb-5 mt-4">
        <label className="text-main">
          You found <label className="font-bold">{uniqueUniversities.length}</label> institutes and{' '}
          <label className="font-bold">{docs.length}</label> courses
        </label>
      </div>
    </div>

    <div className="col-span-5 sm:col-span-4 mb-4">
      <label className="text font-bold">Filter By</label>
    </div>

    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div className="col-span-2 sm:col-span-1">
        <div className="flex flex-row w-full justify-between">
          <button
            type="button"
            className={
              sortByRank
                ? 'inline-block text-xs sm:text-2xs w-full bg-light p-1 m-1'
                : 'inline-block text-xs sm:text-2xs text-white w-full bg-main p-1 m-1'
            }
            onClick={() => setSortByRank(false)}
          >
            Best Match
          </button>
          <button
            type="button"
            className={
              !sortByRank
                ? 'inline-block text-xs sm:text-2xs w-full bg-light p-1 m-1'
                : 'inline-block text-xs sm:text-2xs text-white w-full bg-main p-1 m-1'
            }
            onClick={() => setSortByRank(true)}
          >
            Best Rank
          </button>
        </div>

        <select
          id="country"
          name="country"
          className="inline-block mt-5 bg-light w-full p-1 focus:outline-none text-xs sm:text-2xs"
          onChange={(event) => handleAddCountry(event.target.value)}
        >
          <option value="">Country</option>
          {countries.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-2 gap-3 my-3 mx-2 sm:grid-cols-2">
          {selectedCountries.map((value) => (
            <div
              key={value}
              className="ring-main ring-offset-1 ring-1 rounded-lg flex w-full flex-row items-center col-span-1 sm:col-span-1 justify-around"
            >
              <label className="text-main text-3xs pl-1 pr-1">{value}</label>
              <button
                type="button"
                onClick={() => setSelectedCountries((prev) => prev.filter((item) => item !== value))}
              >
                <svg
                  aria-hidden="true"
                  className="w-3 h-3 text-main float-right"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-2 sm:col-span-3">
        <div className="max-w-6xl mx-auto bg-light px-5 py-3 rounded mb-5 ml-7">
          {filteredDocs.slice(0, visibleCount).map((data) => {
            const logoUrl = imageByUniversityId[data?.UniversityId] || '/images/seo/og-default.svg';
            return (
              <div
                key={data?.id}
                className="grid grid-cols-2 gap-4 sm:grid-cols-7 items-center bg-white m-2 rounded-lg py-2 px-5 ring-main ring-1 ring-offset-1 my-5"
              >
                <Image
                  unoptimized
                  width={1200}
                  height={800}
                  sizes="100vw"
                  src={logoUrl}
                  alt={data?.University || 'University Logo'}
                  className="col-span-1 sm:col-span-1 w-full h-10 rounded-md sm:h-20 object-contain"
                />
                <div className="col-span-2 sm:col-span-5">
                  <h1 className="text-lr font-bold px-5">{data?.Name}</h1>
                  <ul className="text-2xs px-5 mt-3">
                    <li className="text-main flex flex-row items-center">{data?.Country}</li>
                    <li className="mt-1">
                      <label className="text font-bold">University: </label>
                      {data?.University}
                    </li>
                    <li>
                      <label className="text font-bold">Duration: </label>
                      {data?.Duration}
                    </li>
                    <li>
                      <label className="text font-bold">Yearly Tuition Fee: </label>
                      {data?.TutionFee}
                    </li>
                  </ul>
                </div>
                <div className="col-span-2 sm:col-span-1 flex flex-col justify-between">
                  <button
                    type="button"
                    className="block text-main w-full uppercase bg-transparent p-1 font-bold text-lg mb-0"
                    onClick={() => handleEnroll(data, logoUrl)}
                  >
                    Enroll
                  </button>
                </div>
              </div>
            );
          })}

          <div className="mb-10">
            <button
              type="button"
              className="block text-white align-center justify-center bg-main text-1.5lr p-3 text-lg mb-0 mt-5 items-center rounded-lg self-center"
              onClick={() => setVisibleCount((prev) => prev + 10)}
            >
              Show More
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default FilteredResponseContent;
