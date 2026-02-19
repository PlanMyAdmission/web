'use client';

import Image from 'next/image';

import React, { useCallback, useEffect, useState } from 'react';
import app from '@lib/firebase.js';
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
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { setRouteState, ROUTE_STATE_KEYS } from '@/lib/routeState.js';
const FilteredResponse = ({ props }) => {
  const [docs, setDocs] = useState([]);
  const db = getFirestore(app);
  const storage = getStorage();
  const [uniqueDocs, setUniqueDocs] = useState([]);
  const [n, setN] = useState(10);
  const [uniqueUniv, setUniqueUniv] = useState();
  const [country, setCountries] = useState();
  const [selectedCnt, setSelectedCnt] = useState();
  const [showElement, setShowElement] = useState(true);
  const [imgAv, setImgAv] = useState(false);
  const [imageObj, setImageObj] = useState([
    {
      id: '',
      url: '',
    },
  ]);
  const [mapDocs, setMapDocs] = useState();
  const [sortClicked, setSortClicked] = useState(false);
  const docref = collection(db, 'explore_university');
  const router = useRouter();
  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  const fetchDocs = useCallback(async () => {
    var intk = props.intake.substr(0, 3);
    let I = [];
    let C = [];
    let U = [];
    let L = [];
    let D = [];
    let Course = [];
    let DC = [];
    let DL = [];
    let DI = [];
    let CI = [];
    let CL = [];
    let LI = [];
    let ICD = [];
    let IDL = [];
    let CDL = [];
    let ICL = [];
    let ICDL = [];
    const intakeref = query(
      docref,
      where('Intakes', '>=', intk != '' ? intk : 'abcdefghijklmonpqrstuvwxyz'),
      where('Intakes', '<', intk != '' ? intk + 'z' : ''),
      limit(100),
    );
    const countryref = query(
      docref,
      where('Country', '==', props.country),
      limit(100),
    );
    const courseref = query(
      docref,
      where('Name', '>=', props.course),
      where('Name', '<', props.course + 'z'),
      where('Name', '==', props.course),
      limit(100),
    );
    const univref = query(
      docref,
      where(
        'University',
        '>=',
        props.course != '' ? props.course : 'abcdefghijklmnopqrstuvwxyz',
      ),
      where('University', '<', props.course != '' ? props.course + 'z' : ''),
      limit(100),
    );
    const levelref = query(
      docref,
      where(
        'Studylvl',
        'in',
        props.level.length > 0 ? props.level : ['random value'],
      ),
      limit(100),
    );
    const durationref = query(
      docref,
      where('Duration', '==', props.duration),
      limit(100),
    );
    const durationCntref = query(
      docref,
      where('Duration', '==', props.duration),
      where('Country', '==', props.country),
      limit(100),
    );
    const durationLevelref = query(
      docref,
      where('Duration', '==', props.duration),
      where(
        'Studylvl',
        'in',
        props.level.length > 0 ? props.level : ['random value'],
      ),
      limit(100),
    );
    const durationIntakeref = query(
      docref,
      where('Intakes', '>=', intk != '' ? intk : 'abcdefghijklmonpqrstuvwxyz'),
      where('Intakes', '<', intk != '' ? intk + 'z' : ''),
      where('Duration', '==', props.duration),
      limit(100),
    );
    const cntIntakeref = query(
      docref,
      where('Intakes', '>=', intk != '' ? intk : 'abcdefghijklmonpqrstuvwxyz'),
      where('Intakes', '<', intk != '' ? intk + 'z' : ''),
      where('Country', '==', props.country),
      limit(100),
    );
    const cntLevelref = query(
      docref,
      where(
        'Studylvl',
        'in',
        props.level.length > 0 ? props.level : ['random value'],
      ),
      where('Country', '==', props.country),
      limit(100),
    );
    const levelIntakeref = query(
      docref,
      where(
        'Studylvl',
        'in',
        props.level.length > 0 ? props.level : ['random value'],
      ),
      where('Country', '==', props.country),
      where('Intakes', '>=', intk != '' ? intk : 'abcdefghijklmonpqrstuvwxyz'),
      where('Intakes', '<', intk != '' ? intk + 'z' : ''),
      limit(100),
    );
    const intakeCntDurationref = query(
      docref,
      where('Intakes', '>=', intk != '' ? intk : 'abcdefghijklmonpqrstuvwxyz'),
      where('Intakes', '<', intk != '' ? intk + 'z' : ''),
      where('Country', '==', props.country),
      where('Duration', '==', props.duration),
      limit(100),
    );
    const inatakeDurationLevelref = query(
      docref,
      where('Intakes', '>=', intk != '' ? intk : 'abcdefghijklmonpqrstuvwxyz'),
      where('Intakes', '<', intk != '' ? intk + 'z' : ''),
      where(
        'Studylvl',
        'in',
        props.level.length > 0 ? props.level : ['random value'],
      ),
      where('Duration', '==', props.duration),
      limit(100),
    );
    const cntDurationLevelref = query(
      docref,
      where(
        'Studylvl',
        'in',
        props.level.length > 0 ? props.level : ['random value'],
      ),
      where('Country', '==', props.country),
      where('Duration', '==', props.duration),
      limit(100),
    );
    const inatakeCountryLevelref = query(
      docref,
      where(
        'Studylvl',
        'in',
        props.level.length > 0 ? props.level : ['random value'],
      ),
      where('Intakes', '<', intk != '' ? intk + 'z' : ''),
      where('Intakes', '<', intk != '' ? intk + 'z' : ''),
      where('Country', '==', props.country),
      limit(100),
    );
    const intakeDurationCntLevel = query(
      docref,
      where(
        'Studylvl',
        'in',
        props.level.length > 0 ? props.level : ['random value'],
      ),
      where('Intakes', '<', intk != '' ? intk + 'z' : ''),
      where('Intakes', '<', intk != '' ? intk + 'z' : ''),
      where('Country', '==', props.country),
      where('Duration', '==', props.duration),
      limit(100),
    );
    if (
      props.intake != '' &&
      props.country != '' &&
      props.duration != -1 &&
      Array.isArray(props.level) &&
      props.level.length > 0
    ) {
      const ICDLSnap = await getDocs(intakeDurationCntLevel);
      ICDL = ICDLSnap.docs;
      return shuffle(ICDL);
    } else if (
      props.intake != '' &&
      props.country != '' &&
      props.duration != -1
    ) {
      const ICDSnap = await getDocs(intakeCntDurationref);
      ICD = ICDSnap.docs;
      return shuffle(ICD);
    } else if (
      props.country != '' &&
      props.duration != -1 &&
      Array.isArray(props.level) &&
      props.level.length > 0
    ) {
      const CDLSnap = await getDocs(cntDurationLevelref);
      CDL = CDLSnap.docs;
      return shuffle(CDL);
    } else if (
      props.intake != '' &&
      props.duration != -1 &&
      Array.isArray(props.level) &&
      props.level.length > 0
    ) {
      const IDLSnap = await getDocs(inatakeDurationLevelref);
      IDL = IDLSnap.docs;
      return shuffle(IDL);
    } else if (
      props.intake != '' &&
      props.country != '' &&
      Array.isArray(props.level) &&
      props.level.length > 0
    ) {
      const ICLSnap = await getDocs(inatakeCountryLevelref);
      ICL = ICLSnap.docs;
      return shuffle(ICL);
    } else if (props.intake != '' && props.country != '') {
      const CISnap = await getDocs(cntIntakeref);
      CI = CISnap.docs;
      return shuffle(CI);
    } else if (props.intake != '' && props.duration != -1) {
      const IDSnap = await getDocs(durationIntakeref);
      DI = IDSnap.docs;
      return shuffle(DI);
    } else if (
      props.intake != '' &&
      Array.isArray(props.level) &&
      props.level.length > 0
    ) {
      const LISnap = await getDocs(levelIntakeref);
      LI = LISnap.docs;
      return shuffle(LI);
    } else if (props.country != '' && props.duration != -1) {
      const CDSnap = await getDocs(durationCntref);
      DC = CDSnap.docs;
      return shuffle(DC);
    } else if (
      props.country != '' &&
      Array.isArray(props.level) &&
      props.level.length > 0
    ) {
      const CLSnap = await getDocs(cntLevelref);
      CL = CLSnap.docs;
      return shuffle(CL);
    } else if (
      props.duration != -1 &&
      Array.isArray(props.level) &&
      props.level.length > 0
    ) {
      const DLSnap = await getDocs(durationLevelref);
      DL = DLSnap.docs;
      return shuffle(DL);
    } else if (props.course != '') {
      const courseSnap = await getDocs(courseref);
      const univSnap = await getDocs(univref);
      Course = courseSnap.docs;
      U = univSnap.docs;
      return shuffle(Course.concat(U));
    } else if (props.intake != '') {
      const intakeSnap = await getDocs(intakeref);
      I = intakeSnap.docs;
      return shuffle(I);
    } else if (props.country != '') {
      const countrySnap = await getDocs(countryref);
      C = countrySnap.docs;
      return shuffle(C);
    } else if (props.duration != -1) {
      const durationSnap = await getDocs(durationref);
      D = durationSnap.docs;
      return shuffle(D);
    } else if (Array.isArray(props.level) && props.level.length > 0) {
      const levelSnap = await getDocs(levelref);
      L = levelSnap.docs;
      return shuffle(L);
    } else {
      const courseSnap = await getDocs(courseref);
      const univSnap = await getDocs(univref);
      Course = courseSnap.docs;
      U = univSnap.docs;
      return shuffle(Course.concat(U));
    }
  }, [
    docref,
    props.country,
    props.course,
    props.duration,
    props.intake,
    props.level,
  ]);
  const getImage = useCallback(
    async (un) => {
      const fileRef = ref(storage, `logos/${un}.png`);
      const photoURL = await getDownloadURL(fileRef);
      setImageObj((current) => [
        ...current,
        {
          id: un,
          url: photoURL,
        },
      ]);
    },
    [storage],
  );
  useEffect(() => {
    setUniqueDocs();
    setUniqueUniv();
    setDocs([]);
    setN(10);
    setSelectedCnt();
    setCountries();
    setMapDocs();
    setImgAv(false);
    setImageObj([]);
    setSortClicked(false);
    fetchDocs().then((result) => {
      result.forEach((doc) => {
        setDocs((prev) => {
          return [...prev, doc.data()];
        });
      });
    });
    setTimeout(function () {
      setShowElement(false);
    }, 8000);
  }, [fetchDocs]);
  useEffect(() => {
    const arr = docs
      .map((item) => item)
      .filter((value, index, self) => self.indexOf(value) === index);
    setUniqueDocs(arr);
    const arr2 = docs
      .map((item) => {
        return item.UniversityId;
      })
      .filter((value, index, self) => self.indexOf(value) === index);
    setUniqueUniv(arr2);
    const arr3 = docs
      .map((item) => item.Country)
      .filter((value, index, self) => self.indexOf(value) === index);
    setCountries(arr3);
  }, [docs]);
  useEffect(() => {
    if (Array.isArray(uniqueDocs)) {
      const arr = uniqueDocs
        .map((item) => item)
        .filter((value, index, self) => self.indexOf(value) === index);
      setMapDocs(arr);
    }
  }, [uniqueDocs]);
  useEffect(() => {
    if (Array.isArray(uniqueUniv) && uniqueUniv.length > 0) {
      uniqueUniv.forEach((un) => {
        getImage(un);
      });
    }
  }, [getImage, uniqueUniv]);
  useEffect(() => {
    if (Array.isArray(selectedCnt)) {
      if (selectedCnt.length > 0) {
        let arr3 = uniqueDocs.map((item) => {
          if (selectedCnt.includes(item.Country)) {
            return item;
          }
        });
        arr3 = arr3.filter((elem) => {
          return elem !== undefined;
        });
        setMapDocs(arr3);
      } else {
        const arr = uniqueDocs
          .map((item) => item)
          .filter((value, index, self) => self.indexOf(value) === index);
        setMapDocs(arr);
      }
    } else {
      const arr = uniqueDocs
        .map((item) => item)
        .filter((value, index, self) => self.indexOf(value) === index);
      setMapDocs(arr);
    }
  }, [selectedCnt, uniqueDocs]);
  useEffect(() => {}, [imageObj]);
  const [url, setUrl] = useState('');
  const handleEnroll = (data, logoUrl) => {
    setRouteState(ROUTE_STATE_KEYS.exploreUniversity, {
      udata: data,
      url: logoUrl,
    });
    router.push('/explore/university');
  };
  return (
    <>
      {mapDocs && country && mapDocs.length > 0 ? (
        <div className="max-w-6xl mx-auto bg-transparent px-5 pt-10 pb-1 rounded my-1">
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-6">
            {uniqueUniv && (
              <div className="col-span-5 sm:col-span-6 w-full mx-auto bg-light px-5 py-2 rounded mb-5 mt-4">
                <label className="text-main">
                  You found{' '}
                  <label className="font-bold">{uniqueUniv.length}</label>{' '}
                  institutes and{' '}
                  <label className="font-bold">{docs.length}</label> courses
                </label>
              </div>
            )}
            {}

            {}
          </div>
          <div className="col-span-5 sm:col-span-4 mb-4">
            <label className="text font-bold">Filter By</label>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="col-span-2 sm:col-span-1">
              <div className="flex flex-row w-full justify-between">
                <button
                  type="submit"
                  className={
                    sortClicked
                      ? 'inline-block text-xs sm:text-2xs w-full bg-light p-1 m-1'
                      : 'inline-block text-xs sm:text-2xs text-white w-full bg-main p-1 m-1'
                  }
                  onClick={() => {
                    if (sortClicked) {
                      shuffle(uniqueDocs);
                      const arr = uniqueDocs
                        .map((item) => item)
                        .filter(
                          (value, index, self) => self.indexOf(value) === index,
                        );
                      setMapDocs(arr);
                      setSortClicked(false);
                    }
                  }}
                >
                  Best Match
                </button>

                <button
                  type="submit"
                  className={
                    !sortClicked
                      ? 'inline-block text-xs sm:text-2xs w-full bg-light p-1 m-1'
                      : 'inline-block text-xs sm:text-2xs text-white w-full bg-main p-1 m-1'
                  }
                  onClick={() => {
                    if (!sortClicked) {
                      uniqueDocs.sort((a, b) => {
                        return b.UniversityOrder - a.UniversityOrder;
                      });
                      const arr = uniqueDocs
                        .map((item) => item)
                        .filter(
                          (value, index, self) => self.indexOf(value) === index,
                        );
                      setSortClicked(true);
                      setMapDocs(arr);
                    }
                  }}
                >
                  Best Rank
                </button>
              </div>
              <select
                id="country"
                name="country"
                className="inline-block mt-5 bg-light w-full p-1 focus:outline-none text-xs sm:text-2xs"
                onChange={(e) => {
                  e.preventDefault();
                  const value = e.target.value;
                  if (value == '') {
                    toast.warning('Please select a valid option', {
                      className: 'foo-bar',
                      autoClose: 1000,
                    });
                  } else {
                    if (Array.isArray(selectedCnt)) {
                      if (selectedCnt.includes(value)) {
                        toast.error('Already Selected', {
                          className: 'foo-bar',
                          autoClose: 1000,
                        });
                      } else {
                        setSelectedCnt([...selectedCnt, value]);
                      }
                    } else {
                      setSelectedCnt([value]);
                    }
                  }
                }}
              >
                <option value="" selected>
                  Country
                </option>
                {country &&
                  country.map((value) => {
                    return (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    );
                  })}
              </select>
              <div className="grid grid-cols-2 gap-3 my-3 mx-2 sm:grid-cols-2">
                {selectedCnt &&
                  selectedCnt.map((val) => {
                    return (
                      <div
                        key={val}
                        className="ring-main ring-offset-1 ring-1 rounded-lg flex w-full flex-row items-center col-span-1 sm:col-span-1 justify-around"
                      >
                        <label className="text-main text-3xs pl-1 pr-1">
                          {val}
                        </label>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedCnt(
                              selectedCnt.filter((x) => x !== val),
                            );
                          }}
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
                            ></path>
                          </svg>
                        </button>
                      </div>
                    );
                  })}

                {}
              </div>

              {}
              {}

              {}

              {}
            </div>
            <div className="col-span-2 sm:col-span-3">
              <div className="max-w-6xl mx-auto bg-light px-5 py-3 rounded mb-5 ml-7 ">
                {mapDocs &&
                  imageObj &&
                  mapDocs.slice(0, n).map((data) => {
                    let lurl = '';
                    let imgav = false;
                    return (
                      <div
                        key={data.id}
                        className="grid grid-cols-2 gap-4 sm:grid-cols-7 items-center bg-white m-2 rounded-lg py-2 px-5 ring-main ring-1 ring-offset-1 my-5"
                      >
                        {imageObj.map((val) => {
                          if (val.id === data.UniversityId) {
                            lurl = val.url;
                            imgav = true;
                            return (
                              <Image
                                unoptimized
                                width={0}
                                height={0}
                                sizes="100vw"
                                key={val.id}
                                src={val.url}
                                alt={data.id}
                                className="col-span-1 sm:col-span-1 h-10 rounded-md sm:h-20"
                              />
                            );
                          }
                        })}
                        {imgav == false && (
                          <Image
                            unoptimized
                            width={0}
                            height={0}
                            sizes="100vw"
                            src="Not Available"
                            alt={'Not Available'}
                            className="col-span-1 sm:col-span-1 h-10 rounded-md sm:h-20"
                          />
                        )}
                        <div className="col-span-2 sm:col-span-5">
                          <h1 className="text-lr font-bold px-5">
                            {data.Name}
                          </h1>
                          <ul className="text-2xs px-5 mt-3">
                            <li className="text-main flex flex-row items-center">
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
                              {`${data.Country}`}
                            </li>
                            <li className="mt-1">
                              <label className="text font-bold">
                                University:{' '}
                              </label>
                              {data?.University}
                            </li>
                            <li className="">
                              <label className="text font-bold">
                                Duration:{' '}
                              </label>
                              {data?.Duration}
                            </li>
                            <li className="">
                              <label className="text font-bold">
                                Yearly Tuition Fee:{' '}
                              </label>
                              {data?.TutionFee}
                            </li>
                            {}
                          </ul>
                        </div>
                        <div className="col-span-2 sm:col-span-1 flex flex-col justify-between">
                          <button
                            type="button"
                            className="block text-main w-full uppercase bg-transparent p-1 font-bold text-lg mb-0"
                            onClick={() => handleEnroll(data, lurl)}
                          >
                            Enroll
                          </button>
                        </div>
                      </div>
                    );
                  })}
                <div className="mb-10">
                  <button
                    type="submit"
                    className="block text-white align-center justify-center bg-main text-1.5lr p-3 text-lg mb-0 mt-5 items-center rounded-lg self-center"
                    onClick={() => {
                      setN(n + 10);
                    }}
                  >
                    Show More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : showElement ? (
        <div role="status" className="flex align-items-center justify-center ">
          <svg
            aria-hidden="true"
            className="w-12 h-12 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600 text-main"
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
      ) : (
        <div className="flex align-items-center justify-center items-center">
          <label className="text-main text-2xl">No Results Found...</label>
        </div>
      )}
      {}
    </>
  );
};
const university = [
  {
    id: '5f044f13a55e24365a7238a4',
    discipline: 'M.S.E. in Applied Mathematics and Statistics',
    logo: 'https://cdn.ischoolconnect.com/logo/1991.png',
    location_state: 'Stanford, California',
    location_country: 'United States of America',
    university: 'Johns Hopkins University',
    duration: '24 Month(s)',
    yearly_fee: 'Rs. 24805',
    acceptance_rate: '5%',
    isc_rank: '#2',
  },
  {
    id: '5f044f13a55e24365a7238a4',
    discipline: 'M.S.E. in Applied Mathematics and Statistics',
    logo: 'https://cdn.ischoolconnect.com/logo/1991.png',
    location_state: 'Stanford, California',
    location_country: 'United States of America',
    university: 'Johns Hopkins University',
    duration: '24 Month(s)',
    yearly_fee: 'Rs. 24805',
    acceptance_rate: '5%',
    isc_rank: '#2',
  },
  {
    id: '5f044f13a55e24365a7238a4',
    discipline: 'M.S.E. in Applied Mathematics and Statistics',
    logo: 'https://cdn.ischoolconnect.com/logo/1991.png',
    location_state: 'Stanford, California',
    location_country: 'United States of America',
    university: 'Johns Hopkins University',
    duration: '24 Month(s)',
    yearly_fee: 'Rs. 24805',
    acceptance_rate: '5%',
    isc_rank: '#2',
  },
];
export default FilteredResponse;
