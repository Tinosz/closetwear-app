import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import "./styles/SearchBar.css";

function SearchBar({ placeholder, value, onFilter, onInputChange }) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    if (!value) {
      setIsFocused(false);
    }
  };

  const clearInput = () => {
    const input = document.getElementsByTagName("input")[0];
    input.value = "";
  };

  return (
    <div className={`search-box ${isFocused || value ? 'focused' : ''}`}>
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onInputChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <button className="search-clear" onClick={clearInput}>
        Clear
      </button>
      <i className="fa"><FontAwesomeIcon icon={faSearch} /></i>
    </div>
  );
}

export default SearchBar;
