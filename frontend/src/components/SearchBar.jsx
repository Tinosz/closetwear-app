import React, { useState, useEffect } from "react";
import axiosClient from "../client/axios-client";

function SearchBar({ placeholder }) {
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    axiosClient
      .get("/search")
      .then((response) => {
        setData(response.data.result);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);

    const newFilter = data.filter((value) => {
      return value.item_name.toLowerCase().includes(searchWord.toLowerCase());
    });

    setFilteredData(newFilter);
  };

  return (
    <div>
      <input
        type="text"
        id="searchInput"
        name="searchInput"
        placeholder={placeholder}
        className="form-controll form-input"
        value={wordEntered}
        onChange={handleFilter}
      />

      <span>
        <i></i>
      </span>

      {filteredData.length !== 0 && wordEntered !== "" && (
        <div className="dataResult">
          {filteredData.slice(0, 15).map((value, index) => {
            return (
              <div className="" key={index}>
                <div className="">
                  <span>{value.item_name}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
