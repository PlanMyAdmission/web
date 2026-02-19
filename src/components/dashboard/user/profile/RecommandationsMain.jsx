import React, { useEffect, useState } from 'react';
import FilteredResponse from '../../../explore_university/FilteredResponse';
import { year, month } from './data';
import Universities from './Universities';
import app from '../../../../firebase';
import { useAuth } from '../../../../context/AuthProvider';
import {
  Firestore,
  getFirestore,
  doc,
  collection,
  onSnapshot,
  getDocs,
  limit,
  query,
  where,
} from 'firebase/firestore';
import { toast } from 'react-toastify';

const RecommandationsMain = () => {
  const db = getFirestore(app);
  const handleFilterChange = (e) => {
    // e.preventDefault();
    const value = e.target.value;
    setFilterData({
      ...filterData,
      [e.target.name]: value,
    });
  };
  const [degrees, setDegrees] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const { uploadFilterData } = useAuth();
  // const [country, setCountry] = useState("")
  // const [state, setState] = useState("")
  // const [discipline, setDiscipline] = useState("")
  // const [degree, setDegree] = useState("")

  const fetchDegrees = async () => {
    // e.preventDefault();
    const dataref = query(collection(db, 'degrees'));
    const docSnap = await getDocs(dataref);
    docSnap.forEach((doc) => {
      setDegrees((prev) => {
        return [...prev, doc.data()];
      });
    });
  };

  const fetchDisciplines = async () => {
    // e.preventDefault();
    const dataref = query(collection(db, 'disciplines'));
    const docSnap = await getDocs(dataref);
    docSnap.forEach((doc) => {
      setDisciplines((prev) => {
        return [...prev, doc.data()];
      });
    });
  };

  const fetchCountries = async () => {
    // e.preventDefault();
    const dataref = query(collection(db, 'countries_state'));
    const docSnap = await getDocs(dataref);
    docSnap.forEach((doc) => {
      setCountries((prev) => {
        return [...prev, doc.data()];
      });
    });
  };

  useEffect(() => {
    fetchCountries();
    fetchDegrees();
    fetchDisciplines();
  }, []);

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
    // universityPartnered: "",
    budget: '',
  });
  useEffect(() => {
    console.log(filterData);
  }, [filterData]);

  useEffect(() => {
    countries &&
      countries?.filter((cnt) => {
        if (cnt.name == filterData.country) {
          setStates(cnt.states);
        }
      });
  }, [filterData.country]);

  const [show, setShow] = useState(false);
  // const handelSubmit = (props) => {
  //   console.log("Thank you");
  //   // alert(JSON.stringify(props));
  //   console.log(props);
  // };

  const Step1 = () => {
    return (
      <div className="m-5 grid gap-4 grid-cols-1 sm:grid-cols-6 justify-center">
        <div className="col-span-1 sm:col-span-2">
          <p className="text-md">
            Choose your prefered Country<label className="text-main">*</label>
          </p>
          <select
            className="bg-light px-4 py-2 rounded-md my-1 w-full"
            name="country"
            onChange={(e) => {
              handleFilterChange(e);
            }}
            value={filterData.country}
            required
            // autoFocus
          >
            <option value={''} disabled>
              Select
            </option>
            {countries &&
              countries.map((value) => {
                return (
                  <option value={value.name} key={value.id}>
                    {value.name}
                  </option>
                );
              })}
          </select>
        </div>

        <div className="col-span-1 sm:col-span-1">
          <p>
            Select State<label className="text-main">*</label>
          </p>
          <select
            className="bg-light px-4 py-2 rounded-md my-1 w-full"
            onChange={handleFilterChange}
            name="state"
            value={filterData.state}
            required
          >
            <option value={''} disabled>
              Select
            </option>
            {states.map((value) => {
              return <option value={value.name}>{value.name}</option>;
            })}
          </select>
        </div>

        <div className="col-span-1 sm:col-span-2">
          <p className="">
            Select the degree you wish to pursue
            <label className="text-main">*</label>
          </p>
          <select
            className="bg-light px-4 py-2 rounded-md my-1 w-full"
            name="degree"
            onChange={handleFilterChange}
            value={filterData.degree}
            required
          >
            <option value={''} disabled>
              Select
            </option>
            {degrees &&
              degrees.map((value) => {
                return (
                  <option value={value.name} key={value.id}>
                    {value.name}
                  </option>
                );
              })}
          </select>
        </div>

        <div className="col-span-1 sm:col-span-3 mt-2">
          <p className="">
            Select your preferred discipline/specialization
            <label className="text-main">*</label>
          </p>
          <select
            className="bg-light px-4 py-2 rounded-md my-1 w-full"
            name="discipline"
            onChange={handleFilterChange}
            value={filterData.discipline}
            required
          >
            <option value={''} disabled>
              Select
            </option>
            {disciplines &&
              disciplines.map((value) => {
                return (
                  <option value={value.name} key={value.id}>
                    {value.name}
                  </option>
                );
              })}
          </select>
        </div>

        <div className="col-span-1 sm:col-span-3 mt-2">
          <p className="pt-2">Select your preferred application cycle.</p>
          <p className="flex gap-2">
            Year:{' '}
            <div className="flex flex-col sm:flex-row">
              {year.map((value) => {
                return (
                  <div className="flex flex-row mr-3">
                    <input
                      type="radio"
                      name="year"
                      value={value}
                      onChange={handleFilterChange}
                      checked={filterData.year == value}
                      // radioGroup={year}
                    />
                    <label>{value}</label>
                  </div>
                );
              })}
            </div>
          </p>

          <p className="pt-2">
            Month:{' '}
            <select
              className="px-4 py-2 rounded-md bg-light"
              name="month"
              onChange={handleFilterChange}
              value={filterData.month}
            >
              <option value="" disabled>
                Select
              </option>
              {month.map((value) => {
                return <option value={value}>{value}</option>;
              })}
            </select>
          </p>
        </div>
      </div>
    );
  };

  const Step2 = () => {
    return (
      <div className="col-span-1 sm:col-span-3">
        <h1 className="pt-2">Have you taken any certifications?</h1>
        {/* <p className="text-sm  px-4">Specific to ?</p> */}
        <div className="flex flex-col">
          <div className="flex flex-row mr-3">
            <input
              type="radio"
              className="py-2"
              name="certification"
              value="Extra-curricular"
              onChange={handleFilterChange}
              checked={filterData.certification == 'Extra-curricular'}
            />
            <label className="px-2">Extra-curricular</label>
          </div>
          <div className="flex flex-row mr-3">
            <input
              type="radio"
              name="certification"
              onChange={handleFilterChange}
              value="Volunteering"
              checked={filterData.certification == 'Volunteering'}
            />
            <label className="px-2">Volunteering</label>
          </div>
          <div className="flex flex-row mr-3">
            <input
              type="radio"
              name="certification"
              value="Both"
              onChange={handleFilterChange}
              checked={filterData.certification == 'Both'}
            />
            <label className="px-2">Both</label>
          </div>
        </div>
      </div>
    );
  };

  const Step3 = () => {
    return (
      <div className="m-5 grid gap-4 grid-cols-1 sm:grid-cols-6 justify-center">
        <div className="col-span-1 sm:col-span-2">
          <p className="">Have you taken any aptitude tests?</p>
          <div className="flex flex-col">
            <div className="flex flex-row mr-3 gap-1">
              <input
                type="radio"
                name="aptitude"
                value="No,I'm planning to take"
                onChange={handleFilterChange}
                checked={filterData.aptitude == "No,I'm planning to take"}
              />
              <label>No,I'm planning to take</label>
            </div>
            <div className="flex flex-row mr-3 gap-1">
              <input
                type="radio"
                name="aptitude"
                value="SAT"
                onChange={handleFilterChange}
                checked={filterData.aptitude == 'SAT'}
              />
              <label>SAT</label>
            </div>
            <div className="flex flex-row mr-3 gap-1">
              <input
                type="radio"
                name="aptitude"
                value="ACT"
                onChange={handleFilterChange}
                checked={filterData.aptitude == 'ACT'}
              />
              <label>ACT</label>
            </div>
          </div>
        </div>
        <div className="col-span-1 sm:col-span-2">
          <p className="">Have you taken any English proficiency tests?</p>
          <div className="flex flex-col">
            <div className="flex flex-row mr-3 gap-1">
              <input
                type="radio"
                name="proficiency"
                value="No,I'm planning to take"
                onChange={handleFilterChange}
                checked={filterData.proficiency == "No,I'm planning to take"}
              />
              <label>No,I'm planning to take</label>
            </div>
            <div className="flex flex-row mr-3 gap-1">
              <input
                type="radio"
                name="proficiency"
                value="IELTS"
                onChange={handleFilterChange}
                checked={filterData.proficiency == 'IELTS'}
              />
              <label>IELTS</label>
            </div>
            <div className="flex flex-row mr-3 gap-1">
              <input
                type="radio"
                name="proficiency"
                value="Cambridge English"
                onChange={handleFilterChange}
                checked={filterData.proficiency == 'Cambridge English'}
              />
              <label>Cambridge English</label>
            </div>
            <div className="flex flex-row mr-3 gap-1">
              <input
                type="radio"
                name="proficiency"
                value="PTE"
                onChange={handleFilterChange}
                checked={filterData.proficiency == 'PTE'}
              />
              <label>PTE</label>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Step4 = () => {
    return (
      <div>
        {/* <p>
          2. Do you need the university program to be approved by Saudi Arabian
          Ministry of Education?
        </p>
        <div className="flex gap-2">
          <input type="radio" name="dubai" />
          <label>Yes</label>
          <input type="radio" name="dubai" />
          <label>No</label>
        </div>

        <p className="pt-2">3. University partnership type?</p>
        <div className="flex gap-2">
          <input
            type="radio"
            name="universityPartnered"
            value="Non-partnered"
            onChange={handleFilterChange}
          />
          <label>Non-partnered</label>
          <input
            type="radio"
            name="universityPartnered"
            value="Partnered"
            onChange={handleFilterChange}
          />
          <label>Partnered</label>
          <input
            type="radio"
            name="universityPartnered"
            onChange={handleFilterChange}
            value="all"
          />
          <label>All</label> */}
        {/* </div> */}
      </div>
    );
  };

  return (
    <>
      {!show && (
        <form>
          <p className="text-center py-2 font-bold text-lg">General Details</p>
          <Step1 />
          <p className="text-center py-2 font-bold text-lg">Academic Details</p>
          <div className="m-5 grid gap-4 grid-cols-1 sm:grid-cols-6">
            <div className="col-span-1 sm:col-span-3 mt-2">
              <p className="">Enter your High School Score</p>
              <input
                type="number"
                placeholder="your score"
                name="score"
                className="bg-light px-4 py-2 rounded-md my-2 w-full sm:w-2/3"
                value={filterData.score}
                onChange={(e) => {
                  setFilterData({
                    ...filterData,
                    score: e.target.value,
                  });
                }}
              />
            </div>
            <Step2 />
          </div>
          <p className="text-center py-2 font-bold text-lg">Test Details</p>
          <Step3 />
          <p className="text-center py-2 font-bold text-lg">Preferences</p>
          {/* <Step4 /> */}
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
                onChange={(e) => {
                  setFilterData({
                    ...filterData,
                    budget: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <br></br>
          <div className="m-5 grid gap-4 grid-cols-1 sm:grid-cols-8 hover:">
            <div className="col-span-1 sm:col-span-2 ">
              <button
                type="submit"
                className="bg-main text-white px-4 py-2 rounded-md my-3 w-full hover:bg-white hover:outline outline-main hover:text-main transition duration-200"
                onSubmit={() => {}}
                onClick={(e) => {
                  e.preventDefault();
                  // const allKeysHaveValues = Object.keys(filterData).every((key) => {
                  //   if (key == "country" || key == "degree" || key == "discipline" || key == "state") {
                  //     return (
                  //       filterData[key] !== "" &&
                  //       filterData[key] !== null &&
                  //       filterData[key] !== undefined
                  //     );
                  //   }
                  // });

                  const allKeys =
                    filterData.state != '' &&
                    filterData.degree != '' &&
                    filterData.discipline != '' &&
                    filterData.state != '';
                  if (allKeys) {
                    setShow(!show);
                    uploadFilterData(filterData);
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

      {show && <Universities props={filterData} />}
    </>
  );
};

export default RecommandationsMain;
