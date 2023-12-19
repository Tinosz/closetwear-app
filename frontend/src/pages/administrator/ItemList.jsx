// ItemList.jsx
import React, { useEffect, useState } from "react";
import axiosClient from "../../client/axios-client";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import SearchBar from "../../components/SearchBar";
import useSearch from "../../page-groups/useSearch";
import { useStateContext } from "../../context/ContextProvider";

import "./styles/ItemListStyles.css";

export default function ItemList() {
    const { notification } = useStateContext();
    const [items, setItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [pagination, setPagination] = useState({});
    const [filteredItems, setFilteredItems] = useState([]);
    const { filteredData, handleFilter } = useSearch();
    const [searchWord] = useState("");

    const handleEditClick = async (item) => {
        try {
            window.location.href = `/Admin/EditItem/${item.id}`;
        } catch (error) {
            console.error("Error incrementing item click count:", error);
        }
    };

    const getItems = (page = 1) => {
        axiosClient
            .get(`itemsPaginated?page=${page}`)
            .then((response) => {
                console.log(response.data);
                setItems(response.data.data);
                setPagination(response.data);
            })
            .catch(() => {})
            .then(() => {});
    };

    const toggleItemSelection = (itemId) => {
        setSelectedItems((prevSelected) =>
            prevSelected.includes(itemId)
                ? prevSelected.filter((id) => id !== itemId)
                : [...prevSelected, itemId]
        );
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
            window.location.reload();
        });
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
                    placeholder="Search items.."
                    onFilter={handleFilter}
                />
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

                <div className="edit-list-button">
                    <Link to="/Admin/EditItem">
                        <button className="bot-button">Add Item</button>
                    </Link>
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
                                {filteredItems.length > 0 ? (
                                    filteredItems.map((item, index) => {
                                        const featuredCategories = [];
                                        const nonFeaturedCategories = [];

                                        item.categories.forEach((category) => {
                                            if (category.featured === 1) {
                                                featuredCategories.push(
                                                    category
                                                );
                                            } else {
                                                nonFeaturedCategories.push(
                                                    category
                                                );
                                            }
                                        });

                                        return (
                                            <tr
                                                className="odd:bg-white odd:light:bg-black-900 even:bg-black-50 even:dark:bg-black-800 border-b dark:border-black-700"
                                                key={item.id}
                                            >
                                                <td className="px-6 py-4 border border-2 border-black">
                                                    {index + 1}
                                                </td>
                                                <td
                                                    scope="row"
                                                    className="px-6 py-4 border border-2 border-black font-medium text-black-900 dark:text-white w-28"
                                                    style={{
                                                        color: "black",
                                                        maxWidth: "200px",
                                                        wordWrap: "break-word",
                                                    }}
                                                >
                                                    {item.item_name}
                                                </td>
                                                <td className="px-6 py-4 border border-2 border-black">
                                                    {item.images
                                                        .sort(
                                                            (a, b) =>
                                                                a.item_image_order -
                                                                b.item_image_order
                                                        )
                                                        .map(
                                                            (
                                                                image,
                                                                imgIndex
                                                            ) => (
                                                                <span
                                                                    key={
                                                                        imgIndex
                                                                    }
                                                                >
                                                                    <img
                                                                        className="w-20"
                                                                        src={`${
                                                                            import.meta
                                                                                .env
                                                                                .VITE_API_BASE_URL
                                                                        }/storage/${
                                                                            image.item_image
                                                                        }`}
                                                                        alt={`Image ${
                                                                            imgIndex +
                                                                            1
                                                                        }`}
                                                                    />
                                                                </span>
                                                            )
                                                        )}
                                                </td>
                                                <td className="px-6 py-4 border border-2 border-black">
                                                    {item.item_price}
                                                </td>
                                                <td className="px-6 py-4 border border-2 border-black">
                                                    <ul>
                                                        {featuredCategories
                                                            .filter(
                                                                (category) =>
                                                                    category.id !==
                                                                    1
                                                            )
                                                            .map(
                                                                (
                                                                    category,
                                                                    catIndex
                                                                ) => (
                                                                    <li
                                                                        key={
                                                                            catIndex
                                                                        }
                                                                    >
                                                                        {
                                                                            category.category_name
                                                                        }
                                                                        {category.featured ===
                                                                            1 && (
                                                                            <FontAwesomeIcon
                                                                                icon={
                                                                                    faStar
                                                                                }
                                                                            />
                                                                        )}
                                                                    </li>
                                                                )
                                                            )}
                                                    </ul>
                                                    <ul>
                                                        {nonFeaturedCategories
                                                            .filter(
                                                                (category) =>
                                                                    category.id !==
                                                                    1
                                                            )
                                                            .map(
                                                                (
                                                                    category,
                                                                    catIndex
                                                                ) => (
                                                                    <li
                                                                        key={
                                                                            catIndex
                                                                        }
                                                                    >
                                                                        {
                                                                            category.category_name
                                                                        }
                                                                    </li>
                                                                )
                                                            )}
                                                    </ul>
                                                </td>
                                                <td className="px-6 py-4 border border-2 border-black">
                                                    {parseInt(
                                                        item.available_stock
                                                    ) === 1
                                                        ? "Yes"
                                                        : "No"}
                                                </td>
                                                <td className="px-6 py-4 border border-2 border-black">
                                                    {item.item_click}
                                                </td>
                                                <td className="px-6 py-4 border border-2 border-black">
                                                    {item.item_link_click}
                                                </td>
                                                <td className="px-6 py-4 border border-2 border-black">
                                                    <Link
                                                        to="#"
                                                        onClick={() =>
                                                            handleEditClick(
                                                                item
                                                            )
                                                        }
                                                    >
                                                        <button className="edit-banner-button">
                                                            Edit
                                                        </button>
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4 border border-2 border-black">
                                                    <button
                                                        className="action-button"
                                                        onClick={(e) =>
                                                            onDelete(item)
                                                        }
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 border border-2 border-black">
                                                    <div className="checkbox-wrapper-24">
                                                    <input
                                                            type="checkbox"
                                                            id={item.item_name}
                                                            className="field__input"
                                                            checked={selectedItems.includes(
                                                                item.id
                                                            )}
                                                            onChange={() =>
                                                                toggleItemSelection(item.id)
                                                            }
                                                        />
                                                        <label for={item.id}>
                                                            <span></span>
                                                        </label>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            className="px-6 py-4 border border-2 border-black"
                                            colSpan="11"
                                        >
                                            No Items available
                                        </td>
                                    </tr>
                                )}
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
