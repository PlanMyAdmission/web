'use client';

import React, { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { trackContentClick } from '@/lib/analytics/events.js';
import { reportError } from '@/lib/observability/logger.js';
import fetchFilteredDocs from '@/components/explore-university/filtered-response/fetchFilteredDocs.js';
import {
  FilteredResponseEmptyState,
  FilteredResponseLoadingState,
} from '@/components/explore-university/filtered-response/FilteredResponseStates.jsx';
import FilteredResponseContent from '@/components/explore-university/filtered-response/FilteredResponseContent.jsx';

const arrayUniqueByField = (items, fieldName) =>
  items.filter(
    (item, index, list) =>
      index ===
      list.findIndex(
        (candidate) => candidate?.[fieldName] === item?.[fieldName],
      ),
  );

const FilteredResponse = ({ props }) => {
  const router = useRouter();
  const docs = [];
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [sortByRank, setSortByRank] = useState(false);

  const uniqueDocs = useMemo(() => arrayUniqueByField(docs, 'id'), [docs]);

  const countries = useMemo(
    () => [...new Set(uniqueDocs.map((item) => item?.Country).filter(Boolean))],
    [uniqueDocs],
  );

  const uniqueUniversities = useMemo(
    () => [
      ...new Set(uniqueDocs.map((item) => item?.UniversityId).filter(Boolean)),
    ],
    [uniqueDocs],
  );

  const filteredDocs = useMemo(() => {
    const byCountry = selectedCountries.length
      ? uniqueDocs.filter((item) => selectedCountries.includes(item?.Country))
      : uniqueDocs;

    const sortedDocs = [...byCountry];
    if (sortByRank) {
      sortedDocs.sort(
        (a, b) => (b?.UniversityOrder || 0) - (a?.UniversityOrder || 0),
      );
    }
    return sortedDocs;
  }, [selectedCountries, sortByRank, uniqueDocs]);

  const handleAddCountry = (value) => {
    if (!value) {
      toast.warning('Please select a valid option', {
        className: 'foo-bar',
        autoClose: 1000,
      });
      return;
    }

    if (selectedCountries.includes(value)) {
      toast.error('Already Selected', {
        className: 'foo-bar',
        autoClose: 1000,
      });
      return;
    }

    setSelectedCountries((prev) => [...prev, value]);
  };

  const handleEnroll = (data) => {
    if (!data?.recordId) {
      return;
    }

    trackContentClick({
      contentType: 'explore_program',
      slug: data.recordId,
      location: 'explore_results',
    });
    router.push(`/explore/university/${data.recordId}`);
  };

  if (filteredDocs.length === 0 || countries.length === 0) {
    return <FilteredResponseEmptyState />;
  }

  return (
    <FilteredResponseContent
      docs={docs}
      countries={countries}
      uniqueUniversities={uniqueUniversities}
      sortByRank={sortByRank}
      setSortByRank={setSortByRank}
      handleAddCountry={handleAddCountry}
      selectedCountries={selectedCountries}
      setSelectedCountries={setSelectedCountries}
      filteredDocs={filteredDocs}
      visibleCount={visibleCount}
      setVisibleCount={setVisibleCount}
      imageByUniversityId={{}}
      handleEnroll={handleEnroll}
    />
  );
};

export default FilteredResponse;
