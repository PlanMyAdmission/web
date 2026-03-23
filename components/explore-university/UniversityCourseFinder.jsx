'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from '@/components/explore-university/UniversityCourseFinder.module.css';
import { trackEvent } from '@lib/analytics.js';
import { mapModuleClasses } from '@/lib/cx.js';
import {
  apiConfig,
  eligibilityRequirements,
  embeddedUniversities,
} from '@/components/explore-university/university-finder/constants.js';
import {
  formatMinScoreForType,
  INITIAL_FORM_DATA,
  normalizeToGpa4,
  scoreTypeRanges,
} from '@/components/explore-university/university-finder/finderConfig.js';
import {
  searchUniversities,
  getRecommendations,
  estimateTuitionByCountry,
  convertUSDToINR,
  formatINR,
} from '@/components/explore-university/university-finder/utils.js';
import UniversitySearchForm from '@/components/explore-university/university-finder/UniversitySearchForm.jsx';
import UniversityFinderResults from '@/components/explore-university/university-finder/UniversityFinderResults.jsx';

const cx = (...classNames) => mapModuleClasses(styles, ...classNames);

const UniversityCourseFinder = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [validationMessages, setValidationMessages] = useState({});
  const [apiStatus, setApiStatus] = useState({
    openalex: 'inactive',
    hipolabs: 'inactive',
    fallback: 'active',
  });

  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (formData.university && formData.university.length >= 2) {
      searchTimeoutRef.current = setTimeout(async () => {
        setIsSearching(true);
        const results = await searchUniversities(
          formData.university,
          setApiStatus,
        );
        setIsSearching(false);

        if (!results.length) {
          setSearchResults([]);
          setShowDropdown(false);
          trackEvent('university_finder_search', {
            status: 'no_results',
          });
          setModalMessage(
            'No universities found. Try different search terms or check spelling.',
          );
          setShowModal(true);
          return;
        }

        trackEvent('university_finder_search', {
          status: 'results_loaded',
          result_count: results.length,
        });
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
    setFormData((previous) => ({ ...previous, [field]: value }));

    if (field === 'university' && `${value}`.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
    }

    if (validationMessages[field]) {
      setValidationMessages((previous) => ({ ...previous, [field]: '' }));
    }
  };

  const onUniversitySelect = (university) => {
    trackEvent('university_finder_select', {
      university_name: university?.name,
      country: university?.country,
    });
    setSelectedUniversity(university);
    setFormData((previous) => ({ ...previous, university: university.name }));
    setShowDropdown(false);
  };

  const onTestTypeChange = (testType) => {
    setFormData((previous) => ({
      ...previous,
      testType,
      ieltsScore: testType === 'ielts' ? previous.ieltsScore : '',
      toeflScore: testType === 'toefl' ? previous.toeflScore : '',
    }));
  };

  const validateForm = () => {
    const errors = {};
    const scoreConfig =
      scoreTypeRanges[formData.scoreType] || scoreTypeRanges.CGPA_10;
    const normalizedScore = normalizeToGpa4(formData.scoreType, formData.gpa);

    if (!selectedUniversity) {
      errors.university = 'Please select a university from the search results';
    }
    if (!formData.studyLevel) {
      errors.studyLevel = 'Please select a study level';
    }

    if (
      !formData.gpa ||
      Number.isNaN(parseFloat(formData.gpa)) ||
      parseFloat(formData.gpa) < scoreConfig.min ||
      parseFloat(formData.gpa) > scoreConfig.max ||
      Number.isNaN(normalizedScore) ||
      normalizedScore < 0 ||
      normalizedScore > 4
    ) {
      errors.gpa = `${scoreConfig.label} is required`;
    }

    if (!formData.testType) {
      errors.testType = 'Please select a test type and enter your score';
    } else if (formData.testType === 'ielts') {
      if (
        !formData.ieltsScore ||
        Number.isNaN(formData.ieltsScore) ||
        formData.ieltsScore < 0 ||
        formData.ieltsScore > 9
      ) {
        errors.testScore = 'IELTS score must be between 0.0 and 9.0';
      }
    } else if (
      !formData.toeflScore ||
      Number.isNaN(formData.toeflScore) ||
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
    if (!validateForm()) {
      trackEvent('university_finder_submit', {
        status: 'validation_failed',
      });
      return;
    }

    trackEvent('university_finder_submit', {
      status: 'success',
      university_name: selectedUniversity?.name,
      study_level: formData.studyLevel,
    });
    setShowResults(true);
    setTimeout(() => {
      document
        .getElementById('resultsSection')
        ?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const onReset = () => {
    trackEvent('university_finder_reset', {
      status: 'completed',
    });
    setFormData(INITIAL_FORM_DATA);
    setSelectedUniversity(null);
    setShowDropdown(false);
    setShowResults(false);
    setValidationMessages({});
  };

  const onCloseModal = () => {
    setShowModal(false);
  };

  const onUseFallbackList = () => {
    trackEvent('university_finder_search', {
      status: 'fallback_list',
      result_count: 20,
    });
    setSearchResults(embeddedUniversities.slice(0, 20));
    setShowDropdown(true);
    setShowModal(false);
  };

  const eligibility = useMemo(() => {
    if (!selectedUniversity || !formData.studyLevel) return null;

    const requirements = eligibilityRequirements[formData.studyLevel];
    const normalizedAcademicScore = normalizeToGpa4(
      formData.scoreType,
      formData.gpa,
    );
    const feedback = [];
    let score = 0;

    if (normalizedAcademicScore >= requirements.minGpa) {
      score += 1;
    } else {
      feedback.push(
        `Academic score should be at least ${formatMinScoreForType(requirements.minGpa, formData.scoreType)} for ${formData.studyLevel}`,
      );
    }

    const testScore =
      formData.testType === 'ielts'
        ? parseFloat(formData.ieltsScore)
        : parseInt(formData.toeflScore, 10);
    const minTestScore =
      formData.testType === 'ielts'
        ? requirements.minIelts
        : requirements.minToefl;

    if (testScore >= minTestScore) {
      score += 1;
    } else {
      feedback.push(
        `${formData.testType.toUpperCase()} score should be at least ${minTestScore}`,
      );
    }

    const isEligible = score === 2;
    return {
      statusClass: isEligible ? cx('status-eligible') : cx('status-review'),
      statusText: isEligible ? 'Likely Eligible' : 'Needs Review',
      message: isEligible
        ? 'Your academic and test profile meets the baseline requirement for this search.'
        : feedback.join('. '),
    };
  }, [
    formData.gpa,
    formData.ieltsScore,
    formData.scoreType,
    formData.studyLevel,
    formData.testType,
    formData.toeflScore,
    selectedUniversity,
  ]);

  const recommendations = useMemo(() => {
    if (!selectedUniversity) {
      return [];
    }

    return getRecommendations(selectedUniversity);
  }, [selectedUniversity]);

  return (
    <div className={cx('university-finder-container')}>
      <UniversitySearchForm
        cx={cx}
        formData={formData}
        searchResults={searchResults}
        showDropdown={showDropdown}
        isSearching={isSearching}
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
        showResults={showResults}
        selectedUniversity={selectedUniversity}
        formData={formData}
        eligibility={eligibility}
        recommendations={recommendations}
        showModal={showModal}
        modalMessage={modalMessage}
        estimateTuitionByCountry={estimateTuitionByCountry}
        convertUSDToINR={convertUSDToINR}
        formatINR={formatINR}
        onCloseModal={onCloseModal}
        onUseFallbackList={onUseFallbackList}
      />
    </div>
  );
};

export default UniversityCourseFinder;
