import React, { useEffect, useState } from "react";
import axiosClient from "../../client/axios-client";
import { useNavigate, useParams } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import useSearch from "../../page-groups/useSearch";
import SearchBar from "../../components/SearchBar";

import "./styles/EditBannerStyles.css";

export default function EditBanner() {
    const { id } = useParams();
    const [errors, setErrors] = useState(null);
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [featuredCategories, setFeaturedCategories] = useState([]);
    const [nonFeaturedCategories, setNonFeaturedCategories] = useState([]);
    const { setNotification } = useStateContext();
    const { filteredData, handleFilter } = useSearch();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [banner, setBanner] = useState({
        id: null,
        banner_image: null,
        banner_title: "",
        banner_subtitle: "",
        banner_description: "",
        items: [],
        categories: [],
    });

    const navigate = useNavigate();

    if (id) {
        useEffect(() => {
            axiosClient
                .get(`/banners/${id}`)
                .then(({ data }) => {
                    setBanner(data);
                    console.log(data);
                })
                .catch(() => {});
        }, []);
    }

    const getItems = () => {
        axiosClient
            .get("items")
            .then((response) => {
                console.log(response.data);
                setItems(response.data);
            })
            .catch(() => {})
            .finally(() => {
                // setIsLoading(false);
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

                setCategories(allCategories);
                setFeaturedCategories(featured);
                setNonFeaturedCategories(nonFeatured);
            })
            .catch(() => {})
            .finally(() => {
                // setIsLoading(false);
            });
    };

    useEffect(() => {
        // Fetch data from the Laravel API endpoint
        axiosClient
            .get("/search")
            .then((response) => {
                // Assuming your data structure is { result: [...] }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    useEffect(() => {
        getItems();
        getCategories();
        if (id) {
            axiosClient.get(`/banners/${id}`).then(({ data }) => {
                const categoryIds = data.categories.map(
                    (category) => category.id
                );
                const itemIds = data.items.map((item) => item.id);
                setBanner((prevBanner) => ({
                    ...prevBanner,
                    ...data,
                    categories: categoryIds,
                    items: itemIds,
                    imageUrl: `${import.meta.env.VITE_API_BASE_URL}/storage/${
                        data.banner_image
                    }`, // Set imageUrl here
                }));
            });
        }
    }, []);

    const onSubmit = (e) => {
        e.preventDefault();

        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append("id", banner.id);
        formData.append("banner_image", banner.banner_image);
        formData.append("banner_title", banner.banner_title);
        formData.append("banner_subtitle", banner.banner_subtitle);
        formData.append("banner_description", banner.banner_description);
        banner.items.forEach((item) => {
            formData.append("items[]", item);
        });

        banner.categories.forEach((category) => {
            formData.append("categories[]", category);
        });

        console.log(formData);

        if (id) {
            formData.append("_method", "PUT");
        }

        if (id) {
            console.log(formData);
            axiosClient
                .post(`/banners/${banner.id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                })
                .then(() => {
                    setNotification("Banner was successfully updated.");
                    navigate("/Admin/BannerList");
                })
                .catch((err) => {
                    console.log(err);
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                    setIsSubmitting(false);
                });
        } else {
            console.log(formData);
            axiosClient
                .post("/banners", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then(() => {
                    setNotification("Banner was successfully added");
                    navigate("/Admin/BannerList");
                })
                .catch((err) => {
                    console.log(err);
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                    setIsSubmitting(false);
                });
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            const imageUrl = URL.createObjectURL(selectedFile);
            setBanner({
                ...banner,
                banner_image: selectedFile,
                imageUrl: imageUrl,
            });
        } else {
            // If no file is selected, reset the banner_image and imageUrl
            setBanner({ ...banner, banner_image: null, imageUrl: null });
        }
    };

    const parallaxBg = document.querySelector(".parallax-bg");

    window.addEventListener("scroll", () => {
        const scrollPosition = window.scrollY;
        parallaxBg.style.transform = `translate3d(0, ${
            scrollPosition * 1
        }px, 0)`;
    });

    return (
        <>
            <div className="parallax-bg"></div>
            <div className="overlay"></div>
            <div className="editBanner-wrap">
                <div className="editBanner-container">
                    {errors && (
                        <div className="bg-red-500 text-white p-2 mb-4">
                            <ul>
                                {Object.values(errors).map((error, index) => (
                                    <li key={index}>{error[0]}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <form onSubmit={onSubmit}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        {banner.banner_image && (
                            <div className="banner-edit-image w-40">
                                {banner.banner_image && (
                                    <div className="banner-edit-image w-40">
                                        <img
                                            src={banner.imageUrl}
                                            alt="banner preview"
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="field field_v3">
                            <input
                                className="field__input"
                                value={banner.banner_title}
                                type="text"
                                placeholder="Banner Title"
                                onChange={(e) =>
                                    setBanner({
                                        ...banner,
                                        banner_title: e.target.value,
                                    })
                                }
                            />
                            <span
                                className="field__label-wrap"
                                aria-hidden="true"
                            >
                                <span className="field__label">Title</span>
                            </span>
                        </div>

                        <div className="field field_v3">
                            <input
                                className="field__input"
                                value={banner.banner_subtitle}
                                type="text"
                                placeholder="Banner Subtitle"
                                onChange={(e) =>
                                    setBanner({
                                        ...banner,
                                        banner_subtitle: e.target.value,
                                    })
                                }
                            />
                            <span
                                className="field__label-wrap"
                                aria-hidden="true"
                            >
                                <span className="field__label">Subtitle</span>
                            </span>
                        </div>

                        <div className="field field_v3">
                            <textarea
                                className="field__input"
                                style={{ height: "15vh" }}
                                value={banner.banner_description}
                                placeholder="Banner Description"
                                onChange={(e) =>
                                    setBanner({
                                        ...banner,
                                        banner_description: e.target.value,
                                    })
                                }
                            />
                            <span
                                className="field__label-wrap"
                                aria-hidden="true"
                            >
                                <span className="field__label">
                                    Description
                                </span>
                            </span>
                        </div>

                        <h2>Featured Categories:</h2>

                        {featuredCategories.length > 0 ? (
                            featuredCategories.map((category) => (
                                <div
                                    className="checkbox-wrapper-24"
                                    key={category.id}
                                >
                                    <input
                                        type="checkbox"
                                        id={category.id}
                                        className="field__input"
                                        checked={banner.categories.includes(
                                            category.id
                                        )}
                                        onChange={() => {
                                            setBanner((prevBanner) => {
                                                const updatedCategoryId =
                                                    prevBanner.categories.includes(
                                                        category.id
                                                    )
                                                        ? prevBanner.categories.filter(
                                                              (id) =>
                                                                  id !==
                                                                  category.id
                                                          )
                                                        : [
                                                              ...prevBanner.categories,
                                                              category.id,
                                                          ];

                                                return {
                                                    ...prevBanner,
                                                    categories:
                                                        updatedCategoryId,
                                                };
                                            });
                                        }}
                                    />
                                    <label htmlFor={category.id}>
                                        <span></span>
                                        {category.category_name}
                                        <FontAwesomeIcon icon={faStar} />
                                    </label>
                                </div>
                            ))
                        ) : (
                            <p>No Featured Categories Available</p>
                        )}
                        <h2>Non-Featured Categories:</h2>
                        {nonFeaturedCategories.length > 1 ? (
                            nonFeaturedCategories
                                .filter((category) => category.id !== 1)
                                .map((category) => (
                                    <div
                                        className="checkbox-wrapper-24"
                                        key={category.id}
                                    >
                                        <input
                                            type="checkbox"
                                            id={category.id}
                                            className="field__input"
                                            checked={banner.categories.includes(
                                                category.id
                                            )}
                                            onChange={() => {
                                                setBanner((prevBanner) => {
                                                    const updatedCategoryId =
                                                        prevBanner.categories.includes(
                                                            category.id
                                                        )
                                                            ? prevBanner.categories.filter(
                                                                  (id) =>
                                                                      id !==
                                                                      category.id
                                                              )
                                                            : [
                                                                  ...prevBanner.categories,
                                                                  category.id,
                                                              ];

                                                    return {
                                                        ...prevBanner,
                                                        categories:
                                                            updatedCategoryId,
                                                    };
                                                });
                                            }}
                                        />
                                        <label htmlFor={category.id}>
                                            <span></span>
                                            {category.category_name}
                                        </label>
                                    </div>
                                ))
                        ) : (
                            <p>No Non-Featured Categories Available</p>
                        )}

                        <SearchBar
                            placeholder="Search items..."
                            onFilter={handleFilter}
                        />
                        <h2>Item List:</h2>
                        <div className="">
                            <table className="bl-form-container text-center align-self-center">
                                <thead>
                                    <tr>
                                        <th>Checkbox</th>
                                        <th>No.</th>
                                        <th>Item Name</th>
                                        <th>Images</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.length > 0 ? (
                                        filteredData
                                            .filter(
                                                (item) =>
                                                    item.available_stock === "1"
                                            )
                                            .map((item, index) => (
                                                <tr key={item.id}>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={banner.items.includes(
                                                                item.id
                                                            )}
                                                            onChange={() => {
                                                                setBanner(
                                                                    (
                                                                        prevBanner
                                                                    ) => {
                                                                        const updatedItemIds =
                                                                            prevBanner.items.includes(
                                                                                item.id
                                                                            )
                                                                                ? prevBanner.items.filter(
                                                                                      (
                                                                                          id
                                                                                      ) =>
                                                                                          id !==
                                                                                          item.id
                                                                                  )
                                                                                : [
                                                                                      ...prevBanner.items,
                                                                                      item.id,
                                                                                  ];

                                                                        return {
                                                                            ...prevBanner,
                                                                            items: updatedItemIds,
                                                                        };
                                                                    }
                                                                );
                                                            }}
                                                        />
                                                    </td>
                                                    <td>{index + 1}</td>
                                                    <td>{item.item_name}</td>
                                                    <td>
                                                        {item.images
                                                            .sort(
                                                                (a, b) =>
                                                                    a.item_image_order -
                                                                    b.item_image_order
                                                            )
                                                            .map(
                                                                (
                                                                    image,
                                                                    imgIndex
                                                                ) => (
                                                                    <span
                                                                        key={
                                                                            imgIndex
                                                                        }
                                                                    >
                                                                        <img
                                                                            className="w-20"
                                                                            src={`${
                                                                                import.meta
                                                                                    .env
                                                                                    .VITE_API_BASE_URL
                                                                            }/storage/${
                                                                                image.item_image
                                                                            }`}
                                                                            alt={`Image ${
                                                                                imgIndex +
                                                                                1
                                                                            }`}
                                                                        />
                                                                    </span>
                                                                )
                                                            )}
                                                    </td>
                                                </tr>
                                            ))
                                    ) : (
                                        <tr>
                                            <th style={{ width: "10%" }}>
                                                Checkbox
                                            </th>
                                            <th style={{ width: "10%" }}>
                                                No.
                                            </th>
                                            <th style={{ width: "30%" }}>
                                                Item Name
                                            </th>
                                            <th style={{ width: "50%" }}>
                                                Images
                                            </th>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <button
                                className="bot-button"
                                style={{ marginTop: "20px" }}
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {id ? "Update Banner" : "Add Banner"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
