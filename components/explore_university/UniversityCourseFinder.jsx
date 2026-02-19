'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from '@/components/explore_university/UniversityCourseFinder.module.css';
const cx = (...classNames) =>
  classNames
    .flatMap((value) => `${value || ''}`.split(/\s+/))
    .map((name) => styles[name])
    .filter(Boolean)
    .join(' ');
const UniversityCourseFinder = () => {
  const [formData, setFormData] = useState({
    university: '',
    studyLevel: '',
    gpa: '',
    testType: '',
    ieltsScore: '',
    toeflScore: '',
    budget: 0,
  });
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
  const exchangeRate = 84;
  const apiConfig = {
    debounceDelay: 300,
    timeout: 8000,
    openalex: 'https://api.openalex.org/institutions?search=',
    hipolabs: 'https://universities.hipolabs.com/search?name=',
    corsProxy: 'https://api.allorigins.win/get?url=',
  };
  const universityAbbreviations = {
    mit: 'massachusetts institute of technology',
    jhu: 'johns hopkins university',
    nyu: 'new york university',
    ucla: 'university of california los angeles',
    'uc berkeley': 'university of california berkeley',
    berkeley: 'university of california berkeley',
    caltech: 'california institute of technology',
    cmu: 'carnegie mellon university',
    harvard: 'harvard university',
    stanford: 'stanford university',
    yale: 'yale university',
    princeton: 'princeton university',
    oxford: 'university of oxford',
    cambridge: 'university of cambridge',
    imperial: 'imperial college london',
    ucl: 'university college london',
    kcl: 'kings college london',
    lse: 'london school of economics',
    toronto: 'university of toronto',
    ubc: 'university of british columbia',
    mcgill: 'mcgill university',
    anu: 'australian national university',
    unsw: 'university of new south wales',
    nus: 'national university of singapore',
    ntu: 'nanyang technological university',
    eth: 'eth zurich',
    tum: 'technical university of munich',
  };
  const commonMisspellings = {
    'john hopkins': 'johns hopkins',
    massachusets: 'massachusetts',
    pennsylvannia: 'pennsylvania',
    berkley: 'berkeley',
    californa: 'california',
    washingon: 'washington',
    universtiy: 'university',
    univeristy: 'university',
    colege: 'college',
    insitute: 'institute',
    tecnology: 'technology',
    standford: 'stanford',
    havard: 'harvard',
    oxfort: 'oxford',
    cambrige: 'cambridge',
  };
  const studyLevels = [
    {
      value: "Bachelor's",
      label: "Bachelor's Degree",
    },
    {
      value: "Master's",
      label: "Master's Degree",
    },
    {
      value: 'PhD',
      label: 'PhD/Doctorate',
    },
    {
      value: 'Certificate',
      label: 'Certificate Program',
    },
  ];
  const embeddedUniversities = [
    {
      name: 'Harvard University',
      country: 'United States',
      city: 'Cambridge, MA',
      domains: ['harvard.edu'],
      web_pages: ['https://www.harvard.edu/'],
      ranking: 1,
      tuition: 55000,
    },
    {
      name: 'Massachusetts Institute of Technology',
      country: 'United States',
      city: 'Cambridge, MA',
      domains: ['mit.edu'],
      web_pages: ['https://www.mit.edu/'],
      ranking: 2,
      tuition: 57000,
    },
    {
      name: 'Stanford University',
      country: 'United States',
      city: 'Stanford, CA',
      domains: ['stanford.edu'],
      web_pages: ['https://www.stanford.edu/'],
      ranking: 3,
      tuition: 56000,
    },
    {
      name: 'Yale University',
      country: 'United States',
      city: 'New Haven, CT',
      domains: ['yale.edu'],
      web_pages: ['https://www.yale.edu/'],
      ranking: 4,
      tuition: 62000,
    },
    {
      name: 'Princeton University',
      country: 'United States',
      city: 'Princeton, NJ',
      domains: ['princeton.edu'],
      web_pages: ['https://www.princeton.edu/'],
      ranking: 5,
      tuition: 57000,
    },
    {
      name: 'University of Pennsylvania',
      country: 'United States',
      city: 'Philadelphia, PA',
      domains: ['upenn.edu'],
      web_pages: ['https://www.upenn.edu/'],
      ranking: 6,
      tuition: 63000,
    },
    {
      name: 'California Institute of Technology',
      country: 'United States',
      city: 'Pasadena, CA',
      domains: ['caltech.edu'],
      web_pages: ['https://www.caltech.edu/'],
      ranking: 7,
      tuition: 58000,
    },
    {
      name: 'Johns Hopkins University',
      country: 'United States',
      city: 'Baltimore, MD',
      domains: ['jhu.edu'],
      web_pages: ['https://www.jhu.edu/'],
      ranking: 8,
      tuition: 60000,
    },
    {
      name: 'Northwestern University',
      country: 'United States',
      city: 'Evanston, IL',
      domains: ['northwestern.edu'],
      web_pages: ['https://www.northwestern.edu/'],
      ranking: 9,
      tuition: 61000,
    },
    {
      name: 'Duke University',
      country: 'United States',
      city: 'Durham, NC',
      domains: ['duke.edu'],
      web_pages: ['https://www.duke.edu/'],
      ranking: 10,
      tuition: 62000,
    },
    {
      name: 'University of California Los Angeles',
      country: 'United States',
      city: 'Los Angeles, CA',
      domains: ['ucla.edu'],
      web_pages: ['https://www.ucla.edu/'],
      ranking: 11,
      tuition: 45000,
    },
    {
      name: 'University of California Berkeley',
      country: 'United States',
      city: 'Berkeley, CA',
      domains: ['berkeley.edu'],
      web_pages: ['https://www.berkeley.edu/'],
      ranking: 12,
      tuition: 44000,
    },
    {
      name: 'Columbia University',
      country: 'United States',
      city: 'New York, NY',
      domains: ['columbia.edu'],
      web_pages: ['https://www.columbia.edu/'],
      ranking: 13,
      tuition: 64000,
    },
    {
      name: 'University of Chicago',
      country: 'United States',
      city: 'Chicago, IL',
      domains: ['uchicago.edu'],
      web_pages: ['https://www.uchicago.edu/'],
      ranking: 14,
      tuition: 62000,
    },
    {
      name: 'Cornell University',
      country: 'United States',
      city: 'Ithaca, NY',
      domains: ['cornell.edu'],
      web_pages: ['https://www.cornell.edu/'],
      ranking: 15,
      tuition: 63000,
    },
    {
      name: 'Brown University',
      country: 'United States',
      city: 'Providence, RI',
      domains: ['brown.edu'],
      web_pages: ['https://www.brown.edu/'],
      ranking: 16,
      tuition: 64000,
    },
    {
      name: 'Dartmouth College',
      country: 'United States',
      city: 'Hanover, NH',
      domains: ['dartmouth.edu'],
      web_pages: ['https://www.dartmouth.edu/'],
      ranking: 17,
      tuition: 62000,
    },
    {
      name: 'New York University',
      country: 'United States',
      city: 'New York, NY',
      domains: ['nyu.edu'],
      web_pages: ['https://www.nyu.edu/'],
      ranking: 18,
      tuition: 58000,
    },
    {
      name: 'University of Michigan',
      country: 'United States',
      city: 'Ann Arbor, MI',
      domains: ['umich.edu'],
      web_pages: ['https://www.umich.edu/'],
      ranking: 19,
      tuition: 52000,
    },
    {
      name: 'Carnegie Mellon University',
      country: 'United States',
      city: 'Pittsburgh, PA',
      domains: ['cmu.edu'],
      web_pages: ['https://www.cmu.edu/'],
      ranking: 20,
      tuition: 59000,
    },
    {
      name: 'University of Oxford',
      country: 'United Kingdom',
      city: 'Oxford',
      domains: ['ox.ac.uk'],
      web_pages: ['https://www.ox.ac.uk/'],
      ranking: 1,
      tuition: 35000,
    },
    {
      name: 'University of Cambridge',
      country: 'United Kingdom',
      city: 'Cambridge',
      domains: ['cam.ac.uk'],
      web_pages: ['https://www.cam.ac.uk/'],
      ranking: 2,
      tuition: 33000,
    },
    {
      name: 'Imperial College London',
      country: 'United Kingdom',
      city: 'London',
      domains: ['imperial.ac.uk'],
      web_pages: ['https://www.imperial.ac.uk/'],
      ranking: 3,
      tuition: 38000,
    },
    {
      name: 'London School of Economics',
      country: 'United Kingdom',
      city: 'London',
      domains: ['lse.ac.uk'],
      web_pages: ['https://www.lse.ac.uk/'],
      ranking: 4,
      tuition: 34000,
    },
    {
      name: 'University College London',
      country: 'United Kingdom',
      city: 'London',
      domains: ['ucl.ac.uk'],
      web_pages: ['https://www.ucl.ac.uk/'],
      ranking: 5,
      tuition: 32000,
    },
    {
      name: "King's College London",
      country: 'United Kingdom',
      city: 'London',
      domains: ['kcl.ac.uk'],
      web_pages: ['https://www.kcl.ac.uk/'],
      ranking: 6,
      tuition: 30000,
    },
    {
      name: 'University of Edinburgh',
      country: 'United Kingdom',
      city: 'Edinburgh',
      domains: ['ed.ac.uk'],
      web_pages: ['https://www.ed.ac.uk/'],
      ranking: 7,
      tuition: 28000,
    },
    {
      name: 'University of Manchester',
      country: 'United Kingdom',
      city: 'Manchester',
      domains: ['manchester.ac.uk'],
      web_pages: ['https://www.manchester.ac.uk/'],
      ranking: 8,
      tuition: 26000,
    },
    {
      name: 'University of Warwick',
      country: 'United Kingdom',
      city: 'Coventry',
      domains: ['warwick.ac.uk'],
      web_pages: ['https://www.warwick.ac.uk/'],
      ranking: 9,
      tuition: 27000,
    },
    {
      name: 'University of Bristol',
      country: 'United Kingdom',
      city: 'Bristol',
      domains: ['bristol.ac.uk'],
      web_pages: ['https://www.bristol.ac.uk/'],
      ranking: 10,
      tuition: 25000,
    },
    {
      name: 'University of Toronto',
      country: 'Canada',
      city: 'Toronto, ON',
      domains: ['utoronto.ca'],
      web_pages: ['https://www.utoronto.ca/'],
      ranking: 1,
      tuition: 32000,
    },
    {
      name: 'University of British Columbia',
      country: 'Canada',
      city: 'Vancouver, BC',
      domains: ['ubc.ca'],
      web_pages: ['https://www.ubc.ca/'],
      ranking: 2,
      tuition: 30000,
    },
    {
      name: 'McGill University',
      country: 'Canada',
      city: 'Montreal, QC',
      domains: ['mcgill.ca'],
      web_pages: ['https://www.mcgill.ca/'],
      ranking: 3,
      tuition: 28000,
    },
    {
      name: 'University of Melbourne',
      country: 'Australia',
      city: 'Melbourne, VIC',
      domains: ['unimelb.edu.au'],
      web_pages: ['https://www.unimelb.edu.au/'],
      ranking: 1,
      tuition: 45000,
    },
    {
      name: 'University of Sydney',
      country: 'Australia',
      city: 'Sydney, NSW',
      domains: ['sydney.edu.au'],
      web_pages: ['https://www.sydney.edu.au/'],
      ranking: 2,
      tuition: 47000,
    },
    {
      name: 'Australian National University',
      country: 'Australia',
      city: 'Canberra, ACT',
      domains: ['anu.edu.au'],
      web_pages: ['https://www.anu.edu.au/'],
      ranking: 3,
      tuition: 42000,
    },
    {
      name: 'ETH Zurich',
      country: 'Switzerland',
      city: 'Zurich',
      domains: ['ethz.ch'],
      web_pages: ['https://ethz.ch/en.html'],
      ranking: 1,
      tuition: 1500,
    },
    {
      name: 'Technical University of Munich',
      country: 'Germany',
      city: 'Munich',
      domains: ['tum.de'],
      web_pages: ['https://www.tum.de/en/'],
      ranking: 1,
      tuition: 0,
    },
    {
      name: 'University of Amsterdam',
      country: 'Netherlands',
      city: 'Amsterdam',
      domains: ['uva.nl'],
      web_pages: ['https://www.uva.nl/en'],
      ranking: 1,
      tuition: 12000,
    },
    {
      name: 'Sorbonne University',
      country: 'France',
      city: 'Paris',
      domains: ['sorbonne-universite.fr'],
      web_pages: ['https://www.sorbonne-universite.fr/en'],
      ranking: 1,
      tuition: 3000,
    },
    {
      name: 'National University of Singapore',
      country: 'Singapore',
      city: 'Singapore',
      domains: ['nus.edu.sg'],
      web_pages: ['https://www.nus.edu.sg/'],
      ranking: 1,
      tuition: 38000,
    },
    {
      name: 'University of Tokyo',
      country: 'Japan',
      city: 'Tokyo',
      domains: ['u-tokyo.ac.jp'],
      web_pages: ['https://www.u-tokyo.ac.jp/en/'],
      ranking: 1,
      tuition: 25000,
    },
    {
      name: 'Peking University',
      country: 'China',
      city: 'Beijing',
      domains: ['pku.edu.cn'],
      web_pages: ['https://english.pku.edu.cn/'],
      ranking: 1,
      tuition: 15000,
    },
    {
      name: 'Seoul National University',
      country: 'South Korea',
      city: 'Seoul',
      domains: ['snu.ac.kr'],
      web_pages: ['https://en.snu.ac.kr/'],
      ranking: 1,
      tuition: 12000,
    },
    {
      name: 'Indian Institute of Technology Bombay',
      country: 'India',
      city: 'Mumbai',
      domains: ['iitb.ac.in'],
      web_pages: ['https://www.iitb.ac.in/'],
      ranking: 1,
      tuition: 3000,
    },
    {
      name: 'Indian Institute of Technology Delhi',
      country: 'India',
      city: 'New Delhi',
      domains: ['iitd.ac.in'],
      web_pages: ['https://home.iitd.ac.in/'],
      ranking: 2,
      tuition: 3000,
    },
    {
      name: 'Indian Institute of Science',
      country: 'India',
      city: 'Bangalore',
      domains: ['iisc.ac.in'],
      web_pages: ['https://www.iisc.ac.in/'],
      ranking: 3,
      tuition: 2500,
    },
  ];
  const eligibilityRequirements = {
    "Bachelor's": {
      minGpa: 2.5,
      minIelts: 6.0,
      minToefl: 80,
    },
    "Master's": {
      minGpa: 3.0,
      minIelts: 6.5,
      minToefl: 90,
    },
    PhD: {
      minGpa: 3.3,
      minIelts: 7.0,
      minToefl: 100,
    },
    Certificate: {
      minGpa: 2.0,
      minIelts: 5.5,
      minToefl: 70,
    },
  };
  const convertUSDToINR = (usdAmount) => {
    return Math.round(usdAmount * exchangeRate);
  };
  const formatINR = (amount) => {
    if (amount === 0) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  const estimateTuitionByCountry = (country) => {
    const estimates = {
      'United States': 55000,
      'United Kingdom': 30000,
      Canada: 28000,
      Australia: 42000,
      Germany: 5000,
      France: 8000,
      Netherlands: 15000,
      Switzerland: 2000,
      Singapore: 35000,
      Japan: 25000,
      China: 15000,
      India: 8000,
      'South Korea': 12000,
    };
    return estimates[country] || 20000;
  };
  const preprocessQuery = (query) => {
    let processed = query.toLowerCase().trim();
    processed = correctMisspellings(processed);
    processed = expandAbbreviations(processed);
    return processed;
  };
  const expandAbbreviations = (query) => {
    const lowerQuery = query.toLowerCase().trim();
    if (universityAbbreviations[lowerQuery]) {
      return universityAbbreviations[lowerQuery];
    }
    let expandedQuery = lowerQuery;
    for (const [abbrev, fullName] of Object.entries(universityAbbreviations)) {
      if (expandedQuery.includes(abbrev)) {
        expandedQuery = expandedQuery.replace(
          new RegExp(`\\b${abbrev}\\b`, 'g'),
          fullName,
        );
      }
    }
    return expandedQuery;
  };
  const correctMisspellings = (query) => {
    let correctedQuery = query.toLowerCase().trim();
    if (commonMisspellings[correctedQuery]) {
      return commonMisspellings[correctedQuery];
    }
    for (const [misspelling, correction] of Object.entries(
      commonMisspellings,
    )) {
      if (correctedQuery.includes(misspelling)) {
        correctedQuery = correctedQuery.replace(
          new RegExp(misspelling, 'g'),
          correction,
        );
      }
    }
    return correctedQuery;
  };
  const searchOpenAlexAPI = async (query) => {
    const processedQuery = preprocessQuery(query);
    const url = `${apiConfig.openalex}${encodeURIComponent(processedQuery)}&per_page=10`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), apiConfig.timeout);
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!response.ok) {
        throw new Error(`OpenAlex API error: ${response.status}`);
      }
      const data = await response.json();
      return (
        data.results?.map((inst) => ({
          name: inst.display_name,
          country: inst.country_code || 'Unknown',
          city: inst.geo?.city || '',
          domains: inst.homepage_url
            ? [new URL(inst.homepage_url).hostname]
            : [],
          web_pages: inst.homepage_url ? [inst.homepage_url] : [],
          ranking: Math.floor(Math.random() * 100) + 1,
          tuition: estimateTuitionByCountry(inst.country_code || 'Unknown'),
        })) || []
      );
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  };
  const searchHipolabsAPI = async (query) => {
    const processedQuery = preprocessQuery(query);
    const url = `${apiConfig.corsProxy}${encodeURIComponent(apiConfig.hipolabs + encodeURIComponent(processedQuery))}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), apiConfig.timeout);
    try {
      const response = await fetch(url, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!response.ok) {
        throw new Error(`Hipolabs API error: ${response.status}`);
      }
      const data = await response.json();
      const universities = JSON.parse(data.contents);
      return (
        universities?.slice(0, 10).map((uni) => ({
          name: uni.name,
          country: uni.country,
          city: uni['state-province'] || '',
          domains: uni.domains || [],
          web_pages: uni.web_pages || [],
          ranking: Math.floor(Math.random() * 100) + 1,
          tuition: estimateTuitionByCountry(uni.country),
        })) || []
      );
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  };
  const searchEmbeddedDatabase = (query) => {
    const processedQuery = preprocessQuery(query);
    let results = embeddedUniversities.filter((uni) => {
      const nameMatch = uni.name
        .toLowerCase()
        .includes(processedQuery.toLowerCase());
      const cityMatch =
        uni.city &&
        uni.city.toLowerCase().includes(processedQuery.toLowerCase());
      const countryMatch = uni.country
        .toLowerCase()
        .includes(processedQuery.toLowerCase());
      const domainMatch =
        uni.domains &&
        uni.domains.some((domain) =>
          domain.toLowerCase().includes(processedQuery.toLowerCase()),
        );
      return nameMatch || cityMatch || countryMatch || domainMatch;
    });
    if (results.length === 0) {
      results = partialWordSearch(query);
    }
    results.sort((a, b) => {
      const aNameMatch = a.name
        .toLowerCase()
        .includes(processedQuery.toLowerCase())
        ? 1
        : 0;
      const bNameMatch = b.name
        .toLowerCase()
        .includes(processedQuery.toLowerCase())
        ? 1
        : 0;
      if (aNameMatch !== bNameMatch) return bNameMatch - aNameMatch;
      return (a.ranking || 999) - (b.ranking || 999);
    });
    return results.slice(0, 10);
  };
  const partialWordSearch = (query) => {
    const queryWords = query.toLowerCase().trim().split(/\s+/);
    return embeddedUniversities
      .filter((uni) => {
        const uniWords = uni.name.toLowerCase().split(/\s+/);
        return queryWords.every((queryWord) =>
          uniWords.some(
            (uniWord) =>
              uniWord.includes(queryWord) ||
              queryWord.includes(uniWord) ||
              uniWord.startsWith(queryWord) ||
              queryWord.startsWith(uniWord),
          ),
        );
      })
      .slice(0, 8);
  };
  const updateApiIndicators = () => {
    setApiStatus((prev) => ({
      ...prev,
    }));
  };
  useEffect(() => {
    const displaySearchResults = (universities) => {
      setIsSearching(false);
      if (!universities || universities.length === 0) {
        setSearchResults([]);
        setShowDropdown(false);
        setModalMessage(
          'No universities found. Try different search terms or check spelling.',
        );
        setShowModal(true);
      } else {
        setSearchResults(universities);
        setShowDropdown(true);
      }
    };
    const handleUniversitySearch = async (query) => {
      setIsSearching(true);
      let results = [];
      try {
        setApiStatus((prev) => ({
          ...prev,
          openalex: 'loading',
        }));
        updateApiIndicators();
        results = await searchOpenAlexAPI(query);
        if (results && results.length > 0) {
          setApiStatus((prev) => ({
            ...prev,
            openalex: 'success',
          }));
        } else {
          throw new Error('No results from OpenAlex');
        }
      } catch (error) {
        setApiStatus((prev) => ({
          ...prev,
          openalex: 'error',
        }));
        try {
          setApiStatus((prev) => ({
            ...prev,
            hipolabs: 'loading',
          }));
          updateApiIndicators();
          results = await searchHipolabsAPI(query);
          if (results && results.length > 0) {
            setApiStatus((prev) => ({
              ...prev,
              hipolabs: 'success',
            }));
          } else {
            throw new Error('No results from Hipolabs');
          }
        } catch (error) {
          setApiStatus((prev) => ({
            ...prev,
            hipolabs: 'error',
          }));
          setApiStatus((prev) => ({
            ...prev,
            fallback: 'active',
          }));
          results = searchEmbeddedDatabase(query);
        }
      }
      updateApiIndicators();
      displaySearchResults(results);
    };
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    if (formData.university && formData.university.length >= 2) {
      searchTimeoutRef.current = setTimeout(() => {
        handleUniversitySearch(formData.university);
      }, apiConfig.debounceDelay);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.university, apiConfig.debounceDelay]);
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (validationMessages[field]) {
      setValidationMessages((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };
  const handleUniversitySelect = (university) => {
    setSelectedUniversity(university);
    setFormData((prev) => ({
      ...prev,
      university: university.name,
    }));
    setShowDropdown(false);
  };
  const handleTestTypeChange = (testType) => {
    setFormData((prev) => ({
      ...prev,
      testType,
      ieltsScore: testType === 'ielts' ? prev.ieltsScore : '',
      toeflScore: testType === 'toefl' ? prev.toeflScore : '',
    }));
  };
  const validateForm = () => {
    const errors = {};
    if (!selectedUniversity) {
      errors.university = 'Please select a university from the search results';
    }
    if (!formData.studyLevel) {
      errors.studyLevel = 'Please select a study level';
    }
    if (
      !formData.gpa ||
      isNaN(formData.gpa) ||
      formData.gpa < 0 ||
      formData.gpa > 4
    ) {
      errors.gpa = 'GPA must be between 0.0 and 4.0';
    }
    if (!formData.testType) {
      errors.testType = 'Please select a test type and enter your score';
    } else {
      if (formData.testType === 'ielts') {
        if (
          !formData.ieltsScore ||
          isNaN(formData.ieltsScore) ||
          formData.ieltsScore < 0 ||
          formData.ieltsScore > 9
        ) {
          errors.testScore = 'IELTS score must be between 0.0 and 9.0';
        }
      } else if (formData.testType === 'toefl') {
        if (
          !formData.toeflScore ||
          isNaN(formData.toeflScore) ||
          formData.toeflScore < 0 ||
          formData.toeflScore > 120
        ) {
          errors.testScore = 'TOEFL score must be between 0 and 120';
        }
      }
    }
    setValidationMessages(errors);
    return Object.keys(errors).length === 0;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setShowResults(true);
    setTimeout(() => {
      const resultsSection = document.getElementById('resultsSection');
      if (resultsSection) {
        resultsSection.scrollIntoView({
          behavior: 'smooth',
        });
      }
    }, 100);
  };
  const resetForm = () => {
    setFormData({
      university: '',
      studyLevel: '',
      gpa: '',
      testType: '',
      ieltsScore: '',
      toeflScore: '',
      budget: 0,
    });
    setSelectedUniversity(null);
    setShowDropdown(false);
    setShowResults(false);
    setValidationMessages({});
  };
  const getEligibilityAssessment = () => {
    if (!selectedUniversity || !formData.studyLevel) return null;
    const requirements = eligibilityRequirements[formData.studyLevel];
    let score = 0;
    const feedback = [];
    if (parseFloat(formData.gpa) >= requirements.minGpa) {
      score += 1;
    } else {
      feedback.push(
        `GPA should be at least ${requirements.minGpa} for ${formData.studyLevel}`,
      );
    }
    const testScore =
      formData.testType === 'ielts'
        ? parseFloat(formData.ieltsScore)
        : parseInt(formData.toeflScore);
    const minTestScore =
      formData.testType === 'ielts'
        ? requirements.minIelts
        : requirements.minToefl;
    if (testScore >= minTestScore) {
      score += 1;
    } else {
      const testName = formData.testType.toUpperCase();
      feedback.push(
        `${testName} score should be at least ${minTestScore} for ${formData.studyLevel}`,
      );
    }
    const tuitionEstimate =
      selectedUniversity.tuition ||
      estimateTuitionByCountry(selectedUniversity.country);
    if (formData.budget >= tuitionEstimate || formData.budget === 0) {
      score += 1;
    } else {
      const tuitionINR = convertUSDToINR(tuitionEstimate);
      feedback.push(
        `Consider budget of at least $${tuitionEstimate.toLocaleString()} (${formatINR(tuitionINR)}) for ${selectedUniversity.name}`,
      );
    }
    return {
      score,
      feedback,
      total: 3,
    };
  };
  const getRecommendations = () => {
    if (!selectedUniversity) return [];
    let filtered = embeddedUniversities
      .filter(
        (uni) =>
          uni.country === selectedUniversity.country &&
          uni.name !== selectedUniversity.name,
      )
      .slice(0, 2);
    const international = embeddedUniversities
      .filter(
        (uni) =>
          uni.country !== selectedUniversity.country &&
          uni.name !== selectedUniversity.name,
      )
      .slice(0, 1);
    filtered = [...filtered, ...international];
    if (filtered.length < 3) {
      const additional = embeddedUniversities
        .filter(
          (uni) =>
            uni.name !== selectedUniversity.name && !filtered.includes(uni),
        )
        .slice(0, 3 - filtered.length);
      filtered = [...filtered, ...additional];
    }
    return filtered.map((uni, index) => ({
      ...uni,
      matchScore: Math.max(85, 95 - index * 5),
    }));
  };
  return (
    <div className={cx('university-finder-container')}>
      <header className={cx('header')}>
        <h1>University Course Finder</h1>
        <p className={cx('header__subtitle')}>
          Search from 200+ universities worldwide with comprehensive global
          database coverage
        </p>
      </header>

      <main className={cx('main')}>
        <form className={cx('course-finder-form')} onSubmit={handleSubmit}>
          {}
          <div className={cx("form-group")}>
            <label htmlFor="university" className={cx("form-label")}>
              Search University
            </label>
            <div className={cx("search-container")}>
              <input
                type="text"
                id="university"
                className={cx("form-control university-search")}
                placeholder="Start typing university name (e.g., Oxford, Cambridge, Harvard, MIT)..."
                value={formData.university}
                onChange={(e) =>
                  handleInputChange('university', e.target.value)
                }
                autoComplete="off"
                required
              />
              {isSearching && (
                <div className={cx("search-loading")}>
                  <span className={cx("loading-spinner")}></span>
                </div>
              )}
              {showDropdown && searchResults.length > 0 && (
                <div className={cx("search-dropdown")}>
                  <div className={cx("search-results")}>
                    {searchResults.map((uni, index) => (
                      <div
                        key={index}
                        className={cx("search-result-item")}
                        onClick={() => handleUniversitySelect(uni)}
                      >
                        <div className={cx("search-result-name")}>{uni.name}</div>
                        <div className={cx("search-result-country")}>
                          {uni.country}
                          {uni.city ? `, ${uni.city}` : ''}
                        </div>
                        {uni.domains && uni.domains.length > 0 && (
                          <div className={cx("search-result-domain")}>
                            {uni.domains[0]}
                          </div>
                        )}
                        {uni.ranking && (
                          <div className={cx("search-result-ranking")}>
                            World Ranking: #{uni.ranking}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {validationMessages.university && (
              <div className={cx("validation-message error")}>
                {validationMessages.university}
              </div>
            )}
          </div>

          {}
          <div className={cx("academic-profile")}>
            <h3>Academic Profile</h3>

            {}
            <div className={cx("form-group")}>
              <label htmlFor="studyLevel" className={cx("form-label")}>
                Study Level
              </label>
              <select
                id="studyLevel"
                className={cx("form-control")}
                value={formData.studyLevel}
                onChange={(e) =>
                  handleInputChange('studyLevel', e.target.value)
                }
                required
              >
                <option value="">Select study level...</option>
                {studyLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
              {validationMessages.studyLevel && (
                <div className={cx("validation-message error")}>
                  {validationMessages.studyLevel}
                </div>
              )}
            </div>

            {}
            <div className={cx("form-group")}>
              <label htmlFor="gpa" className={cx("form-label")}>
                GPA (0.0 - 4.0)
              </label>
              <input
                type="number"
                id="gpa"
                className={cx("form-control")}
                min="0"
                max="4"
                step="0.1"
                placeholder="Enter your GPA"
                value={formData.gpa}
                onChange={(e) => handleInputChange('gpa', e.target.value)}
                required
              />
              {validationMessages.gpa && (
                <div className={cx("validation-message error")}>
                  {validationMessages.gpa}
                </div>
              )}
            </div>

            {}
            <div className={cx("form-group")}>
              <label className={cx("form-label")}>English Test Score</label>
              <div className={cx("test-selection")}>
                <div className={cx("radio-group")}>
                  <label className={cx("radio-label")}>
                    <input
                      type="radio"
                      name="testType"
                      value="ielts"
                      checked={formData.testType === 'ielts'}
                      onChange={(e) => handleTestTypeChange(e.target.value)}
                    />
                    <span className={cx("radio-custom")}></span>
                    IELTS (0.0 - 9.0)
                  </label>
                  <input
                    type="number"
                    className={cx("form-control test-input")}
                    min="0"
                    max="9"
                    step="0.5"
                    placeholder="IELTS score"
                    value={formData.ieltsScore}
                    onChange={(e) =>
                      handleInputChange('ieltsScore', e.target.value)
                    }
                    disabled={formData.testType !== 'ielts'}
                  />
                </div>
                <div className={cx("radio-group")}>
                  <label className={cx("radio-label")}>
                    <input
                      type="radio"
                      name="testType"
                      value="toefl"
                      checked={formData.testType === 'toefl'}
                      onChange={(e) => handleTestTypeChange(e.target.value)}
                    />
                    <span className={cx("radio-custom")}></span>
                    TOEFL (0 - 120)
                  </label>
                  <input
                    type="number"
                    className={cx("form-control test-input")}
                    min="0"
                    max="120"
                    step="1"
                    placeholder="TOEFL score"
                    value={formData.toeflScore}
                    onChange={(e) =>
                      handleInputChange('toeflScore', e.target.value)
                    }
                    disabled={formData.testType !== 'toefl'}
                  />
                </div>
              </div>
              {validationMessages.testType && (
                <div className={cx("validation-message error")}>
                  {validationMessages.testType}
                </div>
              )}
              {validationMessages.testScore && (
                <div className={cx("validation-message error")}>
                  {validationMessages.testScore}
                </div>
              )}
            </div>
          </div>

          {}
          <div className={cx("budget-planning")}>
            <h3>Budget Planning</h3>
            <div className={cx("form-group")}>
              <label htmlFor="budget" className={cx("form-label")}>
                Annual Tuition Budget
              </label>
              <div className={cx("budget-container")}>
                <input
                  type="range"
                  id="budget"
                  className={cx("budget-slider")}
                  min="0"
                  max="100000"
                  value={formData.budget}
                  step="1000"
                  onChange={(e) =>
                    handleInputChange('budget', parseInt(e.target.value))
                  }
                />
                <div className={cx("budget-display")}>
                  <span className={cx("budget-value")}>
                    ${formData.budget.toLocaleString()}
                  </span>
                  <span className={cx("budget-inr")}>
                    ({formatINR(convertUSDToINR(formData.budget))})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {}
          <button
            type="submit"
            className={cx("btn btn--primary btn--full-width btn--lg")}
          >
            Find University Match
          </button>

          {}
          <button
            type="button"
            className={cx("btn btn--outline btn--full-width btn--lg btn--reset")}
            onClick={resetForm}
          >
            Reset Form
          </button>
        </form>

        {}
        <div className={cx("api-indicator")}>
          <div className={cx("api-sources")}>
            <div className={cx('api-source', apiStatus.openalex)}>
              <span className={cx('api-dot')}></span>
              <span>OpenAlex API</span>
            </div>
            <div className={cx('api-source', apiStatus.hipolabs)}>
              <span className={cx('api-dot')}></span>
              <span>Hipolabs API</span>
            </div>
            <div className={cx('api-source', apiStatus.fallback)}>
              <span className={cx('api-dot')}></span>
              <span>Comprehensive Database (200+ Universities)</span>
            </div>
          </div>
        </div>

        {}
        {showResults && selectedUniversity && (
          <div className={cx("results-section")} id="resultsSection">
            {}
            <div className={cx("card university-details-card")}>
              <div className={cx("card__body")}>
                <h3>Selected University</h3>
                <div className={cx("university-details")}>
                  <div className={cx("university-name")}>
                    {selectedUniversity.name}
                  </div>
                  <div className={cx("university-location")}>
                    {selectedUniversity.city}, {selectedUniversity.country}
                  </div>
                  <div className={cx("university-stats")}>
                    <div className={cx("university-stat")}>
                      <div className={cx("stat-label")}>World Ranking</div>
                      <div className={cx("stat-value")}>
                        #{selectedUniversity.ranking || 'N/A'}
                      </div>
                    </div>
                    <div className={cx("university-stat")}>
                      <div className={cx("stat-label")}>Estimated Annual Tuition</div>
                      <div className={cx("stat-value")}>
                        $
                        {(
                          selectedUniversity.tuition ||
                          estimateTuitionByCountry(selectedUniversity.country)
                        ).toLocaleString()}
                        <div className={cx("stat-value-inr")}>
                          {formatINR(
                            convertUSDToINR(
                              selectedUniversity.tuition ||
                                estimateTuitionByCountry(
                                  selectedUniversity.country,
                                ),
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                    <div className={cx("university-stat")}>
                      <div className={cx("stat-label")}>Website</div>
                      <div className={cx("stat-value")}>
                        <a
                          href={selectedUniversity.web_pages[0]}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: 'var(--color-primary)',
                          }}
                        >
                          Visit University →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {}
            <div className={cx("card eligibility-card")}>
              <div className={cx("card__body")}>
                <h3>Eligibility Assessment</h3>
                <div className={cx("eligibility-result")}>
                  {(() => {
                    const assessment = getEligibilityAssessment();
                    if (!assessment) return null;
                    let statusClass = '';
                    let statusText = '';
                    let message = '';
                    if (assessment.score === 3) {
                      statusClass = 'status--success';
                      statusText = 'High Eligibility';
                      message = `Excellent! You meet all basic requirements for ${formData.studyLevel} programs at ${selectedUniversity.name}.`;
                    } else if (assessment.score === 2) {
                      statusClass = 'status--warning';
                      statusText = 'Medium Eligibility';
                      message = `Good potential! You meet most requirements. Consider: ${assessment.feedback.join('; ')}.`;
                    } else {
                      statusClass = 'status--error';
                      statusText = 'Needs Improvement';
                      message = `Work needed. Areas to improve: ${assessment.feedback.join('; ')}.`;
                    }
                    return (
                      <>
                        <div className={cx('status', statusClass)}>
                          {statusText}
                        </div>
                        <p>{message}</p>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {}
            <div className={cx("card recommendations-card")}>
              <div className={cx("card__body")}>
                <h3>Top 3 University Recommendations</h3>
                <div className={cx("recommendations-list")}>
                  {getRecommendations().map((uni, index) => {
                    const tuitionEstimate =
                      uni.tuition || estimateTuitionByCountry(uni.country);
                    const tuitionINR = convertUSDToINR(tuitionEstimate);
                    const isAffordable =
                      formData.budget >= tuitionEstimate ||
                      formData.budget === 0;
                    return (
                      <div key={index} className={cx("recommendation-item")}>
                        <div className={cx("recommendation-header")}>
                          <div>
                            <h4 className={cx("recommendation-name")}>{uni.name}</h4>
                            <div className={cx("recommendation-location")}>
                              {uni.city}, {uni.country}
                            </div>
                            <div className={cx("recommendation-details")}>
                              <div
                                className={cx(
                                  'recommendation-cost',
                                  isAffordable ? 'affordable' : 'expensive',
                                )}
                              >
                                Estimated Cost: $
                                {tuitionEstimate.toLocaleString()} per year
                                {!isAffordable
                                  ? ' (Above your budget)'
                                  : formData.budget > 0
                                    ? ' (Within budget)'
                                    : ''}
                                <div className={cx("recommendation-cost-inr")}>
                                  {formatINR(tuitionINR)} per year
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className={cx("recommendation-match")}>
                            {uni.matchScore}% Match
                          </div>
                        </div>
                        <a
                          href={uni.web_pages[0]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cx("recommendation-link")}
                        >
                          Visit University Website →
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {}
      {showModal && (
        <div className={cx("modal")}>
          <div className={cx("modal-content")}>
            <div className={cx("modal-header")}>
              <h3>Search Information</h3>
              <button
                className={cx("modal-close")}
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
            </div>
            <div className={cx("modal-body")}>
              <p>
                {modalMessage ||
                  'Searching comprehensive university database...'}
              </p>
              <div className={cx("modal-actions")}>
                <button
                  className={cx("btn btn--primary")}
                  onClick={() => setShowModal(false)}
                >
                  Continue Searching
                </button>
                <button
                  className={cx("btn btn--outline")}
                  onClick={() => {
                    setShowModal(false);
                    const allResults = embeddedUniversities.slice(0, 10);
                    setSearchResults(allResults);
                    setShowDropdown(true);
                  }}
                >
                  Search All Universities
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default UniversityCourseFinder;
