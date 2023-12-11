import { useState, useEffect } from "react";
import axiosClient from "../client/axios-client";

function useSearch() {
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get("/search");
        setOriginalData(response.data.result);
        setFilteredData(response.data.result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to fetch data only once

  useEffect(() => {
    const handleFilter = () => {
      const newFilter = originalData.filter((value) => {
        const itemName = value.item_name || ''; // Ensure item_name is a string
        const lowerCaseItemName = itemName.toString().toLowerCase();
        return lowerCaseItemName.includes(wordEntered.toString().toLowerCase());
      });
      setFilteredData(newFilter);
    };
  
    handleFilter();
  }, [wordEntered, originalData]);
    

  return { filteredData, handleFilter: setWordEntered };
}

export default useSearch;
