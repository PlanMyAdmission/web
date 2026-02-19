'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from '@/components/explore_university/UniversityCourseFinder.module.css';
import { mapModuleClasses } from '@/lib/cx.js';
import {
  apiConfig,
  eligibilityRequirements,
  embeddedUniversities,
} from '@/components/explore_university/universityFinder/constants.js';
import {
  convertUSDToINR,
  estimateTuitionByCountry,
  formatINR,
  getRecommendations,
  searchUniversities,
} from '@/components/explore_university/universityFinder/utils.js';
import UniversitySearchForm from '@/components/explore_university/universityFinder/UniversitySearchForm.jsx';
import UniversityFinderResults from '@/components/explore_university/universityFinder/UniversityFinderResults.jsx';

const cx = (...classNames) => mapModuleClasses(styles, ...classNames);

const INITIAL_FORM_DATA = {
  university: '',
  studyLevel: '',
  gpa: '',
  testType: '',
  ieltsScore: '',
  toeflScore: '',
  budget: 0,
};

const UniversityCourseFinder = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [apiStatus, setApiStatus] = useState({
    openalex: 'inactive',
    hipolabs: 'inactive',
    fallback: 'active',
  });
  const [validationMessages, setValidationMessages] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (formData.university && formData.university.length >= 2) {
      searchTimeoutRef.current = setTimeout(async () => {
        setIsSearching(true);
        const results = await searchUniversities(formData.university, setApiStatus);
        setIsSearching(false);

        if (!results.length) {
          setSearchResults([]);
          setShowDropdown(false);
          setModalMessage('No universities found. Try different search terms or check spelling.');
          setShowModal(true);
          return;
        }

        setSearchResults(results);
        setShowDropdown(true);
      }, apiConfig.debounceDelay);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [formData.university]);

  const onInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === 'university' && `${value}`.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
    }

    if (validationMessages[field]) {
      setValidationMessages((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const onUniversitySelect = (university) => {
    setSelectedUniversity(university);
    setFormData((prev) => ({ ...prev, university: university.name }));
    setShowDropdown(false);
  };

  const onTestTypeChange = (testType) => {
    setFormData((prev) => ({
      ...prev,
      testType,
      ieltsScore: testType === 'ielts' ? prev.ieltsScore : '',
      toeflScore: testType === 'toefl' ? prev.toeflScore : '',
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!selectedUniversity) errors.university = 'Please select a university from the search results';
    if (!formData.studyLevel) errors.studyLevel = 'Please select a study level';

    if (!formData.gpa || isNaN(formData.gpa) || formData.gpa < 0 || formData.gpa > 4) {
      errors.gpa = 'GPA must be between 0.0 and 4.0';
    }

    if (!formData.testType) {
      errors.testType = 'Please select a test type and enter your score';
    } else if (formData.testType === 'ielts') {
      if (
        !formData.ieltsScore ||
        isNaN(formData.ieltsScore) ||
        formData.ieltsScore < 0 ||
        formData.ieltsScore > 9
      ) {
        errors.testScore = 'IELTS score must be between 0.0 and 9.0';
      }
    } else if (
      !formData.toeflScore ||
      isNaN(formData.toeflScore) ||
      formData.toeflScore < 0 ||
      formData.toeflScore > 120
    ) {
      errors.testScore = 'TOEFL score must be between 0 and 120';
    }

    setValidationMessages(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setShowResults(true);
    setTimeout(() => {
      document.getElementById('resultsSection')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const onReset = () => {
    setFormData(INITIAL_FORM_DATA);
    setSelectedUniversity(null);
    setShowDropdown(false);
    setShowResults(false);
    setValidationMessages({});
  };

  const eligibility = useMemo(() => {
    if (!selectedUniversity || !formData.studyLevel) return null;

    const requirements = eligibilityRequirements[formData.studyLevel];
    let score = 0;
    const feedback = [];

    if (parseFloat(formData.gpa) >= requirements.minGpa) {
      score += 1;
    } else {
      feedback.push(`GPA should be at least ${requirements.minGpa} for ${formData.studyLevel}`);
    }

    const testScore =
      formData.testType === 'ielts'
        ? parseFloat(formData.ieltsScore)
        : parseInt(formData.toeflScore, 10);
    const minTestScore =
      formData.testType === 'ielts' ? requirements.minIelts : requirements.minToefl;

    if (testScore >= minTestScore) {
      score += 1;
    } else {
      feedback.push(
        `${formData.testType.toUpperCase()} score should be at least ${minTestScore} for ${formData.studyLevel}`,
      );
    }

    const tuitionEstimate =
      selectedUniversity.tuition || estimateTuitionByCountry(selectedUniversity.country);

    if (formData.budget >= tuitionEstimate || formData.budget === 0) {
      score += 1;
    } else {
      feedback.push(
        `Consider budget of at least $${tuitionEstimate.toLocaleString()} (${formatINR(convertUSDToINR(tuitionEstimate))}) for ${selectedUniversity.name}`,
      );
    }

    if (score === 3) {
      return {
        statusClass: 'status--success',
        statusText: 'High Eligibility',
        message: `Excellent! You meet all basic requirements for ${formData.studyLevel} programs at ${selectedUniversity.name}.`,
      };
    }

    if (score === 2) {
      return {
        statusClass: 'status--warning',
        statusText: 'Medium Eligibility',
        message: `Good potential! You meet most requirements. Consider: ${feedback.join('; ')}.`,
      };
    }

    return {
      statusClass: 'status--error',
      statusText: 'Needs Improvement',
      message: `Work needed. Areas to improve: ${feedback.join('; ')}.`,
    };
  }, [formData, selectedUniversity]);

  return (
    <div className={cx('university-finder-container')}>
      <UniversitySearchForm
        cx={cx}
        formData={formData}
        isSearching={isSearching}
        showDropdown={showDropdown}
        searchResults={searchResults}
        validationMessages={validationMessages}
        apiStatus={apiStatus}
        formatINR={formatINR}
        convertUSDToINR={convertUSDToINR}
        onInputChange={onInputChange}
        onUniversitySelect={onUniversitySelect}
        onTestTypeChange={onTestTypeChange}
        onSubmit={onSubmit}
        onReset={onReset}
      />

      <UniversityFinderResults
        cx={cx}
        formData={formData}
        selectedUniversity={selectedUniversity}
        showResults={showResults}
        showModal={showModal}
        modalMessage={modalMessage}
        recommendations={getRecommendations(selectedUniversity)}
        eligibility={eligibility}
        estimateTuitionByCountry={estimateTuitionByCountry}
        convertUSDToINR={convertUSDToINR}
        formatINR={formatINR}
        onCloseModal={() => setShowModal(false)}
        onUseFallbackList={() => {
          setShowModal(false);
          setSearchResults(embeddedUniversities.slice(0, 10));
          setShowDropdown(true);
        }}
      />
    </div>
  );
};

export default UniversityCourseFinder;
