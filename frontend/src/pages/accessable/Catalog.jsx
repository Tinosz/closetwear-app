import { useEffect, useState, useRef } from "react";
import axiosClient from "../../client/axios-client";
import { Link, useParams } from "react-router-dom";
import CatalogGallery from "../../components/CatalogGallery";

import "./styles/Catalog.css";

export default function Catalog() {
    const { id, bannerId } = useParams();
    const [featuredCategories, setFeaturedCategories] = useState([]);
    const [nonFeaturedCategories, setNonFeaturedCategories] = useState([]);

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



    useEffect(() => {
        getCategories();
    }, []);

    return (
        <>
            <div className="catalog-wrap">                
                <div className="side-category-wrap">
                    <button onClick={toggleSidebar} className="ml-5 mb-5 rounded-full toggle-category">
                        Categories
                    </button>
                    <div className="big-screen-category">
                        <h1>CATEGORIES</h1>

                        {featuredCategories.length > 0 &&
                            featuredCategories.map((category) => (
                            <div key={category.id} className="one_category">
                                <Link
                                    to={`/Catalog/` + category.id}
                                >
                                    {category.category_name}
                                </Link>
                            </div>
                        ))}
                        <br />
                        <hr/>
                        <br />
                    
                        {nonFeaturedCategories.length > 0 &&
                            nonFeaturedCategories
                            .filter((category) => category.id !== 1)
                            .map((category) => (
                            <div key={category.id} className="one_category">
                                <Link to={`/Catalog/` + category.id}>
                                    {category.category_name}
                                </Link>
                            </div>
                        ))}
                    </div>
                    
                    <div
                        ref={sidebarRef}
                        className={`small-screen-category sidebar-category fixed top-0 left-0 h-full w-64 bg-black text-white p-4 sidebar${
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
                </div>
                <div className="img-gallery-wrap">
                    <CatalogGallery />
                </div>
            </div>
        </>
    );
}
