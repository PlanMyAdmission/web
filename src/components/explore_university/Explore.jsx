import React, { useEffect, useRef, useState } from "react";
import FilteredResponse from "./FilteredResponse";
import Options from "./Options";
import app from "../../firebase";
import { month } from "../dashboard/user/profile/data";
import algoliasearch from "algoliasearch/lite";
import Autosuggest from "react-autosuggest";
import { matchSorter } from "match-sorter";
import { Helmet } from "react-helmet";
import { useSearchParams, useLocation } from "react-router-dom";
import {
  getFirestore,
  collection,
  getDocs,
  query
} from "firebase/firestore";
import { toast } from "react-toastify";

const Explore = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("topic") ?? "";
  const [search, setSearch] = useState(initialQuery);
  const [show, setShow] = useState(false);
  const [valueChanged, setValueChanged] = useState(false);
  const db = getFirestore(app);
  const location = useLocation();
  const ref = useRef(null);

  const [filterData, setFilterData] = useState({
    course: initialQuery,
    intake: "",
    country: "",
    year: "",
    duration: -1,
    level: [],
  });

  useEffect(() => {
    if (location.state) {
      setFilterData(prev => ({ ...prev, course: location.state.search }));
      setShow(true);
      setValueChanged(true);
    }
  }, [location.state]);

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilterData({ ...filterData, [e.target.name]: value });
    setValueChanged(false);
  };

  const handleCheck = (event) => {
    const updatedList = event.target.checked
      ? [...filterData.level, event.target.value]
      : filterData.level.filter((value) => value !== event.target.value);
    setFilterData({ ...filterData, level: updatedList });
    setValueChanged(false);
  };

  const handleClick = () => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputClick = (value) => {
    setFilterData({ ...filterData, course: value });
    setValueChanged(false);
  };

  const Button = ({ text, showText }) => (
    <button
      className="border border-main py-1 px-3 text-sm rounded-full text-main hover:bg-main hover:text-white transition"
      onClick={showText}
    >
      {text}
    </button>
  );

  const [suggestions, setSuggestions] = useState([]);
  const searchClient = algoliasearch("8CPNZ7GSBE", "d5e280b4cfd33be419ebfd25c236e5e0");
  const index = searchClient.initIndex("explore");

  const getSuggestions = async (value) => {
    const { hits } = await index.search(value);
    const arr1 = hits.map((hit) => hit.Name);
    const arr2 = hits.map((hit) => hit.University);
    const combined = [...arr1, ...arr2];
    return matchSorter([...new Set(combined)], value, {
      threshold: matchSorter.rankings.WORD_STARTS_WITH,
    });
  };

  const onSuggestionsFetchRequested = async ({ value }) => {
    const results = await getSuggestions(value);
    setSuggestions(results.slice(0, 10));
  };

  const inputProps = {
    type: "search",
    placeholder: "Search Universities, Courses, and more...",
    value: filterData.course,
    onChange: (event, { newValue }) => {
      setFilterData({ ...filterData, course: newValue });
      setValueChanged(false);
    },
    className:
      "bg-white border border-main w-full p-3 pl-10 text-sm rounded-md focus:outline-none",
  };

  return (
    <>
      <Helmet>
        <title>Explore best university of your choice with Planmyadmission</title>
        <meta
          name="description"
          content="Explore universities worldwide. Navigate through opportunities and find your perfect academic match."
        />
      </Helmet>

      <div className="max-w-6xl mx-auto bg-light p-6 md:p-10 rounded-lg shadow my-5">
        <form>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="col-span-2">
              <label className="block mb-2 font-semibold text-main">Search Course</label>
              <div className="relative">
                <Autosuggest
                  suggestions={suggestions}
                  onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                  onSuggestionsClearRequested={() => setSuggestions([])}
                  getSuggestionValue={(suggestion) => suggestion}
                  onSuggestionSelected={(event, { suggestion }) => setFilterData({ ...filterData, course: suggestion })}
                  renderSuggestion={(suggestion) => (
                    <div className="bg-white text-main p-2 border-b cursor-pointer">
                      {suggestion}
                    </div>
                  )}
                  inputProps={inputProps}
                />
              </div>
            </div>

            {[
  "intake", "country", "year", "duration"
].map((field, idx) => (
  <div key={field} className="relative">
    <label className="block mb-2 font-semibold text-main">
      {field.charAt(0).toUpperCase() + field.slice(1).replace("duration", "Duration (Months)").replace("year", "Year").replace("country", "Country").replace("intake", "Intake")}
    </label>
    <div className="relative">
      <select
        name={field}
        value={filterData[field]}
        onChange={handleFilterChange}
        className="w-full p-3 pr-10 border border-main rounded-md bg-white "
      >
        {field === "intake" && <option value="">Select All</option>}
        {field === "country" && <option value="">Select</option>}
        {field === "year" && (
          <>
            <option value="">Select</option>
            <option>2023</option>
            <option>2024</option>
            <option>2025</option>
          </>
        )}
        {field === "duration" && (
          <>
            <option value={-1}>Select</option>
            {[...new Set([0, 1, 2, 3, 4, 5, 6, 12, 24, 36, 48, 60, 72, 96, 108])].map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </>
        )}
        {field === "intake" &&
          month.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        {field === "country" &&
          [
            "United States of America",
            "Australia",
            "United Kingdom",
            "Singapore",
            "Canada",
            "Sweden",
            "Denmark",
            "Italy",
            "France",
            "New Zealand",
            "Finland",
            "Ireland",
            "Netherlands",
            "Germany",
            "Dubai",
            "Austria"
          ].map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
      </select>
    </div>
  </div>
))}



            <div className="flex items-end gap-2">
              <button
                className="bg-main text-white py-2 px-4 rounded hover:bg-dark-blue"
                onClick={(e) => {
                  e.preventDefault();
                  handleClick();
                  setValueChanged(true);

                  const allEmpty = Object.values(filterData).every(
                    (v) => v === "" || v === -1 || (Array.isArray(v) && v.length === 0)
                  );

                  if (allEmpty) {
                    toast.error("Please fill at least 1 filter", { autoClose: 1500 });
                    setShow(false);
                  } else {
                    setShow(true);
                  }
                }}
              >
                Explore
              </button>

              <button
                className="border border-main text-main py-2 px-4 rounded hover:bg-main hover:text-white"
                onClick={(e) => {
                  e.preventDefault();
                  setFilterData({ course: "", intake: "", country: "", year: "", duration: -1, level: [] });
                  setValueChanged(false);
                  setShow(false);
                }}
              >
                Reset
              </button>
            </div>
          </div>

          <div className="mt-8">
            <label className="block mb-2 font-semibold text-main">Program Level</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {["Postgraduate", "Undergraduate", "Twinning Programmes (PG)", "Twinning Programmes (UG)", "Foundation", "High School (11th-12th)", "PG Diploma /Certificate", "UG+PG (Accelerated) Degree", "Short Term Programs", "PhD", "Summer Programs", "UG Diploma /Certificate /Associate Degree"].map((label) => (
                <label key={label} className="inline-flex items-center gap-2 align-middle">
                  <input
                    type="checkbox"
                    className="align-middle"
                    value={label}
                    checked={filterData.level.includes(label)}
                    onChange={handleCheck}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
        </form>

        <div className="mt-8">
          <p className="mb-2 font-semibold">Other Popular Searches</p>
          <div className="flex flex-wrap gap-2">
            <Button text="University of Newcastle" showText={() => handleInputClick("University of Newcastle")} />
            <Button text="MBA" showText={() => handleInputClick("MBA")} />
            <Button text="Mechanical Engineering" showText={() => handleInputClick("Mechanical Engineering")} />
            <Button text="Data Analysis" showText={() => handleInputClick("Data Analysis")} />
          </div>
        </div>
      </div>

      <div ref={ref}></div>
      {show && valueChanged && <FilteredResponse props={filterData} trigger={0} />}
    </>
  );
};

export default Explore;
