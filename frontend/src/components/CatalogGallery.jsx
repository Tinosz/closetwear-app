import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";
import axiosClient from "../client/axios-client";

import "./styles/Catalog.css";
import { Link, useParams } from "react-router-dom";

import useSearch from "../page-groups/useSearch";
import SearchBar from "./SearchBarSuggest";

import "./styles/Catalog.css"; // Add your custom styles

export default function CatalogGallery() {
    const { filteredData, handleFilter } = useSearch();
    const [searchWord, setSearchWord] = useState("");

    useEffect(() => {
        handleFilter(searchWord);
    }, [searchWord, handleFilter]);

    const { id, bannerId } = useParams();
    const [pagination, setPagination] = useState({});
    const [items, setItems] = useState([]); // Add this line to define the 'items' state
    const getItems = (page = 1) => {
        axiosClient
            .get(`itemsPaginated?page=${page}`)
            .then((response) => {
                console.log(response.data);
                setItems(response.data.data);
                setPagination(response.data);
            })
            .catch(() => {})
            .finally(() => {});
    };

    const getCategoryItems = (page = 1) => {
        axiosClient
            .get(`/items/search-by-category/${id}?page=${page}`)
            .then((response) => {
                setItems(response.data.data);
                setPagination(response.data);
                applyAOS();
            })
            .catch(() => {
                // Handle error
            });
    };

    const getRelatedBanners = (page = 1) => {
        axiosClient
            .get(`/banners/${bannerId}/related-items?page=${page}`)
            .then((response) => {
                setItems(response.data.data);
                console.log(response.data);
                setPagination(response.data);
            })
            .catch(() => {})
            .finally(() => {
                //
            });
    };

    useEffect(() => {
        if (id) {
            getCategoryItems();
        } else if (bannerId) {
            getRelatedBanners();
        } else {
            getItems();
        }
    }, [id, bannerId]); // Include 'id' as a dependency here
  
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

    //   useEffect(() => {
    //     AOS.init();
    //   }, []);

    const ImageCard = ({ images, title, price, tags }) => {
        // Sort images based on item_image_order
        const sortedImages = images.sort(
            (a, b) => a.item_image_order - b.item_image_order
        );
        const firstImageSrc =
            sortedImages.length > 0 ? sortedImages[0].item_image : "";

        return (
            <div className="overflow-hidden shadow-lg">
                <div
                    className="relative w-full"
                    style={{ paddingBottom: "86.25%" }}
                >
                    <img
                        className="absolute w-full h-full object-cover"
                        src={`${
                            import.meta.env.VITE_API_BASE_URL
                        }/storage/${firstImageSrc}`}
                        alt={title}
                    />
                </div>

                <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">{title}</div>
                    <div className="price">Rp.{price}</div>
                </div>
                <div className="px-6 pt-4 pb-2">
                    {tags.map((tag, index) => (
                        <span
                            key={index}
                            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        );
    };

    const ImageGallery = () => (
        <div className="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {searchWord === ""
                ? items
                      .filter((item) => item.available_stock === "1") // Filter items with available_stock === '1'
                      .map((item) => (
                          <Link
                              key={item.id}
                              to={`/product/${item.id}`}
                              onClick={() => handleClick(item)} // Add onClick handler to perform API request
                          >
                              <div key={item.id} className="">
                                  <ImageCard
                                      images={item.images}
                                      title={item.item_name}
                                      tags={item.categories
                                          .filter(
                                              (category) => category.id !== 1
                                          )
                                          .slice(0, 3)
                                          .map(
                                              (category) =>
                                                  category.category_name
                                          )}
                                      price={item.item_price}
                                  />
                              </div>
                          </Link>
                      ))
                : filteredData
                      .filter((item) => item.available_stock === "1") // Filter filteredData with available_stock === '1'
                      .map((item) => (
                          <Link
                              key={item.id}
                              to={`/product/${item.id}`}
                              onClick={() => handleClick(item)} // Add onClick handler to perform API request
                          >
                              <div key={item.id} className="image-card">
                                  <ImageCard
                                      images={item.images}
                                      title={item.item_name}
                                      tags={item.categories
                                          .filter(
                                              (category) => category.id !== 1
                                          )
                                          .slice(0, 3)
                                          .map(
                                              (category) =>
                                                  category.category_name
                                          )}
                                      price={item.item_price}
                                  />
                              </div>
                          </Link>
                      ))}
        </div>
    );

    const handleClick = async (item) => {
        try {
            await axiosClient.post(`/items/${item.id}/increment-click`);
            // Use the navigation method you prefer, e.g., react-router navigation
            // For simplicity, this example uses window.location.href
            window.location.href = `/product/${item.id}`;
        } catch (error) {
            console.error("Error incrementing item click count:", error);
        }
    };

    const handleResultItemClick = (itemName) => {
        setSearchWord(itemName);
    };

    return (
        <div className="catalog-container">
            <div className="searchbar">
                <SearchBar
                    placeholder="Search"
                    value={searchWord}
                    onInputChange={(value) => setSearchWord(value)}
                />
                {filteredData.length !== 0 && searchWord !== "" && (
                    <div className="data-result">
                        {filteredData.slice(0, 15).map((value, index) => {
                            return (
                                <div
                                    className="result-item"
                                    key={index}
                                    onClick={() =>
                                        handleResultItemClick(value.item_name)
                                    }
                                >
                                    <div className="result-item-content">
                                        <span>{value.item_name}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="gallery-container">
                <ImageGallery />
            </div>

            <div className="pagination-container">
                {pagination.links && (
                    <ul className="pagination-list">
                        {pagination.links.map((link, index) => (
                            <li
                                key={index}
                                className={`page-item ${
                                    link.active ? "active" : ""
                                }`}
                            >
                                <button
                                    className="page-link"
                                    onClick={() => onPageChange(link.label)}
                                    disabled={link.url === null}
                                    style={{
                                        opacity: link.url === null ? 0.5 : 1,
                                    }}
                                >
                                    {link.label === "&laquo; Previous"
                                        ? "Previous"
                                        : link.label === "Next &raquo;"
                                        ? "Next"
                                        : link.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
