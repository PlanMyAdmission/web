'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthProvider.jsx';
import app from '@lib/firebase.js';
import Delete from '@mui/icons-material/DeleteOutlined';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { setRouteState, ROUTE_STATE_KEYS } from '@/lib/routeState.js';
import Image from 'next/image';
const Shortlisted = () => {
  const { profileData, handleDocumentDelete, getCurrentUserData } = useAuth();
  const [courses, setCourses] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const db = getFirestore(app);
  const router = useRouter();
  const defer = (cb) => {
    if (typeof queueMicrotask === 'function') {
      queueMicrotask(cb);
    } else {
      Promise.resolve().then(cb);
    }
  };
  const favoriteIds = useMemo(() => {
    return profileData?.favorites?.map((fav) => fav.id) ?? [];
  }, [profileData]);
  const uniqueUniversitySlugs = useMemo(() => {
    const slugs = courses.map((course) => course.school_slug).filter(Boolean);
    return Array.from(new Set(slugs));
  }, [courses]);
  const universityBySlug = useMemo(() => {
    return universities.reduce((acc, item) => {
      if (item?.slug) {
        acc[item.slug] = item;
      }
      return acc;
    }, {});
  }, [universities]);
  useEffect(() => {
    if (!favoriteIds.length) {
      defer(() => {
        setCourses([]);
        setUniversities([]);
      });
      return;
    }
    let isCancelled = false;
    const loadCourses = async () => {
      try {
        const chunks = [];
        for (let i = 0; i < favoriteIds.length; i += 10) {
          const batch = favoriteIds.slice(i, i + 10);
          const dataRef = query(
            collection(db, 'university_info'),
            where('id', 'in', batch),
          );
          chunks.push(getDocs(dataRef));
        }
        const snapshots = await Promise.all(chunks);
        if (isCancelled) {
          return;
        }
        const docs = snapshots.flatMap((snapshot) =>
          snapshot.docs.map((doc) => ({
            docId: doc.id,
            ...doc.data(),
          })),
        );
        setCourses(docs);
      } catch (error) {
        console.error('Failed to load favorite courses', error);
      }
    };
    loadCourses();
    return () => {
      isCancelled = true;
    };
  }, [db, favoriteIds]);
  useEffect(() => {
    if (!uniqueUniversitySlugs.length) {
      defer(() => setUniversities([]));
      return;
    }
    let isCancelled = false;
    const loadUniversities = async () => {
      try {
        const chunks = [];
        for (let i = 0; i < uniqueUniversitySlugs.length; i += 10) {
          const batch = uniqueUniversitySlugs.slice(i, i + 10);
          const dataRef = query(
            collection(db, 'university_desc'),
            where('slug', 'in', batch),
          );
          chunks.push(getDocs(dataRef));
        }
        const snapshots = await Promise.all(chunks);
        if (isCancelled) {
          return;
        }
        const docs = snapshots.flatMap((snapshot) =>
          snapshot.docs.map((doc) => doc.data()),
        );
        setUniversities(docs);
      } catch (error) {
        console.error('Failed to load universities', error);
      }
    };
    loadUniversities();
    return () => {
      isCancelled = true;
    };
  }, [db, uniqueUniversitySlugs]);
  const handleEnroll = (payload) => {
    setRouteState(ROUTE_STATE_KEYS.universityDetails, {
      udata: payload,
    });
    router.push('/dashboard/university');
  };
  const hasFavorites = favoriteIds.length > 0;
  return (
    <>
      {hasFavorites ? (
        <div className="flex flex-col items-center">
          <div className="max-w-6xl mx-auto bg-light px-5 py-2 rounded mb-5 mt-4">
            <p className="text-main font-bold">SHORTLISTED BY YOU</p>
          </div>
          <div className="max-w-6xl mx-auto bg-light px-5 py-3 rounded mb-5">
            {courses.slice(0, visibleCount).map((course) => {
              const universityInfo = universityBySlug[course.school_slug];
              const logo = universityInfo?.logo || '';
              const universityName = universityInfo?.name || 'University';
              const tuitionValue = universityInfo?.tuition_value || 0;
              const tuitionCurrency = universityInfo?.tuition_currency || '';
              const acceptanceRate = universityInfo?.acceptance_rate;
              const acceptanceText =
                typeof acceptanceRate === 'number'
                  ? `${acceptanceRate}%`
                  : 'N/A';
              const enrollmentPayload = universityInfo ? [universityInfo] : [];
              const courseKey = course.id || course.docId;
              return (
                <div
                  key={courseKey}
                  className="grid grid-cols-2 gap-4 sm:grid-cols-7 items-center bg-white m-2 rounded-lg py-2 px-5 ring-main ring-1 ring-offset-1 my-5"
                >
                  <div className="col-span-1 sm:col-span-1 h-10 sm:h-20 relative">
                    {logo ? (
                      <Image
                        src={logo}
                        alt={universityName}
                        fill
                        className="object-contain rounded-md"
                        sizes="80px"
                      />
                    ) : (
                      <div
                        className="w-full h-full bg-light rounded-md"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <div className="col-span-2 sm:col-span-5">
                    <h1 className="text-lr font-bold px-5">
                      {course?.degree} in {course?.name}
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
                        {`${course?.state}, ${course?.country}`}
                      </li>
                      <li className="mt-1">
                        <span className="font-bold">University: </span>
                        {universityName}
                      </li>
                      <li>
                        <span className="font-bold">Yearly Tuition Fee: </span>
                        {tuitionCurrency} {tuitionValue}
                      </li>
                      <li className="flex flex-row items-center flex-wrap">
                        <svg
                          aria-hidden="true"
                          className="w-4 h-4 text-main mt-1"
                          fill="none"
                          stroke="black"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="m10.273 2.513-.921-.944.715-.698.622.637.89-.011a2.89 2.89 0 0 1 2.924 2.924l-.01.89.636.622a2.89 2.89 0 0 1 0 4.134l-.637.622.011.89a2.89 2.89 0 0 1-2.924 2.924l-.89-.01-.622.636a2.89 2.89 0 0 1-4.134 0l-.622-.637-.89.011a2.89 2.89 0 0 1-2.924-2.924l.01-.89-.636-.622a2.89 2.89 0 0 1 0-4.134l.637-.622-.011-.89a2.89 2.89 0 0 1 2.924-2.924l.89.01.622-.636a2.89 2.89 0 0 1 4.134 0l-.715.698a1.89 1.89 0 0 0-2.704 0l-.92.944-1.32-.016a1.89 1.89 0 0 0-1.911 1.912l.016 1.318-.944.921a1.89 1.89 0 0 0 0 2.704l.944.92-.016 1.32a1.89 1.89 0 0 0 1.912 1.911l1.318-.016.921.944a1.89 1.89 0 0 0 2.704 0l.92-.944 1.32.016a1.89 1.89 0 0 0 1.911-1.912l-.016-1.318.944-.921a1.89 1.89 0 0 0 0-2.704l-.944-.92.016-1.32a1.89 1.89 0 0 0-1.912-1.911l-1.318.016z" />
                        </svg>
                        <span className="text-bold text-main font-bold text-2xs">
                          {acceptanceText}
                        </span>
                        <span className="text text-2.5xs sm:ml-2">
                          Acceptance Rate
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="col-span-2 sm:col-span-1 flex flex-col justify-between">
                    <div className="ml-5">
                      <button
                        type="button"
                        className="font-bold"
                        onClick={() => {
                          handleDocumentDelete(
                            course.id ?? course.docId,
                            'favorites',
                          );
                          getCurrentUserData();
                        }}
                      >
                        <Delete
                          style={{
                            color: 'red',
                          }}
                          className="cursor-pointer"
                        />
                      </button>
                    </div>

                    <button
                      type="button"
                      className="block text-main w-full uppercase bg-transparent p-1 font-bold text-lg mb-0 mt-5"
                      onClick={() => handleEnroll(enrollmentPayload)}
                    >
                      Enroll
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mb-10">
            <button
              type="button"
              className="block text-white bg-main text-1.5lr p-3 text-lg mb-0 mt-5 items-center rounded-lg self-center"
              onClick={() => setVisibleCount((prev) => prev + 2)}
            >
              Show More
            </button>
          </div>
        </div>
      ) : (
        <div>Getting Data...</div>
      )}
    </>
  );
};
export default Shortlisted;
