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
    const [searchWord, setSearchWord] = useState("");

    useEffect(() => {
        setFilteredItems(filteredData);
    }, [filteredData]);

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
        }).catch(() => {

        }).then(() => {
            
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
            });
    };




    const parallaxBg = document.querySelector('.parallax-bg');

    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        parallaxBg.style.transform = `translate3d(0, ${scrollPosition * 1}px, 0)`;
    });

  

    
      const ImageCard = ({ imageSrc, title, description, tags }) => (
        <div className="image-card">
          <img className="image" src={imageSrc} alt={title} />
          <div className="content">
            <div className="title">{title}</div>
            <div className="price">Rp. 12,000</div>
          </div>
          <div className="tags">
            {tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      );
    
      const handleResultItemClick = (itemName) => {
        setSearchWord(itemName);
      };
    return (
        <>
            <div className="list-wrap">

                <div className="parallax-bg"></div>
                <SearchBar
                    placeholder="Search items.."
                    onFilter={handleFilter}
                />

                
                <div className="list-content-wrap">
                    {notification && <div>{notification}</div>}

                    <h2 style={{ fontSize: '32px', fontWeight: 'bold' }}>Item List:</h2>

                    <br />

                    <div className="form-container relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-center rtl:text-right text-white-500 dark:text-white-400 border border-black il-table">
                            <thead className="text-xs text-white-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-white-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3 border border-2 border-black">No.</th>
                                    <th scope="col" className="px-6 py-3 border border-2 border-black">Item Name</th>
                                    <th scope="col" className="px-6 py-3 border border-2 border-black">Images</th>
                                    <th scope="col" className="px-6 py-3 border border-2 border-black">Price</th>
                                    <th scope="col" className="px-6 py-3 border border-2 border-black">Categories</th>
                                    <th scope="col" className="px-6 py-3 border border-2 border-black">Available Stock?</th>
                                    <th scope="col" className="px-6 py-3 border border-2 border-black">Item Clicks</th>
                                    <th scope="col" className="px-6 py-3 border border-2 border-black">Item Link Clicks</th>
                                    <th scope="col" className="px-6 py-3 border border-2 border-black">Edit</th>
                                    <th scope="col" className="px-6 py-3 border border-2 border-black">Delete</th>
                                    <th scope="col" className="px-6 py-3 border border-2 border-black">Multiple Deletion</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.length > 0 ? (
                                    filteredItems.map((item, index) => {
                                        const featuredCategories = [];
                                        const nonFeaturedCategories = [];


                                        const allCategories = featuredCategories.concat(
                                            nonFeaturedCategories
                                        );

                                        return (
                                            <tr className="odd:bg-white odd:light:bg-black-900 even:bg-black-50 even:dark:bg-black-800 border-b dark:border-black-700" key={item.id}>
                                                <td className="px-6 py-4 border border-2 border-black">{index + 1}</td>
                                                <th scope="row" className="px-6 py-4 border border-2 border-black font-medium text-black-900 whitespace-nowrap dark:text-white" style={{color: 'black'}}>{item.item_name}</th>
                                                <td className="px-6 py-4 border border-2 border-black">
                                                    {item.images
                                                        .sort(
                                                            (a, b) =>
                                                                a.item_image_order -
                                                                b.item_image_order
                                                        )
                                                        .map((image, imgIndex) => (
                                                            <span key={imgIndex}>
                                                                <img
                                                                    className="w-20"
                                                                    src={`${
                                                                        import.meta.env
                                                                            .VITE_API_BASE_URL
                                                                    }/storage/${
                                                                        image.item_image
                                                                    }`}
                                                                    alt={`Image ${
                                                                        imgIndex + 1
                                                                    }`}
                                                                />
                                                            </span>
                                                        ))}
                                                </td>
                                                <td className="px-6 py-4 border border-2 border-black">{item.item_price}</td>
                                                <td className="px-6 py-4 border border-2 border-black">
                                                    <ul>
                                                        {allCategories
                                                            .filter(
                                                                (category) =>
                                                                    category.id !== 1
                                                            )
                                                            .map((category, catIndex) => (
                                                                <li key={catIndex}>
                                                                    {category.category_name}
                                                                    {category.featured === 1 && (
                                                                        <FontAwesomeIcon
                                                                            icon={faStar}
                                                                        />
                                                                    )}
                                                                </li>
                                                            ))}
                                                    </ul>
                                                </td>
                                                <td className="px-6 py-4 border border-2 border-black">
                                                    {parseInt(item.available_stock) === 1
                                                        ? "Yes"
                                                        : "No"}
                                                </td>
                                                <td className="px-6 py-4 border border-2 border-black">{item.item_click}</td>
                                                <td className="px-6 py-4 border border-2 border-black">{item.item_link_click}</td>
                                                <td className="px-6 py-4 border border-2 border-black">
                                                    <Link
                                                        to="#"
                                                        onClick={() =>
                                                            handleEditClick(item)
                                                        }
                                                    >
                                                        <button className="edit-banner-button">
                                                            Edit
                                                        </button>
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4 border border-2 border-black">
                                                    <button className="action-button" onClick={(e) => onDelete(item)}>
                                                        Delete
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 border border-2 border-black">
                                                    <div className="checkbox-wrapper-24">
                                                        <input
                                                            type="checkbox"
                                                            id={item.id}
                                                            className="field__input"
                                                            checked={selectedItems.includes(
                                                                item.id
                                                            )}
                                                            onChange={() =>
                                                                toggleItemSelection(item.id)
                                                            }
                                                        />
                                                        <label htmlFor={item.id}><span></span></label>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td className="px-6 py-4 border border-2 border-black" colSpan="7">No Items available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="edit-list-button-wrap grid grid-cols-3">
                        <div className="edit-list-button">
                            <button
                                onClick={onMultipleDelete}
                                className="bot-button"
                                disabled={selectedItems.length === 0}
                                style={{ opacity: selectedItems.length === 0 ? 0.5 : 1 }}
                            >
                                Delete Selected
                            </button>
                        </div>

                        <div className="edit-list-button">
                            <Link to="/Admin/EditItem">
                                <button className="bot-button">Add Item</button>
                            </Link>
                        </div>

                        <div className="edit-list-np">
                            {pagination.links && (
                                <ul className="pagination">
                                    {pagination.links.map((link, index) => (
                                        <li
                                            key={index}
                                            className={`page-item ${
                                                link.active ? "active" : ""
                                            }`}
                                        >
                                            <button
                                                className="page-link bot-button"
                                                onClick={() => onPageChange(link.label)}
                                                disabled={link.label === "Previous" && !pagination.prevPageAvailable}
                                            >
                                                {link.label === "Previous" || link.label === "Next" ? (
                                                    link.label
                                                ) : (
                                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
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
