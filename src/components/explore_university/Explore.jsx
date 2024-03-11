import React, { useEffect, useRef } from "react";
import FilteredResponse from "./FilteredResponse";
import { useState } from "react";
import Options from "./Options";
import app from "../../firebase";
import { month } from "../dashboard/user/profile/data"
import algoliasearch from 'algoliasearch/lite';
import Autosuggest from 'react-autosuggest';
import { matchSorter } from "match-sorter";
import { Helmet } from "react-helmet";
import {
  Firestore,
  getFirestore,
  doc,
  collection,
  onSnapshot,
  getDocs,
  limit,
  query,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { Shuffle } from "@mui/icons-material";

const countries = ['United States of America', 'Australia', 'United Kingdom', 'Singapore',
  'Canada', 'Sweden', 'Denmark', 'Italy', 'France', 'New Zealand', 'Finland',
  'Ireland', 'Netherlands', 'Germany', 'Dubai', 'Austria']

const duration = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
  12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
  24, 25, 27, 28, 30, 31, 32, 33, 34, 36, 37, 40,
  42, 44, 48, 52, 54, 55, 57, 60, 64, 65, 66, 67,
  72, 78, 79, 84, 96, 108
]

const Explore = () => {
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);
  const [alldocs, setAlldocs] = useState([]);
  const [valueChanged, setValueChanged] = useState(false)
  const db = getFirestore(app);
  const [globalState, setGlobalSate] = useState(false)
  // const [countries, setCountries] = useState([])
  const { state } = useLocation()
  const ref = useRef(null)
  const [filterData, setFilterData] = useState({
    course: "",
    intake: "",
    country: "",
    year: "",
    duration: -1,
    level: [],
    // aptitude: "",
    // proficiency: "",
    // state: "",
    // // universityPartnered: "",
    // budget: "",
  });
  const handleFilterChange = (e) => {
    // e.preventDefault();
    const value = e.target.value
    setFilterData({
      ...filterData,
      [e.target.name]: value
    })
    setValueChanged(false)
  };

  // const fetchCountries = async () => {
  //   // e.preventDefault();
  //   const dataref = query(collection(db, "countries_state"));
  //   const docSnap = await getDocs(dataref);
  //   docSnap.forEach(doc => {
  //     setCountries((prev) => {
  //       return [...prev, doc.data()]
  //     })
  //   })
  // }

  // Add/Remove checked item from list
  const handleCheck = (event) => {
    var updatedList = [...filterData.level];
    if (event.target.checked) {
      updatedList = [...filterData.level, event.target.value];
      console.log(updatedList)
    } else {
      updatedList = updatedList.filter((value) => {
        return value !== event.target.value
      })
      console.log(updatedList)
    }
    setFilterData({
      ...filterData,
      level: updatedList
    });
    setValueChanged(false)
  };

  useEffect(() => {
    if (state) {
      setFilterData({
        ...filterData,
        course: state.search
      });
      setGlobalSate(true)
      setShow(true)
      setValueChanged(true)
    }

    // setCountries([])
    // fetchCountries()
  }, [])

  useEffect(() => {
    console.log(filterData)
  }, [filterData])

  const handleClick = () => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };
  // const [updated, setUpdated] = useState();

  const handleInputClick = (value) => {
    console.log(value)
    setFilterData({
      ...filterData,
      course: value
    })
    setValueChanged(false)
  }

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

  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };


  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const searchClient = algoliasearch('8CPNZ7GSBE', 'd5e280b4cfd33be419ebfd25c236e5e0');
  const index = searchClient.initIndex('explore');

  const getSuggestions = async value => {
    const { hits } = await index.search(value);
    let arr2 = hits.map(hit => hit.Name)
    // arr2.concat(await support(value))
    // console.log(arr2)
    return arr2.map(item => item).filter((value, index, self) => self.indexOf(value) === index)

  };
  const support = async value => {
    const { hits } = await index.search(value);
    let arr = hits.map(hit => hit.University)
    return arr.map(item => item).filter((value, index, self) => self.indexOf(value) === index)
  }

  const onSuggestionsFetchRequested = async ({ value }) => {
    // let su1 = []
    const suggestions = await getSuggestions(value);
    const sugg2 = await support(value)
    // su1 = suggestions
    // const subArr = suggestions.filter(str => str.toLowerCase().includes(value.toLowerCase()));
    // if (Array.isArray(subArr) && subArr.length > 0) {
    //   setSuggestions(suggestions)
    // }
    // else {
    //   setSuggestions(sugg2)
    // }
    return setSuggestions(matchSorter(suggestions.splice(0, 8).concat(sugg2.splice(0, 8)), value, { threshold: matchSorter.rankings.WORD_STARTS_WITH, keepDiacritics: true }));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onSuggestionSelected = (event, { suggestion }) => {
    setFilterData({
      ...filterData,
      course: suggestion
    })
  };

  const inputProps = {
    type: "search",
    placeholder: 'Search',
    value: filterData.course,
    onChange: (event, { newValue }) => {
      setFilterData({
        ...filterData,
        course: newValue
      })
      setValueChanged(false)
    },
    className: "inline bg-transparent w-full p-3 pl-11 text-sm ring-main ring-offset-1 ring-1 focus:outline-none placeholder:text-[11px] md:placeholder:text-[14px]",
    placeholder: "Search Universites,Courses and more..."
  };

  const containerProps = {
    className: "absolute w-full"
  }



  return (
    <>
      {/* <Options /> */}
      <Helmet>
        <title>Explore best university of your choice with Planmyadmission</title>
        <meta name="title" content="Explore best university of your choice with Planmyadmission" />
        <meta name="description" content="Explore universities worldwide on our platform. Navigate through a sea of opportunities and find your perfect academic haven with simplicity and ease." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="Explore best university of your choice with Planmyadmission" />
        <meta property="og:description" content="Explore universities worldwide on our platform. Navigate through a sea of opportunities and find your perfect academic haven with simplicity and ease." />
        <meta property="og:image" content="https://planmyadmission.com" />
        <meta property="og:url" content="https://planmyadmission.com/explore" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Explore best university of your choice with Planmyadmission" />
        <meta name="twitter:description" content="Explore universities worldwide on our platform. Navigate through a sea of opportunities and find your perfect academic haven with simplicity and ease." />
      </Helmet>


      <div className="max-w-6xl mx-auto bg-light px-5 py-10 rounded my-5">
        <form >
          <div className="grid md:grid-cols-10 gap-6 sm:grid-cols-6 mb-8">
            <div className="col-span-4 sm:col-span-4">
              <label for="search" className="block pb-3 text-main font-bold">Search Course</label>
              <div className="relative">
                <div className="flex absolute inset-y-5 left-0 items-center pl-3 pointer-events-none">
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5 text-main"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
              </div>
              {/* <input
                type="search"
                name="course"
                className="inline bg-transparent w-full p-3 pl-11 text-sm ring-main ring-offset-1 ring-1 focus:outline-none placeholder:text-[11px] md:placeholder:text-[14px]"
                placeholder="Search Universites,Courses and more..."
                value={filterData.course}
                onChange={e => {
                  setFilterData({
                    ...filterData,
                    course: e.target.value
                  })
                  setValueChanged(false)
                }} */}
              {/* /> */}
              <div className="relative">
                <Autosuggest
                  suggestions={suggestions}
                  onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                  onSuggestionsClearRequested={onSuggestionsClearRequested}
                  onSuggestionSelected={onSuggestionSelected}
                  getSuggestionValue={suggestion => suggestion}
                  containerProps={containerProps}
                  renderSuggestion={suggestion => <div className=" w-full list-none text-main text-sm bg-white divide-y divide-solid border p-1 rounded cursor-pointer">{suggestion}</div>}

                  inputProps={inputProps}
                />
              </div>
            </div>
            <div className="col-span-2 sm:col-span-2">
              <label for="search" className="block pb-3 mt-11 sm:mt-0 text-main font-bold">Intake</label>
              <select
                id="intake"
                name="intake"
                autocomplete="intake"
                className="inline-block bg-transparent w-full p-3 pr-5 text-sm ring-main ring-offset-1 ring-1 focus:outline-none"
                onChange={handleFilterChange}
                value={filterData.intake}
              >
                <option value="" >Select All</option>
                {month && month.map((value) => {
                  return <option value={value}>{value}</option>;
                })}
              </select>
            </div>

            <div className="col-span-3 sm:col-span-2">
              <label for="search" className="block pb-3 text-main font-bold">Country</label>
              <select
                id="country"
                name="country"
                className="inline-block bg-transparent w-full p-3 pr-5 text-sm ring-main ring-offset-1 ring-1 focus:outline-none"
                onChange={(e) => {
                  handleFilterChange(e)
                }}
                value={filterData.country}
              >
                <option value={""} disabled >Select</option>
                {countries && countries.sort().map((value) => {
                  return <option value={value} key={value}>{value}</option>;
                })}
              </select>
            </div>
            <div className="visible sm:invisible col-span-3 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-2 items-center justify-around flex-wrap">
              <button
                type="submit"
                className="col-span-1 sm:col-span-1 text-white text-2xs w-1/2 uppercase px-4 py-2 mt-0 bg-main sm:mt-10"
                onClick={(e) => {
                  handleClick()
                  e.preventDefault()
                  setValueChanged(true)
                  const allKeysDontHaveValues = Object.keys(filterData).every((key) => {
                    return (
                      (filterData[key] == "" ||
                        filterData[key] == null ||
                        filterData[key] == undefined ||
                        filterData[key] == [] ||
                        filterData[key] == -1) && filterData.duration != 0
                    );
                  });

                  console.log(allKeysDontHaveValues)
                  console.log(filterData.duration)
                  console.log(globalState)

                  if (allKeysDontHaveValues) {

                    toast.error("Please fill at least 1 filter", {
                      className: "foo-bar",
                      autoClose: 1500
                    })
                    setGlobalSate(false)
                  }
                  else if (!allKeysDontHaveValues && !globalState) {
                    setShow(true)
                    setGlobalSate(true)
                    // ref.current?.scrollIntoView({ behavior: 'smooth' });


                  }
                  else {
                    setGlobalSate(true)
                    setShow(true)
                    // ref.current?.scrollIntoView({ behavior: 'smooth' });
                    // handleClick()

                  }

                }}
              >
                Explore
              </button>
              <button
                type="submit"
                className="col-span-1 sm:col-span-1 text-2xs text-white w-1/2 uppercase px-4 py-2 mt-0 bg-main sm:mt-10"
                onClick={(e) => {
                  e.preventDefault()
                  setFilterData({
                    course: "",
                    intake: "",
                    country: "",
                    year: "",
                    duration: -1,
                    level: [],
                  })
                  setValueChanged(false)
                  setGlobalSate(false)
                  setShow(false)

                }}
              >
                Reset
              </button>
            </div>

          </div>
          <div className="grid md:grid-cols-10 gap-6 sm:grid-cols-6 md:grid-cols-8">

            <div className="col-span-2 sm:col-span-2">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-1">
                <div className="mb-2">
                  <label className="text block mb-1">Year</label>
                  <select
                    id="year"
                    name="year"
                    autocomplete="year"
                    className="inline-block bg-transparent w-full pr-20 text-sm ring-main ring-offset-1 ring-1 focus:outline-none"
                    onChange={handleFilterChange}
                    value={filterData.year}
                  >
                    <option value="">Select</option>
                    <option>2023</option>
                    <option>2024</option>
                    <option>2025</option>
                  </select>
                </div>

                {/* <div className="mb-2">
                  <label className="text block mb-1">Duration</label>
                  <select
                    id="year"
                    name="year"
                    autocomplete="year"
                    className="inline-block bg-transparent w-full pr-20 text-sm ring-main ring-offset-1 ring-1 focus:outline-none"
                    onChange={() => { }}
                    defaultValue={""}
                  >
                    <option value="">Select</option>
                    <option>India</option>
                    <option>India</option>
                    <option>India</option>
                  </select>
                </div> */}

                {/* <div className="mb-2">
                  <label className="text block mb-1">Disclipine Area</label>
                  <select
                    id="year"
                    name="year"
                    autocomplete="year"
                    className="inline-block bg-transparent w-full pr-20 text-sm ring-main ring-offset-1 ring-1 focus:outline-none"
                    onChange={() => { }}
                    defaultValue={""}
                  >
                    <option value="">Select</option>
                    <option>India</option>
                    <option>India</option>
                    <option>India</option>
                  </select>
                </div>*/}
              </div>

            </div>

            <div className="col-span-2 sm:col-span-2">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-1">
                <div className="mb-2">
                  <label className="text block mb-1">Duration (in Months)</label>
                  <select
                    id="duration"
                    name="duration"
                    className="inline-block bg-transparent w-full pr-20 text-sm ring-main ring-offset-1 ring-1 focus:outline-none"
                    onChange={(e) => {
                      // const value = 
                      setFilterData({
                        ...filterData,
                        [e.target.name]: Math.floor(e.target.value)
                      })
                      setValueChanged(false)
                    }}
                    value={filterData.duration}
                  >
                    <option value={-1} disabled >Select</option>
                    {duration && duration.map((value) => {
                      return <option value={value} key={value}>{value}</option>;
                    })}
                  </select>
                </div>

                {/* <div className="mb-2">
                  <label className="text block mb-1">ESL/ELP Available</label>
                  <select
                    id="year"
                    name="year"
                    autocomplete="year"
                    className="inline-block bg-transparent w-full pr-20 text-sm ring-main ring-offset-1 ring-1 focus:outline-none"
                    onChange={() => { }}
                    defaultValue={""}
                  >
                    <option value="">Select</option>
                    <option>India</option>
                    <option>India</option>
                    <option>India</option>
                  </select>
                </div> */}
              </div>
            </div>
            <div className="hidden col-span-2 sm:col-span-1 flex flex-row items-center justify-around flex-wrap md:flex-nowrap sm:inline-block">
              <button
                type="submit"
                className="inline-block text-white w-full uppercase px-4 py-2 bg-main my-4 hover:outline hover:text-main hover:bg-white duration-200"
                onClick={(e) => {
                  handleClick()
                  e.preventDefault()
                  setValueChanged(true)
                  const allKeysDontHaveValues = Object.keys(filterData).every((key) => {
                    return (
                      (filterData[key] == "" ||
                        filterData[key] == null ||
                        filterData[key] == undefined ||
                        filterData[key] == [] ||
                        filterData[key] == -1) && filterData.duration != 0
                    );
                  });

                  console.log(allKeysDontHaveValues)
                  console.log(filterData.duration)
                  console.log(globalState)

                  if (allKeysDontHaveValues) {

                    toast.error("Please fill at least 1 filter", {
                      className: "foo-bar",
                      autoClose: 1500
                    })
                    setGlobalSate(false)
                  }
                  else if (!allKeysDontHaveValues && !globalState) {
                    setShow(true)
                    setGlobalSate(true)
                    // ref.current?.scrollIntoView({ behavior: 'smooth' });


                  }
                  else {
                    setGlobalSate(true)
                    setShow(true)
                    // ref.current?.scrollIntoView({ behavior: 'smooth' });
                    // handleClick()

                  }

                }}
              >
                Explore
              </button>
            </div>
            <div className="invisible col-span-2 sm:col-span-1 flex flex-row items-center justify-around flex-wrap md:flex-nowrap sm:visible">
              <button
                type="submit"
                className="inline-block text-white w-full uppercase px-4 py-2 my-4 bg-main hover:outline hover:text-main hover:bg-white duration-200"
                onClick={(e) => {
                  e.preventDefault()
                  setFilterData({
                    course: "",
                    intake: "",
                    country: "",
                    year: "",
                    duration: -1,
                    level: [],
                  })
                  setValueChanged(false)
                  setGlobalSate(false)
                  setShow(false)

                }}
              >
                Reset
              </button>
            </div>

            <div className="col-span-2 sm:col-span-6">
              <label className="text block mb-3">Program Level</label>
              <div className="grid grid-cols-2  sm:grid-cols-3 text-sm">
                <div className="p-1">
                  <input type="checkbox"
                    value="Postgraduate"
                    name="level"
                    onChange={handleCheck}
                  // checked={Array.isArray(filterData.level) ? filterData.level.includes("PG Diploma") : false} 
                  />
                  <label className="pl-1">PG</label>
                </div>

                <div className="p-1">
                  <input type="checkbox"
                    value="Undergraduate"
                    name="level"
                    onChange={handleCheck}
                  // checked={Array.isArray(filterData.level) ? filterData.level.includes("UG") : false}
                  />
                  <label className="pl-1">UG</label>
                </div>


                <div className="p-1">
                  <input type="checkbox"
                    value="Twinning Programmes (PG)"
                    name="level"
                    onChange={handleCheck}
                  // checked={Array.isArray(filterData.level) ? filterData.level.includes("Twinning Programme (UG)") : false}
                  />
                  <label className="pl-1">Twinning Programmes (PG)</label>
                </div>
                <div className="p-1">
                  <input type="checkbox"
                    value="Twinning Programmes (UG)"
                    name="level"
                    onChange={handleCheck}
                  // checked={Array.isArray(filterData.level) ? filterData.level.includes("Twinning Programme (UG)") : false}
                  />
                  <label className="pl-1">Twinning Programmes (UG)</label>
                </div>
                <div className="p-1">
                  <input type="checkbox"
                    value="Foundation"
                    name="level"
                    onChange={handleCheck}
                  // checked={Array.isArray(filterData.level) ? filterData.level.includes("Twinning Programme (UG)") : false}
                  />
                  <label className="pl-1">Foundation</label>
                </div>
                <div className="p-1">
                  <input type="checkbox"
                    value="High School (11th-12th)"
                    name="level"
                    onChange={handleCheck}
                  // checked={Array.isArray(filterData.level) ? filterData.level.includes("Twinning Programme (UG)") : false}
                  />
                  <label className="pl-1">High School (11th-12th)</label>
                </div>
                <div className="p-1">
                  <input type="checkbox"
                    value="PG Diploma /Certificate"
                    name="level"
                    onChange={handleCheck}
                  // checked={Array.isArray(filterData.level) ? filterData.level.includes("Twinning Programme (UG)") : false}
                  />
                  <label className="pl-1">PG Diploma/ Certificate</label>
                </div>
                <div className="p-1">
                  <input type="checkbox"
                    value="UG+PG (Accelerated) Degree"
                    name="level"
                    onChange={handleCheck}
                  // checked={Array.isArray(filterData.level) ? filterData.level.includes("Twinning Programme (UG)") : false}
                  />
                  <label className="pl-1">UG+PG (Accelerated) Degree</label>
                </div>
                <div className="p-1">
                  <input type="checkbox"
                    value="Short Term Programs"
                    name="level"
                    onChange={handleCheck}
                  // checked={Array.isArray(filterData.level) ? filterData.level.includes("Twinning Programme (UG)") : false}
                  />
                  <label className="pl-1">Short Term Programs(STP)</label>
                </div>
                <div className="p-1">
                  <input type="checkbox"
                    value="PhD"
                    name="level"
                    onChange={handleCheck}
                  // checked={Array.isArray(filterData.level) ? filterData.level.includes("Twinning Programme (UG)") : false}
                  />
                  <label className="pl-1">PhD</label>
                </div>
                <div className="p-1">
                  <input type="checkbox"
                    value="Summer Programs"
                    name="level"
                    onChange={handleCheck}
                  // checked={Array.isArray(filterData.level) ? filterData.level.includes("Twinning Programme (UG)") : false}
                  />
                  <label className="pl-1">Summer Programs</label>
                </div>
                <div className="p-1">
                  <input type="checkbox"
                    value="UG Diploma /Certificate /Associate Degree"
                    name="level"
                    onChange={handleCheck}
                  // checked={Array.isArray(filterData.level) ? filterData.level.includes("Foundation") : false}
                  />
                  <label className="pl-1">UG Diploma/ Certificate/ Associate Degree</label>
                </div>
              </div>


            </div>

            {/* <div className="col-span-2 sm:col-span-2">
              <label className="text block mb-3">Requirements</label>
              <div className="grid grid-cols-2 sm:grid-cols-1 text-sm">
                <div className="p-1">
                  <input type="checkbox" />
                  <label className="pl-1">PG Diploma</label>
                </div>

                <div className="p-1">
                  <input type="checkbox" />
                  <label className="pl-1">UG</label>
                </div>

                <div className="p-1">
                  <input type="checkbox" />
                  <label className="pl-1">Foundation</label>
                </div>

                <div className="p-1">
                  <input type="checkbox" />
                  <label className="pl-1">Twinning Programmes (UG) </label>
                </div>
                <div className="p-1">
                  <input type="checkbox" />
                  <label className="pl-1">PG Diploma</label>
                </div>

                <div className="p-1">
                  <input type="checkbox" />
                  <label className="pl-1">UG</label>
                </div>

                <div className="p-1">
                  <input type="checkbox" />
                  <label className="pl-1">Foundation</label>
                </div>

                <div className="p-1">
                  <input type="checkbox" />
                  <label className="pl-1">Twinning Programmes (UG) </label>
                </div>
              </div>
            </div> */}



            {/* <div className="grid grid-cols-1 sm:grid-cols-1 text-sm">
              <div className="p-1">
                <input type="checkbox" />
                <label className="pl-1">PG Diploma</label>
              </div>

              <div className="p-1">
                <input type="checkbox" />
                <label className="pl-1">UG</label>
              </div>

              <div className="p-1">
                <input type="checkbox" />
                <label className="pl-1">Foundation</label>
              </div>

              <div className="p-1">
                <input type="checkbox" />
                <label className="pl-1">Twinning Programmes (UG) </label>
              </div>
            </div> */}
          </div>

        </form >
        {/* <div className="mt-5">
          <p>Other poplular searches</p>
          <button
            type="submit"
            value={"Computer Science"}
            className="border border-main md:py-2 px-4 m-1 rounded-full hover:bg-white md:text-[14px] text-main text-[10px] py-1"
            onClick={handleInputClick}>
            ComputerScience
          </button>
          <button className="border border-main md:py-2 px-4 m-1 rounded-full hover:bg-light md:text-[14px] text-main text-[10px] py-1"
            onClick={(e) => {
              e.preventDefault()
              handleInputClick("Science")
            }}>
            Science
          </button>
          <button className="border border-main md:py-2 px-4 m-1 rounded-full hover:bg-light md:text-[14px] text-main text-[10px] py-1"
            onClick={(e) => {
              e.preventDefault()
              handleInputClick("MBA")
            }}>
            MBA
          </button>
          <button className="border border-main md:py-2 px-4 m-1 rounded-full hover:bg-light md:text-[14px] text-main text-[10px] py-1"
            onClick={(e) => {
              e.preventDefault()
              handleInputClick("PhD")
            }}>
            PHD
          </button>
        </div> */}

        <div className="w-full mt-5">
          <p>Other poplular searches</p>
          <Button
            text="University of Newcastle"
            showText={() => handleInputClick("University of Newcastle")}
          />
          <Button text="MBA" showText={() => handleInputClick("MBA")} />
          <Button
            text="Mechanical Engineering "
            showText={() => handleInputClick("Mechanical Engineering ")}
          />
          <Button
            text="Data Analysis"
            showText={() => handleInputClick("Data Analysis")}
          />
          {/* <Button text="Boston" showText={() => handleInputClick("Boston")} />
          <Button text="Toronto" showText={() => handleInputClick("Toronto")} />
          <Button text="New York" showText={() => handleInputClick("MBA")} />
          <Button
            text="University of Texas Dallas"
            showText={() => handleInputClick("University of Texas Dallas")}
          />
          <Button
            text="University of Toronto"
            showText={() => handleInputClick("University of Toronto")}
          />
          <Button text="MIT" showText={() => handleInputClick("MIT")} /> */}
        </div>
      </div >

      <div ref={ref}></div>

      {(show && globalState && valueChanged ? <FilteredResponse props={filterData} trigger={0} /> : "")}
    </>
  );
};

export default Explore;
