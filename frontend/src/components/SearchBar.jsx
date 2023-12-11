// SearchBar.jsx
import React from "react";

function SearchBar({ placeholder, onFilter }) {
  return (
    <div>
      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => onFilter(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;
