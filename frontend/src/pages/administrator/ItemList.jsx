// ItemList.jsx
import React, { useEffect, useState } from "react";
import axiosClient from "../../client/axios-client";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import SearchBar from "../../components/SearchBarSuggest";
import useSearch from "../../page-groups/useSearch";
import { useStateContext } from "../../context/ContextProvider";

import "./styles/ItemListStyles.css";
import ItemListRow from "./ItemListRow";

export default function ItemList() {
    const { notification } = useStateContext();
    const [items, setItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [pagination, setPagination] = useState({});
    const { filteredData, handleFilter } = useSearch();
    const [searchWord, setSearchWord] = useState("");

    useEffect(() => {
        handleFilter(searchWord);
    }, [searchWord, handleFilter]);


    const handleEditClick = async (item) => {
        try {
            // await axiosClient.post(`/items/${item.id}/increment-click`);
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

    const onDelete = (item) => {
        if (!window.confirm("Are you sure you want to delete this item?")) {
            return;
        }

        axiosClient.delete(`/items/${item.id}`).then(() => {
            getItems();
            window.location.reload();
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
        if (
            !window.confirm(
                "Are you sure you want to delete the selected items?"
            )
        ) {
            return;
        }

        axiosClient
            .delete("/items/delete-multiple", {
                data: { itemIds: selectedItems },
            })
            .then(() => {
                getItems();
                setSelectedItems([]);
                window.location.reload();
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

    const parallaxBg = document.querySelector(".parallax-bg");

    window.addEventListener("scroll", () => {
        const scrollPosition = window.scrollY;
        parallaxBg.style.transform = `translate3d(0, ${
            scrollPosition * 1
        }px, 0)`;
    });

    return (
        <>
            <div className="parallax-bg"></div>
            <div className="overlay"></div>
            <div className="list-wrap">
                <SearchBar
                    placeholder="Search"
                    value={searchWord}
                    onInputChange={(value) => setSearchWord(value)}
                />
                <div className="edit-list-button">
                    <Link to="/Admin/EditItem">
                        <button className="bot-button">Add Item</button>
                    </Link>
                </div>
                <div className="edit-list-button">
                    <button
                        onClick={onMultipleDelete}
                        className="bot-button"
                        disabled={selectedItems.length === 0}
                        style={{
                            opacity: selectedItems.length === 0 ? 0.5 : 1,
                        }}
                    >
                        Delete Selected
                    </button>
                </div>

                <div className="list-content-wrap min-h-screen">
                    {notification && (
                        <div className="z-10 fixed bottom-8 right-8 p-4 bg-green-200 text-green-600 border-2 border-green-500 rounded-md">
                            {notification}
                        </div>
                    )}

                    <h2
                        className="text-white"
                        style={{ fontSize: "32px", fontWeight: "bold" }}
                    >
                        Item List:
                    </h2>

                    <br />

                    <div className="form-container relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-center rtl:text-right text-white-500 dark:text-white-400 border border-black il-table table-auto">
                            <thead className="text-xs text-white-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-white-400">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 border border-2 border-black"
                                    >
                                        No.
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 border border-2 border-black w-32"
                                    >
                                        Item Name
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 border border-2 border-black"
                                    >
                                        Images
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 border border-2 border-black"
                                    >
                                        Price
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 border border-2 border-black"
                                    >
                                        Categories
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 border border-2 border-black"
                                    >
                                        Available Stock?
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 border border-2 border-black"
                                    >
                                        Item Clicks
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 border border-2 border-black"
                                    >
                                        Item Link Clicks
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 border border-2 border-black"
                                    >
                                        Edit
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 border border-2 border-black"
                                    >
                                        Delete
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 border border-2 border-black"
                                    >
                                        Select{" "}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {searchWord === ""
                                    ? items.map((item, index) => (
                                          <ItemListRow
                                              item={item}
                                              index={index}
                                              onDelete={onDelete}
                                              handleEditClick={handleEditClick}
                                              toggleItemSelection={
                                                  toggleItemSelection
                                              }
                                              selectedItems={selectedItems}
                                          />
                                      ))
                                    : filteredData.map((item, index) => (
                                        <ItemListRow
                                            item={item}
                                            index={index}
                                            onDelete={onDelete}
                                            handleEditClick={handleEditClick}
                                            toggleItemSelection={toggleItemSelection}
                                            selectedItems={selectedItems}
                                        />
                                    ))
                                    }
                                    
                                {/* {filteredItems.length > 0 ? (
                                    filteredItems.map((item, index) => (
                                        <ItemListRow
                                            item={item}
                                            index={index}
                                            onDelete={onDelete}
                                            handleEditClick={handleEditClick}
                                            toggleItemSelection={
                                                toggleItemSelection
                                            }
                                            selectedItems={selectedItems}
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            className="px-6 py-4 border border-2 border-black"
                                            colSpan="11"
                                        >
                                            No Items available
                                        </td>
                                    </tr>
                                )} */}
                            </tbody>
                        </table>
                    </div>

                    <div className="edit-list-button-wrap justify-center">
                        <div className="edit-list-np">
                            {pagination.links && (
                                <ul className="pagination flex justify-center">
                                    {pagination.links.map((link, index) => (
                                        <li
                                            key={index}
                                            className={`page-item ${
                                                link.active ? "active" : ""
                                            }`}
                                        >
                                            <button
                                                className="page-link bot-button"
                                                onClick={() =>
                                                    onPageChange(link.label)
                                                }
                                                disabled={
                                                    link.label === "Previous" &&
                                                    !pagination.prevPageAvailable
                                                }
                                            >
                                                {link.label === "Previous" ||
                                                link.label === "Next" ? (
                                                    link.label
                                                ) : (
                                                    <span
                                                        dangerouslySetInnerHTML={{
                                                            __html: link.label,
                                                        }}
                                                    />
                                                )}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
