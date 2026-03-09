'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Universities from '@/components/dashboard/user/profile/Universities.jsx';
import {
  StepOne,
  StepThree,
  StepTwo,
} from '@/components/dashboard/user/profile/RecommendationSteps.jsx';
import app from '@lib/firebase.js';
import { getFirestore, collection, getDocs, query } from 'firebase/firestore';
import { toast } from 'react-toastify';

const RecommandationsMain = () => {
  const db = getFirestore(app);
  const [degrees, setDegrees] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [countries, setCountries] = useState([]);
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

  useEffect(() => {
    const fetchOptions = async () => {
      const [countriesSnap, degreesSnap, disciplinesSnap] = await Promise.all([
        getDocs(query(collection(db, 'countries_state'))),
        getDocs(query(collection(db, 'degrees'))),
        getDocs(query(collection(db, 'disciplines'))),
      ]);

      setCountries(countriesSnap.docs.map((doc) => doc.data()));
      setDegrees(degreesSnap.docs.map((doc) => doc.data()));
      setDisciplines(disciplinesSnap.docs.map((doc) => doc.data()));
    };

    fetchOptions();
  }, [db]);

  const handleFilterChange = (event) => {
    const value = event.target.value;
    setFilterData((current) => ({
      ...current,
      [event.target.name]: value,
    }));
  };

  const states = useMemo(() => {
    if (!countries.length || !filterData.country) {
      return [];
    }

    const selectedCountry = countries.find((cnt) => cnt.name === filterData.country);
    return selectedCountry?.states || [];
  }, [countries, filterData.country]);

  const universitiesKey = useMemo(() => JSON.stringify(filterData), [filterData]);

  return (
    <>
      {!show && (
        <form>
          <p className="text-center py-2 font-bold text-lg">General Details</p>
          <StepOne
            countries={countries}
            states={states}
            degrees={degrees}
            disciplines={disciplines}
            filterData={filterData}
            onFilterChange={handleFilterChange}
          />
          <p className="text-center py-2 font-bold text-lg">Academic Details</p>
          <div className="m-5 grid gap-4 grid-cols-1 sm:grid-cols-6">
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
            <StepTwo filterData={filterData} onFilterChange={handleFilterChange} />
          </div>
          <p className="text-center py-2 font-bold text-lg">Test Details</p>
          <StepThree filterData={filterData} onFilterChange={handleFilterChange} />
          <p className="text-center py-2 font-bold text-lg">Preferences</p>
          <div className="m-5 grid gap-4 grid-cols-1 sm:grid-cols-6">
            <div className="col-span-1 sm:col-span-3 ">
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
          <div className="m-5 grid gap-4 grid-cols-1 sm:grid-cols-8">
            <div className="col-span-1 sm:col-span-2 ">
              <button
                type="submit"
                className="bg-main text-white px-4 py-2 rounded-md my-3 w-full hover:bg-white hover:outline outline-main hover:text-main transition duration-200"
                onClick={(event) => {
                  event.preventDefault();
                  const allKeys =
                    filterData.state !== '' &&
                    filterData.degree !== '' &&
                    filterData.discipline !== '' &&
                    filterData.state !== '';
                  if (allKeys) {
                    setShow(true);
                  } else {
                    toast.error('Please enter the required details', {
                      className: 'foo-bar',
                      autoClose: 1500,
                    });
                  }
                }}
              >
                Generate
              </button>
            </div>
          </div>
        </form>
      )}

      {show && <Universities key={universitiesKey} props={filterData} />}
    </>
  );
};

export default RecommandationsMain;
