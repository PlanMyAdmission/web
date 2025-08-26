import React from "react";
import UniversityCourseFinder from "./UniversityCourseFinder";
import { Helmet } from "react-helmet";

const Explore = () => {
  return (
    <>
      <Helmet>
        <title>University Course Finder - Plan My Admission</title>
        <meta
          name="description"
          content="Search from 200+ universities worldwide with comprehensive global database coverage. Find your perfect academic match with our advanced university course finder."
        />
      </Helmet>
      <UniversityCourseFinder />
    </>
  );
};

export default Explore;
