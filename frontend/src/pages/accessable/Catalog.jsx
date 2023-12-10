import { useEffect, useState } from "react";
import axiosClient from "../../client/axios-client";
import { Link, useParams } from "react-router-dom";

export default function Catalog() {
    const { id } = useParams();
    const [featuredCategories, setFeaturedCategories] = useState([]);
    const [nonFeaturedCategories, setNonFeaturedCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [loading, setIsLoading] = useState();
    const [pagination, setPagination] = useState({});

    const getCategories = () => {
            axiosClient
                .get("categories")
                .then((response) => {
                    const allCategories = response.data;
    
                    // Divide categories into featured and non-featured
                    const featured = allCategories.filter((category) => category.featured === 1);
                    const nonFeatured = allCategories.filter((category) => category.featured === 0);
    
                    setFeaturedCategories(featured);
                    setNonFeaturedCategories(nonFeatured);
                })
                .catch(() => {})
                .finally(() => {
                    // setIsLoading(false);
                });
    };

    const getItems = () => {
        if(id){
            axiosClient.get(`/items/search-by-category/${id}`).then(( response ) => {
                console.log(response.data);
                setItems(response.data);
            })
            .catch(() => {})
            .finally(() => {
                // setIsLoading(false);
            })
        } else{
            axiosClient.get(`/items`).then((response) => {
                console.log(response.data);
                setItems(response.data.data);
                setPagination(response.data);
            })

        }
    }

    useEffect(() => {
        getCategories();
        getItems();
    }, []);

    const categoryOnClick = () => {

    }




    return (
        <>
  <div>
                <h2>Featured Categories:</h2>
                {featuredCategories.length > 0 &&
                    featuredCategories.map((category) => (
                        <div key={category.id}>
                            <Link
                                to={`/Catalog/` + category.id}
                            >
                                {category.category_name}
                            </Link>
                        </div>
                    ))}
            </div>
            <div>
                {nonFeaturedCategories.length > 0 &&
                    nonFeaturedCategories.filter((category) => category.id !== 1).map((category) => (
                        <div key={category.id}>
                            <Link to={`/Catalog/` + category.id}
                            >
                                {category.category_name}
                            </Link>
                        </div>
                    ))}
            </div>
        </>
    );
}
