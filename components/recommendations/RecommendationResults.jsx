'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import UniversityCourseCard from '@/components/recommendations/UniversityCourseCard.jsx';

const RecommendationResults = ({ props }) => {
  const courses = [];
  const [n, setN] = useState(10);
  const router = useRouter();

  const filteredCourses = useMemo(() => {
    if (!props.discipline) {
      return courses;
    }
    return courses.filter((course) =>
      course?.discipline?.includes(props.discipline),
    );
  }, [courses, props.discipline]);

  const handleEnroll = (slug) => {
    if (!slug) {
      return;
    }
    router.push(`/explore/universities/${slug}`);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="max-w-6xl mx-auto bg-light px-5 py-2 rounded mb-5 mt-4">
        <label className="text-main">
          You found{' '}
          <label className="font-bold">{filteredCourses.length}</label> courses
        </label>
      </div>
      <div className="max-w-6xl mx-auto bg-light px-5 py-3 rounded mb-5">
        {filteredCourses.length > 0 ? (
          filteredCourses.slice(0, n).map((data) => {
            const courseKey = data?.id || data?.docId;
            return (
              <UniversityCourseCard
                key={courseKey}
                course={data}
                universityInfo={undefined}
                onEnroll={() => handleEnroll(data?.school_slug)}
              />
            );
          })
        ) : (
          <div>No Results Found...</div>
        )}
      </div>
      {filteredCourses.length > n && (
        <div className="mb-10">
          <button
            type="button"
            className="block text-white bg-main text-1.5lr p-3 text-lg mb-0 mt-5 items-center rounded-lg self-center mx-auto"
            onClick={() => setN((value) => value + 10)}
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
};

export default RecommendationResults;
