// SearchBar.jsx
import React from "react";

function SearchBar({ placeholder, value, onFilter, onInputChange }) {
  return (
    <div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onInputChange(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;
