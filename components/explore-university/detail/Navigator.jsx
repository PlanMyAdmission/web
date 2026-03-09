'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import app from '@lib/firebase.js';
import { collection, getDocs, getFirestore, limit, query, where } from 'firebase/firestore';
import {
  AboutSection,
  CoursesSection,
  HighlightsInfoSection,
  StatsSection,
} from '@/components/explore-university/detail/NavigatorSections.jsx';
import { reportError } from '@lib/logger.js';

const NAV_BUTTON_CLASS =
  'py-2 px-4 focus:bg-white focus:font-bold active:font-bold active:bg-white focus:outline-none outline-none mx-2 my-2 rounded-md transition-all duration-100 ease-in-out';

const Navigator = ({ props }) => {
  const universities = useMemo(() => props || [], [props]);
  const db = getFirestore(app);
  const aboutRef = useRef(null);
  const statRef = useRef(null);
  const courseRef = useRef(null);
  const highlightRef = useRef(null);
  const infoRef = useRef(null);

  const [coursesList, setCoursesList] = useState([]);
  const [selectedDiscipline, setSelectedDiscipline] = useState('');
  const [courseFetchLimit] = useState(1000);
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    if (!universities.length) {
      queueMicrotask(() => setCoursesList([]));
      return;
    }

    let isCancelled = false;
    const loadCourses = async () => {
      try {
        const slugs = universities.map((item) => item.slug).filter(Boolean);
        if (!slugs.length) {
          if (!isCancelled) setCoursesList([]);
          return;
        }

        const chunkSize = 10;
        const promises = [];
        for (let index = 0; index < slugs.length; index += chunkSize) {
          const batch = slugs.slice(index, index + chunkSize);
          const dataRef = query(
            collection(db, 'university_info'),
            where('school_slug', 'in', batch),
            limit(courseFetchLimit),
          );
          promises.push(getDocs(dataRef));
        }

        const snapshots = await Promise.all(promises);
        if (isCancelled) return;

        const docs = snapshots.flatMap((snapshot) =>
          snapshot.docs.map((document) => document.data()),
        );
        setCoursesList(docs);
      } catch (error) {
        reportError('Failed to fetch university courses', error);
        if (!isCancelled) {
          setCoursesList([]);
        }
      }
    };

    loadCourses();
    return () => {
      isCancelled = true;
    };
  }, [courseFetchLimit, db, universities]);

  const uniqueDisciplines = useMemo(
    () => [...new Set(coursesList.map((item) => item?.discipline?.[0]).filter(Boolean))],
    [coursesList],
  );

  const visibleCourses = useMemo(
    () =>
      coursesList
        .filter((courseItem) => courseItem?.discipline?.[0] === selectedDiscipline)
        .slice(0, visibleCount),
    [coursesList, selectedDiscipline, visibleCount],
  );

  const navItems = useMemo(
    () => [
      { id: 1, name: 'About', ref: aboutRef },
      { id: 2, name: 'Stats', ref: statRef },
      { id: 3, name: 'Courses', ref: courseRef },
      { id: 4, name: 'Highlights', ref: highlightRef },
      { id: 5, name: 'Additional Info', ref: infoRef },
    ],
    [],
  );

  const handleDisciplineChange = (event) => {
    setSelectedDiscipline(event.target.value);
    setVisibleCount(5);
  };

  return (
    <>
      <div className="max-w-5xl mx-auto bg-light rounded my-5 sticky top-1">
        <div className="bg-light md:max-w-7xl md:mx-auto flex justify-between rounded-md text-1.5lr overflow-x-auto hide-scroll-bar whitespace-nowrap snap-x my-10">
          {navItems.map((topic) => (
            <span key={topic.id}>
              <button
                type="button"
                className={NAV_BUTTON_CLASS}
                onClick={() => topic.ref.current?.scrollIntoView()}
              >
                {topic.name}
              </button>
            </span>
          ))}
        </div>
      </div>

      {universities.map((university, index) => (
        <React.Fragment key={university?.id || university?.slug || index}>
          <AboutSection aboutRef={aboutRef} description={university?.description} />
          <StatsSection statRef={statRef} university={university} />
          <CoursesSection
            courseRef={courseRef}
            selected={selectedDiscipline}
            uniqueDisciplines={uniqueDisciplines}
            onDisciplineChange={handleDisciplineChange}
            visibleCourses={visibleCourses}
            onShowMore={() => setVisibleCount((prev) => prev + 4)}
          />
          <HighlightsInfoSection
            highlightRef={highlightRef}
            infoRef={infoRef}
            university={university}
          />
        </React.Fragment>
      ))}
    </>
  );
};

export default Navigator;
