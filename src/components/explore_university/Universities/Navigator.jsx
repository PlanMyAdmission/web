import React, { useEffect } from 'react';
import { useState, useRef } from 'react';
import app from '../../../firebase';
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
import Course from './Course';

const Navigator = ({ props }) => {
  const db = getFirestore(app);
  const about = useRef(null);
  const stat = useRef(null);
  const course = useRef(null);
  const highlight = useRef(null);
  const info = useRef(null);
  const [univdata, setUnivData] = useState([]);
  const [courseslist, setCoursesList] = useState([]);
  const [uniquedis, setUniqueDis] = useState([]);
  const [selected, setSelected] = useState('');
  const [n, setN] = useState(1000);
  const [maplimit, setMapLimit] = useState(5);
  let i = 1;
  // const [male, setMale] = useState(0);
  // const [female, setFemale] = useState(0);
  const handleChange = (event) => {
    console.log(event.target.value);
    setSelected(event.target.value);
    setMapLimit(5);
  };
  useEffect(() => {
    setUnivData(props);
    // console.log(courses)
    setCoursesList([]);
    fetchCourses();
  }, [univdata]);

  const fetchCourses = async () => {
    // e.preventDefault();
    const slug = univdata.map((data) => {
      return data.slug;
    });
    const dataref = query(
      collection(db, 'university_info'),
      where('school_slug', 'in', slug),
      limit(n),
    );
    const docSnap = await getDocs(dataref);
    docSnap.forEach((doc) => {
      setCoursesList((prev) => {
        return [...prev, doc.data()];
      });
    });
  };

  useEffect(() => {
    console.log(courseslist);
    setUniqueDis([...new Set(courseslist.map((item) => item.discipline[0]))]);
    // setCoursesList(arr)
  }, [courseslist]);

  const data = [
    {
      id: 1,
      name: 'About',
      ref: about,
    },
    {
      id: 2,
      name: 'Stats',
      ref: stat,
    },
    {
      id: 3,
      name: 'Courses',
      ref: course,
    },
    {
      id: 4,
      name: 'Highlights',
      ref: highlight,
    },
    {
      id: 4,
      name: 'Additional Info',
      ref: info,
    },
  ];

  const style =
    'py-2 px-4 focus:bg-white focus:font-bold active:font-bold active:bg-white focus:outline-none outline-none mx-2 my-2 rounded-md transition-all duration-100 ease-in-out  ';
  return (
    <>
      <div className="max-w-5xl mx-auto bg-light rounded my-5 sticky top-1">
        <div className=" bg-light md:max-w-7xl md:mx-auto flex justify-between rounded-md text-1.5lr overflow-x-auto  hide-scroll-bar whitespace-nowrap snap-x my-10 ">
          {data &&
            data.map((topic) => {
              return (
                <span key={topic.id}>
                  <button
                    autoFocus={false}
                    className={style}
                    onClick={() => {
                      {
                        topic.ref.current.scrollIntoView();
                      }
                    }}
                  >
                    {topic.name}
                  </button>
                </span>
              );
            })}
        </div>
      </div>
      {univdata &&
        univdata.map((undata) => {
          return (
            <>
              <div
                ref={about}
                className="max-w-5xl mx-auto bg-transparent rounded my-5 ml-8"
              >
                <div className="flex flex-col jsutify-left">
                  <label className="text text-1.7lr font-bold">
                    <label className="underline underline-offset-8 decoration-main">
                      Abo
                    </label>
                    ut
                  </label>
                  <p className="text text-lr my-5">{undata?.description}</p>
                </div>
              </div>
              <div ref={stat} className="mt-5 ml-8 mb-8">
                <label className="text text-1.7lr font-bold">
                  <label className="underline underline-offset-8 decoration-main">
                    Sta
                  </label>
                  ts
                </label>
                <div className="flex flex-col sm:flex-row bg-light justify-between mt-8 mb-5 rounded-lg p-3">
                  <div className="w-full px-1 md:w-1/2 md:px-2 text text-2xs">
                    <div className="flex flex-row justify-between border-b-2 border-solid border-main my-3 p-1">
                      <label>Tuition Value</label>
                      <label>
                        {undata?.tuition_value} {undata?.tuition_currency}
                      </label>
                    </div>
                    <div className="flex flex-row justify-between border-b-2 border-solid border-main my-3 p-1">
                      <label>Aid Value</label>
                      <label>
                        {undata?.aid_value} {undata?.aid_currency}
                      </label>
                    </div>
                    <div className="flex flex-row justify-between border-b-2 border-solid border-main my-3 p-1">
                      <label>Stay on Campus Value</label>
                      <label>
                        {undata?.stay_on_campus_value}{' '}
                        {undata?.stay_on_campus_currency}
                      </label>
                    </div>
                    <div className="flex flex-row justify-between border-b-2 border-solid border-main my-3 p-1">
                      <label>Mandatory Value</label>
                      <label>
                        {undata?.mandatory_value} {undata?.mandatory_currency}
                      </label>
                    </div>
                  </div>
                  <div className="w-full px-1 md:w-1/2 md:px-2 text text-2xs">
                    <div className="flex flex-row justify-between border-b-2 border-solid border-main my-3 p-1">
                      <label>Average Salary</label>
                      <label>
                        {undata?.avg_salary_value} {undata?.avg_salary_currency}
                      </label>
                    </div>
                    <div className="flex flex-row justify-between border-b-2 border-solid border-main my-3 p-1">
                      <label>Books & Supplies Value</label>
                      <label>
                        {undata?.books_and_supplies_value}{' '}
                        {undata?.books_and_supplies_currency}
                      </label>
                    </div>
                    <div className="flex flex-row justify-between border-b-2 border-solid border-main my-3 p-1">
                      <label>Insurance Value</label>
                      <label>
                        {undata?.insurance_value} {undata?.insurance_currency}
                      </label>
                    </div>
                    <div className="flex flex-row justify-between border-b-2 border-solid border-main my-3 p-1">
                      <label>Personal Value</label>
                      <label>
                        {undata?.personal_value} {undata?.personal_currency}
                      </label>
                    </div>
                  </div>
                </div>
                <div className="bg-light px-3 py-2 rounded-lg w-full">
                  <label className="text text-2xs font-bold">
                    Student Gender Distribution
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-4 text text-2xs">
                    <div className="col-span-1 sm:col-span-1 border-b-2 sm:border-r-2 sm:border-b-0 border-solid border-main">
                      <div className="flex flex-col items-center my-3 px-8">
                        <label>Male</label>
                        <label className="text-main text-lr font-bold">
                          {undata.male_percent ? undata.male_percent : '-'}%
                        </label>
                      </div>
                    </div>
                    <div className="col-span-1 border-b-2 sm:border-r-2 sm:border-b-0 border-solid border-main">
                      <div className="flex flex-col items-center  my-3 px-8">
                        <label>Female</label>
                        <label className="text-main text-lr font-bold">
                          {undata.female_percent ? undata.female_percent : '-'}%
                        </label>
                      </div>
                    </div>
                    <div className="col-span-1 border-b-2 sm:border-r-2 sm:border-b-0 border-solid border-main">
                      <div className="flex flex-col items-center  my-3 px-8">
                        <label>Student</label>
                        <label className="text-main text-lr font-bold">
                          {
                            undata.student_faculty_ratio
                              .toString()
                              .split('.')[0]
                          }
                        </label>
                      </div>
                    </div>
                    <div className="col-span-1 border-b-2 sm:border-b-0 border-solid border-main">
                      <div className="flex flex-col items-center  my-3 px-8">
                        <label>Teacher</label>
                        <label className="text-main text-lr font-bold">
                          {
                            undata.student_faculty_ratio
                              .toString()
                              .split('.')[1]
                          }
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div ref={course} className="my-5 ml-8">
                <label className="text text-1.7lr font-bold mb-10">
                  <label className="underline underline-offset-8 decoration-main">
                    Cou
                  </label>
                  rses
                </label>
                <div className="flex flex-col items-center">
                  <div className="">
                    <select
                      id="year"
                      name="year"
                      autocomplete="year"
                      className="block bg-light self-auto justify-left p-1 pr-10 w-90% text text-2xs focus:outline-none mt-8 rounded-md"
                      onChange={handleChange}
                      value={selected}
                    >
                      <option value="">Discipline</option>
                      {uniquedis &&
                        uniquedis.map((dis) => {
                          return (
                            <option value={dis} key={dis}>
                              {dis}
                            </option>
                          );
                        })}
                    </select>
                    {courseslist.map((unvdata) => {
                      if (unvdata.discipline[0] === selected && i <= maplimit) {
                        i++;
                        return (
                          <Course
                            course={unvdata?.degree[0] + ' in ' + unvdata?.name}
                            state={unvdata?.state}
                            country={unvdata?.country}
                            degree={unvdata?.degree}
                            format={unvdata?.format}
                            about={unvdata?.description}
                            id={unvdata?.id}
                            discipline={unvdata?.discipline}
                            sub_discipline={unvdata?.sub_discipline}
                            sub_degree={unvdata?.sub_degree}
                            fee={
                              unvdata?.fees_value + ' ' + unvdata?.fees_currency
                            }
                            acceptance={unvdata?.acceptance_criteria}
                            docs={unvdata?.documents_required}
                            url={unvdata?.primary_url}
                          />
                        );
                      }
                    })}
                  </div>
                  <div className="">
                    <button
                      type="submit"
                      className="block text-white bg-main text-1.5lr p-3 text-lg mb-0 mt-5 items-center rounded-lg self-center"
                      onClick={() => {
                        setMapLimit(maplimit + 4);
                      }}
                    >
                      Show More
                    </button>
                  </div>
                </div>
              </div>
              <div className="my-8 ml-8">
                <div className="flex flex-col items-stretch sm:flex-row bg-transparent justify-between mt-8 mb-5 rounded-lg p-3">
                  <div
                    ref={highlight}
                    className="w-full px-1 md:w-1/2 md:px-2 text text-2xs"
                  >
                    <label className="text text-1.7lr font-bold mb-10">
                      <label className="underline underline-offset-8 decoration-main">
                        Hig
                      </label>
                      hlights
                    </label>
                    <div className="bg-light mt-5 p-2 rounded-md">
                      <p className="text text-xs">
                        Find miscellaneous information about students, campus
                        and faculty of {`${undata?.name}`} below.
                      </p>
                      <br></br>
                      <div className="w-full text text-2xs">
                        <div className="flex flex-row justify-between border-b-2 border-solid border-main my-3 p-1">
                          <label>Population</label>
                          <label>{undata?.population}</label>
                        </div>
                        <div className="flex flex-row justify-between border-b-2 border-solid border-main my-3 p-1">
                          <label>International Student Package</label>
                          <label>
                            {undata?.avg_salary_value}{' '}
                            {undata?.avg_salary_currency}
                          </label>
                        </div>
                        <div className="flex flex-row justify-between border-b-2 border-solid border-main my-3 p-1">
                          <label>Graduation Rate</label>
                          <label>{undata?.graduation_rate}%</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    ref={info}
                    className="w-full px-1 md:w-1/2 md:px-2 text text-2xs"
                  >
                    <label className="text text-1.7lr font-bold mb-10">
                      <label className="underline underline-offset-8 decoration-main">
                        Add
                      </label>
                      itional Info
                    </label>
                    <div className="bg-light mt-5 p-2 rounded-md">
                      <p className="text text-xs">{undata?.addr_line_1}</p>
                      <p className="text text-xs">{undata?.addr_city}</p>
                      <p className="text text-xs">
                        {undata?.addr_state}, {undata?.addr_country}
                      </p>
                      <div className="w-full text text-2xs">
                        <div className="flex flex-row justify-between border-b-2 border-solid border-main my-3 p-1">
                          <label>Email</label>
                          <label>{undata?.email}</label>
                        </div>
                        <div className="flex flex-row justify-between border-b-2 border-solid border-main my-3 p-1">
                          <label>Phone</label>
                          <label>{undata?.phone}</label>
                        </div>
                        <div className="flex flex-row justify-between border-b-2 border-solid border-main my-3 p-1">
                          <label>Website URL</label>
                          <label>
                            <a href={`${undata?.primary_url}`} target="_blank">
                              {undata?.primary_url}
                            </a>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
        })}
    </>
  );
};

export default Navigator;
