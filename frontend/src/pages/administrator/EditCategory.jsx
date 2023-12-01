import React, { useState, useEffect } from "react";
import axiosClient from "../../client/axios-client";
import { useNavigate, useParams } from "react-router-dom";

export default function EditCategory() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [category, setCategory] = useState({
        id: null,
        category_name: "",
    });
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState(null); 

    const onSubmit = (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append("category_name", category.category_name);
    
        console.log(formData);
    
        if (id) {
            axiosClient
                .post(`/categories/${category.id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                })
                .then(() => {
                    navigate("/Admin/EditCategories");
                    // Fetch updated categories after successful submission
                    getCategories();
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
                    navigate("/Admin/EditCategories");
                    // Fetch updated categories after successful submission
                    getCategories();
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
        if (!window.confirm("Are you sure you want to delete the selected categories?")) {
            return;
        }
    
        const deletePromises = selectedCategories.map((categoryId) => {
            return axiosClient.delete(`/categories/${categoryId}`);
        });
    
        Promise.all(deletePromises)
            .then(() => {
                // All delete requests were successful
                getCategories();
            })
            .catch((err) => {
                console.log(err);
                // Handle errors, e.g., show an error message to the user
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

    useEffect(() => {
        getCategories();
    }, []);

    const getCategories = () => {
        axiosClient
            .get("categories")
            .then((response) => {
                setCategories(response.data);
            })
            .catch(() => {
                // handle loading or error
            });
    };

    return (
        <>
            <form onSubmit={onSubmit}>
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
                />
                <button type="submit">Add Category</button>
            </form>
            <div>
                <label>
                    <input
                        type="checkbox"
                        onChange={(e) => onCheckAll(e.target.checked)}
                    />
                    Check All
                </label>
                {categories.map((c) => (
                    <div key={c.id}>
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedCategories.includes(c.id)}
                                onChange={() => toggleCategorySelection(c.id)}
                            />
                            {c.category_name}
                        </label>
                    </div>
                ))}
                    <button
                        onClick={onDeleteSelected}
                        disabled={selectedCategories.length === 0}
                        className={`bg-red-500  ${selectedCategories.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Delete Selected
                    </button>
            </div>
        </>
    );
}
