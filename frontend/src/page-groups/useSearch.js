//useSearch.js
import { useState, useEffect } from "react";
import axiosClient from "../client/axios-client";

function useSearch() {
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");

  useEffect(() => {
    // Fetch data from the Laravel API endpoint
    axiosClient
      .get("/search")
      .then((response) => {
        // Assuming your data structure is { result: [...] }
        setOriginalData(response.data.result);
        setFilteredData(response.data.result);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleFilter = (searchWord) => {
    setWordEntered(searchWord);

    const newFilter = originalData.filter((value) => {
      return value.item_name.toLowerCase().includes(searchWord.toLowerCase());
    });

    setFilteredData(newFilter);
  };

  return { filteredData, handleFilter };
}

export default useSearch;
