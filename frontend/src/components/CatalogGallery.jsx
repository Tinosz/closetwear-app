import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";
import axiosClient from "../client/axios-client";

import "./styles/Catalog.css";
import { useParams } from "react-router-dom";

import useSearch from "../page-groups/useSearch";
import SearchBar from "./SearchBarSuggest";


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
        axiosClient.get(`itemsPaginated?page=${page}`).then((response) => {
            console.log(response.data);
            setItems(response.data.data);
            setPagination(response.data);
        }).catch(() => {

        }).finally(()=> {

        });
    };

  const getCategoryItems = (page = 1) => {
    axiosClient
      .get(`/items/search-by-category/${id}?page=${page}`)
      .then((response) => {
        setItems(response.data.data);
        setPagination(response.data);
        applyAOS(); // Apply AOS after setting the items
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
                setPagination(response.data)
            })
            .catch(() => {})
            .finally(() => {
                //
            });
    };

    useEffect(() => {
        if (id) {
            getCategoryItems();
        } else if(bannerId){
            getRelatedBanners();
        } else {
            getItems();
        }
    }, [id]); // Include 'id' as a dependency here

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

    useEffect(() => {
        AOS.init();
    }, []);

    const ImageCard = ({ imageSrc, title, price, tags }) => (
        <div
            className="rounded overflow-hidden shadow-lg w-96   "
            // data-aos="fade-up"
        >
            <img
                className="w-full h-64 object-cover"
                src={imageSrc}
                alt={title}
            />
            <div className="px-6 py-4">
                <div className="font-bold text-2xl mb-2">{title}</div>
                <div className="font-bold text-xl mt-2">{price}</div>
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

    const ImageGallery = () => (
        <div className="w-full sm:p-10 grid grid-cols-2 gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-5">
            {filteredData.map((item) => (
                <ImageCard
                    key={item.id}
                    imageSrc={`${import.meta.env.VITE_API_BASE_URL}/storage/${
                        item.images[0].item_image
                    }`} // Assuming the first image is used as the main image
                    title={item.item_name}
                    price={item.item_price}
                    tags={item.categories
                        .filter((category) => category.id !== 1)
                        .slice(0, 3) // Limit to the first 3 categories
                        .map((category) => category.category_name)}
                />
            ))}
        </div>
    );
    
    const handleResultItemClick = (itemName) => {
        setSearchWord(itemName);
      };
      
    return (
        <div className="top-0 bottom-0 overflow-auto">
            <div>
            <SearchBar
                placeholder="Search by item name"
                value={searchWord}
                onInputChange={(value) => setSearchWord(value)}
            />
            {filteredData.length !== 0 && searchWord !== "" && (
                <div className="dataResult">
                {filteredData.slice(0, 15).map((value, index) => {
                    return (
                    <div
                        className="resultItem"
                        key={index}
                        onClick={() => handleResultItemClick(value.item_name)}
                    >
                        <div className="">
                        <span>{value.item_name}</span>
                        </div>
                    </div>
                    );
                })}
                </div>
            )}
            </div>

            <div className="sm:ml-auto w-full sm:w-3/4">
                <ImageGallery />
            </div>
            <div className="pagination ml-auto">
                {pagination.links && (
                    <ul className="flex list-none p-0 justify-end">
                        {pagination.links.map((link, index) => (
                            <li
                                key={index}
                                className={`page-item ${
                                    link.active ? "active" : ""
                                }`}
                            >
                                <button
                                    className="page-link mr-3"
                                    onClick={() => onPageChange(link.label)}
                                    disabled={link.url === null} // Disable the button if there is no URL (no previous or next page)
                                    style={{
                                        opacity: link.url === null ? 0.5 : 1,
                                    }} // Set opacity based on the availability of the URL
                                >
                                    {/* Replace HTML entities with plain text */}
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
