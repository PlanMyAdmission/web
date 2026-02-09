import React from "react";

const SearchHeader = ({ courseQuery, onQueryChange, onSearch }) => {
  return (
    <div className="pma-uni-search-bar">
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
