// ItemList.jsx
import React, { useEffect, useState } from "react";
import axiosClient from "../client/axios-client";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import SearchBar from "../components/SearchBar"; // Import the SearchBar component
import useSearch from "./useSearch";
import { useStateContext } from "../context/ContextProvider";

export default function ItemList() {
  const { notification } = useStateContext();
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [pagination, setPagination] = useState({});
  const { filteredData, handleFilter } = useSearch();
  const [filteredItems, setFilteredItems] = useState([]);

  const handleEditClick = async (item) => {
    try {
      await axiosClient.post(`/items/${item.id}/increment-click`);
      window.location.href = `/Admin/EditItem/${item.id}`;
    } catch (error) {
      console.error("Error incrementing item click count:", error);
    }
  };

  const getItems = (page = 1) => {
    axiosClient.get(`itemsPaginated?page=${page}`).then((response) => {
      console.log(response.data);
      setItems(response.data.data);
      setPagination(response.data);
    });
  };

  useEffect(() => {
    getItems();
  }, []);

  useEffect(() => {
    setFilteredItems(filteredData);
  }, [filteredData]);

  const onDelete = (item) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    axiosClient.delete(`/items/${item.id}`).then(() => {
      getItems();
    });
  };

  const toggleItemSelection = (itemId) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(itemId)
        ? prevSelected.filter((id) => id !== itemId)
        : [...prevSelected, itemId]
    );
  };

  const onMultipleDelete = () => {
    if (!window.confirm("Are you sure you want to delete the selected items?")) {
      return;
    }

    axiosClient
      .delete("/items/delete-multiple", {
        data: { itemIds: selectedItems },
      })
      .then(() => {
        getItems();
        setSelectedItems([]);
      });
  };

  const onPageChange = (label) => {
    let page;
    switch (label) {
      case "Next &raquo;":
        page = pagination.current_page + 1;
        break;
      case "&laquo; Previous":
        page = pagination.current_page - 1;
        break;
      default:
        page = parseInt(label);
        break;
    }
    getItems(page);
  };

  return (
    <>
      {notification && <div>{notification}</div>}
      <div>
        <br /><br /><br /><br />
        <button
          onClick={onMultipleDelete}
          disabled={selectedItems.length === 0}
          style={{ opacity: selectedItems.length === 0 ? 0.5 : 1 }}
        >
          Delete Selected
        </button>
      </div>
      <div>
        <Link to="/Admin/EditItem">Add Item</Link>
      </div>
      <SearchBar placeholder="Search..." onFilter={handleFilter} />
      <h2>Item List:</h2>
      <br />
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Item Name</th>
            <th>Images</th>
            <th>Price</th>
            <th>Categories</th>
            <th>Available Stock?</th>
            <th>Item Clicks</th>
            <th>Item Link Clicks</th>
            <th>Edit</th>
            <th>Delete</th>
            <th>Multiple Deletion</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => {
              const featuredCategories = [];
              const nonFeaturedCategories = [];
              
              (item.categories ?? []).forEach((category) => {
                if (category.featured === 1) {
                  featuredCategories.push(category);
                } else {
                  nonFeaturedCategories.push(category);
                }
              });
              

              const allCategories = featuredCategories.concat(
                nonFeaturedCategories
              );

              return (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.item_name}</td>
                  <td>
                  { (item.images ?? [])
                    .sort((a, b) => a.item_image_order - b.item_image_order)
                    .map((image, imgIndex) => (
                        <span key={imgIndex}>
                        <img
                            className="w-20"
                            src={`${import.meta.env.VITE_API_BASE_URL}/storage/${image.item_image}`}
                            alt={`Image ${imgIndex + 1}`}
                        />
                        </span>
                    ))
                    }

                  </td>
                  <td>{item.item_price}</td>
                  <td>
                    <ul>
                      {allCategories
                        .filter((category) => category.id !== 1)
                        .map((category, catIndex) => (
                          <li key={catIndex}>
                            {category.category_name}
                            {category.featured === 1 && (
                              <FontAwesomeIcon icon={faStar} />
                            )}
                          </li>
                        ))}
                    </ul>
                  </td>
                  <td>{parseInt(item.available_stock) === 1 ? "Yes" : "No"}</td>
                  <td>{item.item_click}</td>
                  <td>{item.item_link_click}</td>
                  <td>
                    <Link to="#" onClick={() => handleEditClick(item)}>
                      Edit
                    </Link>
                  </td>
                  <td>
                    <button onClick={(e) => onDelete(item)}>Delete</button>
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleItemSelection(item.id)}
                    />
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="7">No Items available</td>
            </tr>
          )}
        </tbody>
      </table>
      <div>
        {pagination.links && (
          <ul className="pagination">
            {pagination.links.map((link, index) => (
              <li
                key={index}
                className={`page-item ${link.active ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => onPageChange(link.label)}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
