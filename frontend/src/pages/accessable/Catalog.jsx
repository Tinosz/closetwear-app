import { useEffect, useState, useRef } from "react";
import axiosClient from "../../client/axios-client";
import { Link, useParams } from "react-router-dom";
import CatalogGallery from "../../components/CatalogGallery";
import Categories from "../../components/Categories";

import "../../components/styles/Catalog.css";

export default function Catalog() {
    const { id, bannerId } = useParams();
    const [featuredCategories, setFeaturedCategories] = useState([]);
    const [nonFeaturedCategories, setNonFeaturedCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [loading, setIsLoading] = useState();
    const [pagination, setPagination] = useState({});
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            const sidebarButton = document.querySelector(".toggle-category");

            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target) &&
                sidebarButton &&
                !sidebarButton.contains(event.target)
            ) {
                setSidebarOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const getRelatedBanners = () => {
        axiosClient
            .get(`/banners/${bannerId}/related-items`)
            .then((response) => {
                setItems(reponse.data);
                console.log(response.data);
            })
            .catch(() => {})
            .finally(() => {
                //
            });
    };

    const getCategories = () => {
        axiosClient
            .get("categories")
            .then((response) => {
                const allCategories = response.data;

                const featured = allCategories.filter(
                    (category) => category.featured === 1
                );
                const nonFeatured = allCategories.filter(
                    (category) => category.featured === 0
                );

                setFeaturedCategories(featured);
                setNonFeaturedCategories(nonFeatured);
            })
            .catch(() => {})
            .finally(() => {
                // setIsLoading(false);
            });
    };

    const getItems = () => {
        if (id) {
            axiosClient
                .get(`/items/search-by-category/${id}`)
                .then((response) => {
                    console.log(response.data);
                    setItems(response.data);
                })
                .catch(() => {})
                .finally(() => {
                    // setIsLoading(false);
                });
        } else {
            axiosClient.get(`/items`).then((response) => {
                console.log(response.data);
                setItems(response.data.data);
                setPagination(response.data);
            });
        }
    };

    useEffect(() => {
        if (bannerId) {
            getRelatedBanners();
        }
        getCategories();
        getItems();
    }, []);

    return (
        <>
            <div className="catalog-wrap">
                <div className="side-category-wrap">
                <span className="sm:absolute border p-10 big-screen-category">
                <div>
                    {featuredCategories.length > 0 &&
                        featuredCategories.map((category) => (
                            <div key={category.id}>
                                <Link
                                    className="font-bold"
                                    to={`/Catalog/` + category.id}
                                >
                                    {category.category_name}
                                </Link>
                            </div>
                        ))}
                </div>
                <hr className="my-5" />
                <div>
                    {nonFeaturedCategories.length > 0 &&
                        nonFeaturedCategories
                            .filter((category) => category.id !== 1)
                            .map((category) => (
                                <div key={category.id}>
                                    <Link to={`/Catalog/` + category.id}>
                                        {category.category_name}
                                    </Link>
                                </div>
                            ))}
                </div>
            </span>
            <span className="small-screen-category">
                <button onClick={toggleSidebar} className="ml-5 mb-5 rounded-full toggle-category">
                    Categories
                </button>
                <div
                    ref={sidebarRef}
                    className={`sidebar-category fixed top-0 left-0 h-full w-64 bg-black text-white p-4 sidebar${
                        isSidebarOpen ? " sidebar-open" : ""
                    }`}
                >
                    <div>
                        {featuredCategories.length > 0 &&
                            featuredCategories.map((category) => (
                                <div key={category.id}>
                                    <Link
                                        className="font-bold"
                                        to={`/Catalog/` + category.id}
                                    >
                                        {category.category_name}
                                    </Link>
                                </div>
                            ))}
                    </div>
                    <hr className="my-5" />
                    <div>
                        {nonFeaturedCategories.length > 0 &&
                            nonFeaturedCategories
                                .filter((category) => category.id !== 1)
                                .map((category) => (
                                    <div key={category.id}>
                                        <Link to={`/Catalog/` + category.id}>
                                            {category.category_name}
                                        </Link>
                                    </div>
                                ))}
                    </div>
                </div>
            </span>
                </div>
                <div className="img-gallery-wrap">
                    <CatalogGallery />
                </div>
            </div>
        </>
    );
}
