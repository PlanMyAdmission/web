'use client';

import React from 'react';
import uniStyles from '@/components/ai-university-search/AIUniversitySearch.module.css';
const cx = (...classNames) =>
  classNames
    .flatMap((value) => `${value || ''}`.split(/\s+/))
    .map((name) => uniStyles[name])
    .filter(Boolean)
    .join(' ');
const SearchHeader = ({ courseQuery, onQueryChange, onSearch }) => {
  return (
    <div className={cx('pma-uni-search-bar')}>
      <input
        type="text"
        placeholder="Search a course or program (e.g., MS in Data Science)"
        value={courseQuery}
        onChange={(event) => onQueryChange(event.target.value)}
      />
      <button type="button" onClick={onSearch}>
        Search
      </button>
    </div>
  );
};
export default SearchHeader;
