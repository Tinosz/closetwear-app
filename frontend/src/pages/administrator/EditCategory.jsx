import React, { useState, useEffect } from "react";
import axiosClient from "../../client/axios-client";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

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
            {notification && <div>{notification}</div>}
            <form onSubmit={onSubmit}>
                <p>{isLoading ? "Loading..." : (id ? `Update: ${category.category_name}` : "")}</p>
                {errors && errors.category_name && (
                    <p className="text-red-600">{errors.category_name}</p>
                )}
                <input
                    placeholder="Category Name"
                    onChange={(e) =>
                        setCategory({
                            ...category,
                            category_name: e.target.value,
                        })
                    }
                    value={category.category_name}
                />
                <label>
                    <input
                        type="checkbox"
                        checked={Number(category.featured) === 1}
                        onChange={() => setCategory({
                            ...category,
                            featured: category.featured === 1 ? 0 : 1
                        })}
                    />
                    Featured?
                </label>
                <button type="submit">
                    {id ? "Update Category" : "Add Category"}
                </button>
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
        </>
    );
}
