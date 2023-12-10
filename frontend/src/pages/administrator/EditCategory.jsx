import React, { useState, useEffect } from "react";
import axiosClient from "../../client/axios-client";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

import "./styles/EditCategoryStyles.css";

export default function EditCategory() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [category, setCategory] = useState({
        id: null,
        category_name: "",
        featured: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState(null);

    const { setNotification, notification } = useStateContext();

    const onSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("category_name", category.category_name);
        formData.append("featured", category.featured);

        if (id) {
            formData.append("_method", "PUT");
        }

        if (id) {
            axiosClient
                .post(`/categories/${category.id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                })
                .then(() => {
                    setNotification("Category was successfully updated.")
                    navigate("/Admin/EditCategories");
                    getCategories();
                    // Reset the category state after a successful submission
                    setCategory((prevCategory) => ({
                        ...prevCategory,
                        id: null,
                        category_name: "",
                        featured: 0,
                    }));
                })
                .catch((err) => {
                    console.log(err);
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                });
        } else {
            axiosClient
                .post("/categories", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then(() => {
                    setNotification("Category was successfully added.")
                    navigate("/Admin/EditCategories");
                    getCategories();
                    // Reset the category state after a successful submission
                    setCategory({
                        id: null,
                        category_name: "",
                        featured: 0,
                    });
                })
                .catch((err) => {
                    console.log(err);
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                });
        }
    };

    const onDeleteSelected = () => {
        if (
            !window.confirm(
                "Are you sure you want to delete the selected categories?"
            )
        ) {
            return;
        }

        const deletePromises = selectedCategories.map((categoryId) => {
            return axiosClient.delete(`/categories/${categoryId}`);
        });

        Promise.all(deletePromises)
            .then(() => {
                getCategories();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const toggleCategorySelection = (categoryId) => {
        setSelectedCategories((prevSelected) => {
            if (prevSelected.includes(categoryId)) {
                return prevSelected.filter((id) => id !== categoryId);
            } else {
                return [...prevSelected, categoryId];
            }
        });
    };

    const onCheckAll = (isChecked) => {
        if (isChecked) {
            setSelectedCategories(categories.map((cat) => cat.id));
        } else {
            setSelectedCategories([]);
        }
    };

    const getCategories = () => {
        axiosClient
            .get("categories")
            .then((response) => {
                console.log(response.data);
                setCategories(response.data);
            })
            .catch(() => {})
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        getCategories();

        if (id) {
            axiosClient
                .get(`/categories/${id}`)
                .then(({ data }) => {
                    setCategory(data);
                    console.log(data);
                })
                .catch(() => {});
        }
    }, [id]);

    // Separate categories into featured and non-featured arrays
    const featuredCategories = categories.filter((cat) => cat.featured === 1);
    const nonFeaturedCategories = categories.filter((cat) => cat.featured === 0);

    return (
        <>
        <div className="container">
            {notification && 
            <div className="notification">{notification}</div>}
            <form className="max-w-sm mx-auto" onSubmit={onSubmit}>
                <div className="mb-5">
                    <p className="loading-text">{isLoading ? "Loading..." : (id ? `Update: ${category.category_name}` : "")}</p>

                    
                    {errors && errors.category_name && (
                        <p className="text-red-600">{errors.category_name}</p>
                    )}
                    <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Category Name"
                        onChange={(e) =>
                            setCategory({
                                ...category,
                                category_name: e.target.value,
                            })
                        }
                        value={category.category_name}
                    />
                    
                    <div className="flex items-start mb-5">
                        <div className="flex items-center h-5">
                            <input
                                type="checkbox"
                                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                                checked={Number(category.featured) === 1}
                                onChange={() => setCategory({
                                    ...category,
                                    featured: category.featured === 1 ? 0 : 1
                                })}
                            />
                        </div>
                        <label for="terms" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">I agree with the <a href="#" class="text-blue-600 hover:underline dark:text-blue-500">terms and conditions</a></label>
                    </div>
                    <div className="action-button" onClick={onSubmit}>
                        {id ? "Update Category" : "Add Category"}
                    </div>
                </div>
            </form>
            <div>
                <label>
                    <input
                        type="checkbox"
                        onChange={(e) => onCheckAll(e.target.checked)}
                    />
                    Check All
                </label>
                <div>
                    <h2>Featured Categories:</h2>
                    {featuredCategories.map((category) => (
                        <div key={category.id}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(category.id)}
                                    onChange={() => toggleCategorySelection(category.id)}
                                />
                                {category.category_name} <FontAwesomeIcon icon={faStar} />
                            </label>
                            <Link
                                to={"/Admin/EditCategories/" + category.id}
                                className="ml-3 bg-blue-200"
                            >
                                Edit
                            </Link>
                        </div>
                    ))}
                </div>
                <div>
                    <h2>Non-Featured Categories:</h2>
                    {nonFeaturedCategories.filter((category) => category.id !== 1).map((category) => (
                        <div key={category.id}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(category.id)}
                                    onChange={() => toggleCategorySelection(category.id)}
                                />
                                {category.category_name} 
                            </label>
                            <Link
                                to={"/Admin/EditCategories/" + category.id}
                                className="ml-3 bg-blue-200"
                            >
                                Edit
                            </Link>
                        </div>
                    ))}
                </div>
                <button
                    onClick={onDeleteSelected}
                    disabled={selectedCategories.length === 0}
                    className={`bg-red-500  ${
                        selectedCategories.length === 0
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                    }`}
                >
                    Delete Selected
                </button>
            </div>
        </div>
        </>
    );
}
