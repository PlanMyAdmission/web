'use client';

import React, { useEffect, useMemo, useState } from 'react';
import app from '@lib/firebase.js';
import {
  getFirestore,
  collection,
  getDocs,
  limit,
  query,
  where,
} from 'firebase/firestore';
import { useAuth } from '@/context/AuthProvider.jsx';
import { useRouter } from 'next/navigation';
import { setRouteState, ROUTE_STATE_KEYS } from '@/lib/routeState.js';
import UniversityCourseCard, {
  UniversityListSpinner,
} from '@/components/dashboard/user/profile/UniversityCourseCard.jsx';
const Universities = ({ props }) => {
  const [courses, setCourses] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [n, setN] = useState(10);
  const [showElement, setShowElement] = useState(true);
  const db = getFirestore(app);
  const router = useRouter();
  const { updateFavorite } = useAuth();
  const [loading, setLoading] = useState(false);
  const handleFavorite = (e) => {
    let value = e.target.value;
    updateFavorite(value);
    setLoading(false);
  };
  useEffect(() => {
    let isCancelled = false;
    let spinnerTimeout;
    const fetchCourses = async () => {
      if (!props.country || !props.state || !props.degree) {
        setCourses([]);
        setShowElement(false);
        return;
      }
      setLoading(true);
      setShowElement(true);
      try {
        const dataref = query(
          collection(db, 'university_info'),
          where('country', '==', props.country),
          where('state', '==', props.state),
          where('degree', 'array-contains', props.degree),
          limit(200),
        );
        const docSnap = await getDocs(dataref);
        if (isCancelled) return;
        const docs = docSnap.docs.map((doc) => ({
          docId: doc.id,
          ...doc.data(),
        }));
        setCourses(docs);
      } catch (error) {
        console.error('Failed to fetch courses', error);
        if (!isCancelled) {
          setCourses([]);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
          spinnerTimeout = window.setTimeout(() => setShowElement(false), 800);
        }
      }
    };
    fetchCourses();
    return () => {
      isCancelled = true;
      if (spinnerTimeout) {
        window.clearTimeout(spinnerTimeout);
      }
    };
  }, [db, props.country, props.state, props.degree]);
  const filteredCourses = useMemo(() => {
    if (!props.discipline) {
      return courses;
    }
    return courses.filter((course) =>
      course?.discipline?.includes(props.discipline),
    );
  }, [courses, props.discipline]);
  const uniqueUniv = useMemo(() => {
    const slugs = filteredCourses
      .map((item) => item.school_slug)
      .filter((slug) => typeof slug === 'string' && slug.length > 0);
    return Array.from(new Set(slugs));
  }, [filteredCourses]);
  useEffect(() => {
    if (!uniqueUniv.length) {
      setUniversities([]);
      return;
    }
    let isCancelled = false;
    const fetchUniversities = async () => {
      try {
        const chunks = [];
        for (let i = 0; i < uniqueUniv.length; i += 10) {
          const batch = uniqueUniv.slice(i, i + 10);
          const dataref = query(
            collection(db, 'university_desc'),
            where('slug', 'in', batch),
          );
          chunks.push(getDocs(dataref));
        }
        const snapshots = await Promise.all(chunks);
        if (isCancelled) return;
        const docs = snapshots.flatMap((snap) =>
          snap.docs.map((doc) => doc.data()),
        );
        setUniversities(docs);
      } catch (error) {
        console.error('Failed to fetch universities', error);
        if (!isCancelled) {
          setUniversities([]);
        }
      }
    };
    fetchUniversities();
    return () => {
      isCancelled = true;
    };
  }, [db, uniqueUniv]);
  const universityMap = useMemo(() => {
    return universities.reduce((acc, item) => {
      if (item?.slug) {
        acc[item.slug] = item;
      }
      return acc;
    }, {});
  }, [universities]);
  const handleEnroll = (payload) => {
    setRouteState(ROUTE_STATE_KEYS.universityDetails, {
      udata: payload,
    });
    router.push('/dashboard/university');
  };
  return (
    <>
      {!loading ? (
        <div className="flex flex-col items-center">
          <div className="max-w-6xl mx-auto bg-light px-5 py-2 rounded mb-5 mt-4">
            <label className="text-main">
              You found{' '}
              <label className="font-bold">{filteredCourses.length}</label>{' '}
              courses
            </label>
          </div>
          <div className="max-w-6xl mx-auto bg-light px-5 py-3 rounded mb-5 ">
            {filteredCourses && filteredCourses.length > 0 ? (
              filteredCourses.slice(0, n).map((data) => {
                const courseKey = data?.id || data?.docId;
                const universityInfo = universityMap[data.school_slug];
                const enrollmentPayload = universityInfo
                  ? [universityInfo]
                  : [];
                return (
                  <UniversityCourseCard
                    key={courseKey}
                    course={data}
                    universityInfo={universityInfo}
                    onShortlistChange={(e) => {
                      setLoading(true);
                      handleFavorite(e);
                    }}
                    onEnroll={() => handleEnroll(enrollmentPayload)}
                  />
                );
              })
            ) : showElement ? (
              <UniversityListSpinner />
            ) : (
              <div>No Results Found...</div>
            )}
          </div>
          <div className="mb-10">
            <button
              type="submit"
              className="block text-white bg-main text-1.5lr p-3 text-lg mb-0 mt-5 items-center rounded-lg self-center"
              onClick={() => {
                setN(n + 10);
              }}
            >
              Show More
            </button>
          </div>
        </div>
      ) : (
        <div>Shorlisting...</div>
      )}
    </>
  );
};
export default Universities;
