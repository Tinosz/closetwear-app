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
                // Clear selectedCategories after successful deletion
                setSelectedCategories([]);
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

    const parallaxBg = document.querySelector('.parallax-bg');

    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        parallaxBg.style.transform = `translate3d(0, ${scrollPosition * 1}px, 0)`;
    });

    return (
        <>
        <div className="category-bg">
        <div className="parallax-bg"></div>
        <div className="category-container">
            <div className="content-wrap">
                {notification && 
                <div className="notification">{notification}</div>}
                <form className="form-wrap" onSubmit={onSubmit}>
                    <div className="mb-5">
                        <p className="loading-text">{isLoading ? "Loading..." : (id ? `Update: ${category.category_name}` : "")}</p>

                        
                        {errors && errors.category_name && (
                            <p className="text-red-600">{errors.category_name}</p>
                        )}
                        <div className="field field_v3">
                            <input
                                className="field__input"
                                placeholder="e.g Men's Jacket, Sport Sweaters"
                                onChange={(e) =>
                                    setCategory({
                                        ...category,
                                        category_name: e.target.value,
                                    })
                                }
                                value={category.category_name}
                            />
                            <span class="field__label-wrap" aria-hidden="true">
                                <span class="field__label">Category</span>
                            </span>
                        </div>
                        
                        <div className="flex items-start mb-5">
                            <div className="featured-check flex items-center h-5">
                                <input
                                    type="checkbox"
                                    className="category-input w-4 h-4 border border-black-300 rounded bg-black-50 focus:ring-3 focus:ring-blue-300 dark:bg-black-700 dark:border-black-600 dark:focus:ring-blue-600 dark:ring-offset-black-800 dark:focus:ring-offset-black-800"
                                    id="featured"
                                    checked={Number(category.featured) === 1}
                                    onChange={() => setCategory({
                                        ...category,
                                        featured: category.featured === 1 ? 0 : 1
                                    })}
                                />
                                <label for="featured" class="ms-2 text-sm font-medium text-black-900 dark:text-black-300">
                                Featured?
                                </label>
                            </div>
                        </div>
                        <button
                        className="action-button"
                        onClick={onSubmit}
                        >
                        {id ? "Update Category" : "Add Category"}
                        </button>
                    </div>
                </form>
                <form>

                </form>
                <div className="checkbox-wrap checkbox-wrapper-24">
                    <input
                        type="checkbox"
                        id="check-all"
                        className="form-check-input"
                        onChange={(e) => onCheckAll(e.target.checked)}
                    />
                    <label class="form-check-label" for="check-all">
                        <span></span>Check All
                    </label>
                    <div>
                        <h2>Featured Categories:</h2>
                        {featuredCategories.map((category) => (
                            <div className="checkbox-wrapper-24" key={category.id}>
                                <input
                                    type="checkbox"
                                    id={category.id} 
                                    checked={selectedCategories.includes(category.id)}
                                    onChange={() => toggleCategorySelection(category.id)}
                                />
                                <label for={category.id}>
                                    <span></span>
                                    {category.category_name} <FontAwesomeIcon icon={faStar} />
                                </label>
                                <Link
                                    to={"/Admin/EditCategories/" + category.id}
                                    className="edit-button"
                                >
                                    Edit
                                </Link>
                            </div>
                        ))}
                    </div>
                    <div>
                        <h2>Non-Featured Categories:</h2>
                        {nonFeaturedCategories.filter((category) => category.id !== 1).map((category) => (
                            <div className="checkbox-wrapper-24" key={category.id}>
                                <input
                                    type="checkbox"
                                    id={category.id}
                                    checked={selectedCategories.includes(category.id)}
                                    onChange={() => toggleCategorySelection(category.id)}
                                />
                                <label for={category.id}>
                                    <span></span>{category.category_name} 
                                </label>
                                <Link
                                    to={"/Admin/EditCategories/" + category.id}
                                    className="edit-button"
                                >
                                    Edit
                                </Link>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={onDeleteSelected}
                        disabled={selectedCategories.length === 0}
                        className={`action-button  ${
                            selectedCategories.length === 0
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                        }`}
                    >
                        Delete Selected
                    </button>
                    
                </div>
            </div>
        </div>
        </div>
        </>
    );
}
