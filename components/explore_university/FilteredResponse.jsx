'use client';

import React, { useEffect, useMemo, useState } from 'react';
import app from '@lib/firebase.js';
import { collection, getFirestore } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { reportError } from '@lib/logger.js';
import fetchFilteredDocs from '@/components/explore_university/filteredResponse/fetchFilteredDocs.js';
import {
  FilteredResponseEmptyState,
  FilteredResponseLoadingState,
} from '@/components/explore_university/filteredResponse/FilteredResponseStates.jsx';
import FilteredResponseContent from '@/components/explore_university/filteredResponse/FilteredResponseContent.jsx';

const arrayUniqueByField = (items, fieldName) =>
  items.filter(
    (item, index, list) =>
      index === list.findIndex((candidate) => candidate?.[fieldName] === item?.[fieldName]),
  );

const FilteredResponse = ({ props }) => {
  const db = getFirestore(app);
  const storage = getStorage();
  const router = useRouter();
  const [docs, setDocs] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [sortByRank, setSortByRank] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [imageByUniversityId, setImageByUniversityId] = useState({});

  const docref = useMemo(() => collection(db, 'explore_university'), [db]);

  useEffect(() => {
    let isCancelled = false;
    const timer = setTimeout(() => {
      if (!isCancelled) {
        setShowLoader(false);
      }
    }, 8000);

    const load = async () => {
      setDocs([]);
      setVisibleCount(10);
      setSelectedCountries([]);
      setSortByRank(false);
      setImageByUniversityId({});
      setShowLoader(true);

      try {
        const snapshotDocs = await fetchFilteredDocs({
          docref,
          intake: props.intake,
          country: props.country,
          duration: props.duration,
          level: props.level,
          course: props.course,
        });

        if (!isCancelled) {
          setDocs(
            snapshotDocs.map((snapDoc) => ({
              recordId: snapDoc.id,
              ...snapDoc.data(),
            })),
          );
          setShowLoader(false);
        }
      } catch (error) {
        reportError('Failed to fetch explore university docs', error);
        if (!isCancelled) {
          setShowLoader(false);
        }
      }
    };

    load();
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [docref, props.country, props.course, props.duration, props.intake, props.level]);

  const uniqueDocs = useMemo(() => arrayUniqueByField(docs, 'id'), [docs]);

  const countries = useMemo(
    () => [...new Set(uniqueDocs.map((item) => item?.Country).filter(Boolean))],
    [uniqueDocs],
  );

  const uniqueUniversities = useMemo(
    () => [...new Set(uniqueDocs.map((item) => item?.UniversityId).filter(Boolean))],
    [uniqueDocs],
  );

  useEffect(() => {
    if (!uniqueUniversities.length) return;
    let isCancelled = false;

    const loadImages = async () => {
      const entries = await Promise.all(
        uniqueUniversities.map(async (universityId) => {
          try {
            const fileRef = ref(storage, `logos/${universityId}.png`);
            const imageUrl = await getDownloadURL(fileRef);
            return [universityId, imageUrl];
          } catch (_error) {
            return [universityId, ''];
          }
        }),
      );

      if (!isCancelled) {
        setImageByUniversityId(Object.fromEntries(entries));
      }
    };

    loadImages();
    return () => {
      isCancelled = true;
    };
  }, [storage, uniqueUniversities]);

  const filteredDocs = useMemo(() => {
    const byCountry = selectedCountries.length
      ? uniqueDocs.filter((item) => selectedCountries.includes(item?.Country))
      : uniqueDocs;

    const sortedDocs = [...byCountry];
    if (sortByRank) {
      sortedDocs.sort((a, b) => (b?.UniversityOrder || 0) - (a?.UniversityOrder || 0));
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

    router.push(`/explore/university/${data.recordId}`);
  };

  if (filteredDocs.length === 0 || countries.length === 0) {
    if (showLoader) return <FilteredResponseLoadingState />;
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
      imageByUniversityId={imageByUniversityId}
      handleEnroll={handleEnroll}
    />
  );
};

export default FilteredResponse;
