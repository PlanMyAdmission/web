'use client';

import React, { useState, useEffect } from 'react';
import human from '../../assets/Human.svg';
import Arrow from '../../assets/homeAssets/Arrow.svg';
import Plane from '../../assets/Plane.svg';
import algoliasearch from 'algoliasearch/lite';
import Autosuggest from 'react-autosuggest';
import { matchSorter } from 'match-sorter';
import { useRouter } from 'next/navigation';
import JoinUsForm from './JoinUsForm';

const Hero = () => {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const searchClient = algoliasearch(
    '8CPNZ7GSBE',
    'd5e280b4cfd33be419ebfd25c236e5e0',
  );
  const index = searchClient.initIndex('explore');

  const inputProps = {
    type: 'search',
    placeholder: 'Search Universites,Courses...',
    value: search,
    onChange: (event, { newValue }) => {
      setSearch(newValue);
    },
    className:
      'inline p-3 pl-10 w-full text-sm rounded-lg ring-main ring-offset-1 ring-1 bg-transparent focus:outline-none placeholder:text-[11px] md:placeholder:text-[14px]',
    placeholder: 'Search Universites,Courses and more...',
  };

  const containerProps = {
    className: 'absolute w-full',
  };

  const handleDirectSelection = (topic) => {
    router.push(`/explore?topic=${topic}`);
  };

  return (
    <div className="flex md:flex-row flex-col max-w-7xl lg:mx-auto gap-5 md:items-center md:my-10 my-10 xl:px-2 sm:px-10 px-5">
      <div className="md:w-[60%] w-full grow flex-1">
        <img src={Plane} alt="/" className="md:hidden block " />
        <div className="relative flex flex-row">
          <h1 className="lg:text-7xl md:text-5xl text-4xl uppercase font-bold">
            BRING YOUR OVERSEAS EDUCATION
            <br />
            <span className="text-main">dreams to life!!</span>
          </h1>
          <img
            src={Arrow}
            alt="img"
            className="absolute hidden lg:right-0 lg:w-1/4 lg:block"
          />
        </div>
        <p className="font-bold text-[18px] md:w-1/2 py-4 leading-[20px]">
          Put the power of AI & Industry experts to work for you
        </p>
        {/* <div className="md:w-[600px] w-[90%] pt-4 pb-8 bg-light rounded-lg mb-10 ">
          {!isSubmitted ? (
            <>
              <h2 className="text-md font-semibold text-center text-gray-800 mb-6 px-4 leading-tight">
                Get started with Plan My Admission by registering today to access the AI portal and claim your free one-on-one consultation!
              </h2>
              <form
                action=""
                className="flex flex-col justify-center items-center space-y-3"
              >
              <div className="w-[90%]">
                <input
                  type="text"
                  name=""
                  id="name"
                  value={name}
                  placeholder="Name"
                  className={`py-2 px-3 rounded-md w-full outline-none ${errors.name ? 'border border-red-500' : ''}`}
                  onChange={(e) => setname(e.target.value)}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div className="w-[90%]">
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={phone}
                  placeholder="Phone No. (e.g. +91 9876543210)"
                  className={`py-2 px-3 rounded-md w-full outline-none ${errors.phone ? 'border border-red-500' : ''}`}
                  pattern="^\+?\d{10,15}$"
                  maxLength={15}
                  autoComplete="tel"
                  onChange={(e) => {
                    // Allow only numbers, spaces, and plus sign
                    const cleaned = e.target.value.replace(/[^\d+ ]/g, "");
                    setPhone(cleaned);
                  }}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              
              <div className="w-[90%]">
                <input
                  type="email"
                  name=""
                  id="email"
                  value={email}
                  placeholder="Email"
                  className={`py-2 px-3 rounded-md w-full outline-none ${errors.email ? 'border border-red-500' : ''}`}
                  onChange={(e) => setemail(e.target.value)}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              
              {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}
              
              <button
                type="submit"
                className={`bg-main px-4 py-2 rounded-md text-white w-[90%] transition-colors flex items-center justify-center ${
                  isLoading 
                    ? 'opacity-75 cursor-not-allowed' 
                    : 'hover:bg-main/90'
                }`}
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Starting...
                  </>
                ) : (
                  'Start Your Overseas Journey'
                )}
              </button>
            </form>
            </>
          ) : (
            <div className="flex flex-col justify-center items-center text-center py-8">
              <div className="mb-4">
                <svg className="w-16 h-16 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-main mb-2">Thank You!</h3>
              <p className="text-gray-700 text-sm px-4 mb-4">
                Thanks, We are creating AI Platform personalized for you.
              </p>
              <button
                onClick={handleFillAgain}
                className="text-main hover:text-main/80 text-sm underline underline-offset-2 transition-colors cursor-pointer"
              >
                Fill Again
              </button>
            </div>
          )}
        </div> */}
        <JoinUsForm />
      </div>
      <div className="">
        <img
          src={human}
          alt="human"
          className="md:block md:h-[400px] xl:h-full hidden lg:scale-105"
        />
      </div>
    </div>
  );
};
// <div className="flex md:flex-row flex-col md:items-center justify-center md:mt-[33px] sm:p-10 p-7">
//   <div className="md:w-1/2 w-full">
//     {/* Heading */}
//     <img src={Plane} alt="/" className="md:hidden block " />
//     <div className="flex flex-row  relative">
//       <h1 className="text-4xl md:text-7xl font-bold">
//         LET US BRING
//         <div className="text-main">DREAMS TO LIFE</div>
//       </h1>
//       <img
//         src={Arrow}
//         alt=""
//         className="absolute right-10 md:block hidden"
//       />
//     </div>

//     {/* content */}

//     <p className="font-bold text-[18px] md:pt-5 md:mb-3 md:w-1/2 pt-3">
//       Search for the best options to study abroad customized especially for
//       you
//     </p>
//     <p className="text-main uppercase font-bold p-3">ai powered search</p>

//     <form>
//       <div className="relative w-full">
//         <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none ">
//           <img src={Search} alt="" />
//         </div>
//         <input
//           type="search"
//           id="default-search"
//           className="block py-3 md:pr-[20%] pr-[33%] pl-10 md:w-[721px] w-full text-sm text-black font-medium rounded-lg  focus:outline-none ring-1 ring-main ring-offset-1 placeholder:text-[11px] md:placeholder:text-[14px]"
//           placeholder="Search for Universities, more..."
//           required
//           value={search}
//           autoComplete="off"
//           onChange={(e) => setSearch(e.target.value)}
//         />
//         <button
//           type="submit"
//           className="text-white md:w-1/5 w-1/3  absolute right-0 top-0  py-3 bg-main focus:outline-none  text-center font-medium rounded-lg text-sm px-2"
//         >
//           EXPLORE
//         </button>
//       </div>
//     </form>

//     <h2 className="font-bold text-xl p-4">Most Popular</h2>

//     {/* buttons */}

//     <div className=" w-full">
//       <Button
//         text="Computer Science"
//         showText={() => setSearch("computer science")}
//       />
//       <Button text="MBA" showText={() => setSearch("MBA")} />
//       <Button
//         text="Mechanical Engineering "
//         showText={() => setSearch("Mechanical Engineering ")}
//       />
//       <Button
//         text="Data Analysis"
//         showText={() => setSearch("Data Analysis")}
//       />
//       <Button text="Boston" showText={() => setSearch("Boston")} />
//       <Button text="Toronto" showText={() => setSearch("Toronto")} />
//       <Button text="New York" showText={() => setSearch("MBA")} />
//       <Button
//         text="University of Texas Dallas"
//         showText={() => setSearch("University of Texas Dallas")}
//       />
//       <Button
//         text="University of Toronto"
//         showText={() => setSearch("University of Toronto")}
//       />
//       <Button text="MIT" showText={() => setSearch("MIT")} />
//     </div>
//   </div>
//   <div className="">
//     <img src={human} alt="/" className="hidden md:block w-4/5" />
//   </div>
// </div>

const Button = ({ text, showText }) => {
  return (
    <button
      className="border border-main md:py-2 px-4 m-1 rounded-full hover:bg-light md:text-[14px] text-main text-[10px] py-1"
      onClick={() => showText()}
    >
      {text}
    </button>
  );
};

export default Hero;
