import { useEffect, useState } from "react";
import axiosClient from "../../client/axios-client";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export default function EditBanner() {
    const { id } = useParams();
    const [errors, setErrors] = useState(null);
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [featuredCategories, setFeaturedCategories] = useState([]);
    const [nonFeaturedCategories, setNonFeaturedCategories] = useState([]);
    const { setNotification } = useStateContext();
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
                    const response = err.reponse;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
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
                    setNotification("Banner was successcully added");
                    navigate("/Admin/BannerList");
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

    return (
        <>
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
                <input value={banner.banner_title} type="text" placeholder="Banner Title" onChange={(e) =>
                setBanner({...banner, banner_title:e.target.value})
                }/>
                <input value={banner.banner_subtitle} type="text" placeholder="Banner Subtitle" onChange={(e) =>
                setBanner({...banner, banner_subtitle:e.target.value})
                }/>
                <textarea value={banner.banner_description}  placeholder="Banner Description" onChange={(e) =>
                setBanner({...banner, banner_description:e.target.value})
                }/>
                <h2>Featured Categories:</h2>
                {featuredCategories.length > 0 ? (
                    featuredCategories.map((category) => (
                        <label key={category.id}>
                            <input
                                type="checkbox"
                                checked={banner.categories.includes(
                                    category.id
                                )}
                                onChange={() => {
                                    setBanner((prevBanner) => {
                                        const updatedCategoryId = prevBanner.categories.includes(
                                            category.id
                                        )
                                            ? prevBanner.categories.filter(
                                                  (id) => id !== category.id
                                              )
                                            : [
                                                  ...prevBanner.categories,
                                                  category.id,
                                              ];

                                        return {
                                            ...prevBanner,
                                            categories: updatedCategoryId,
                                        };
                                    });
                                }}
                            />
                            {category.category_name}<FontAwesomeIcon icon={faStar} />
                        </label>
                    ))
                ) : (
                    <p>No Featured Categories Available</p>
                )}
                <h2>Non-Featured Categories:</h2>
                {nonFeaturedCategories.length > 1 ? (
                    nonFeaturedCategories.filter((category) => category.id!==1).map((category) => (
                        <label key={category.id}>
                            <input
                                type="checkbox"
                                checked={banner.categories.includes(
                                    category.id
                                )}
                                onChange={() => {
                                    setBanner((prevBanner) => {
                                        const updatedCategoryId = prevBanner.categories.includes(
                                            category.id
                                        )
                                            ? prevBanner.categories.filter(
                                                  (id) => id !== category.id
                                              )
                                            : [
                                                  ...prevBanner.categories,
                                                  category.id,
                                              ];

                                        return {
                                            ...prevBanner,
                                            categories: updatedCategoryId,
                                        };
                                    });
                                }}
                            />
                            {category.category_name} 
                        </label>
                    ))
                ) : (
                    <p>No Non-Featured Categories Available</p>
                )}
                <h2>Item List:</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Checkbox</th>
                            <th>No.</th>
                            <th>Item Name</th>
                            <th>Images</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length > 0 ? (
                            items.map((item, index) => (
                                <tr key={item.id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={banner.items.includes(
                                                item.id
                                            )}
                                            onChange={() => {
                                                setBanner((prevBanner) => {
                                                    const updatedItemIds =
                                                        prevBanner.items.includes(
                                                            item.id
                                                        )
                                                            ? prevBanner.items.filter(
                                                                  (id) =>
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
                                                });
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
                                            .map((image, imgIndex) => (
                                                <span key={imgIndex}>
                                                    <img
                                                        className="w-20"
                                                        src={`${
                                                            import.meta.env
                                                                .VITE_API_BASE_URL
                                                        }/storage/${
                                                            image.item_image
                                                        }`}
                                                        alt={`Image ${
                                                            imgIndex + 1
                                                        }`}
                                                    />
                                                </span>
                                            ))}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7">No Items available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div>
                    <button type="submit">Add Banner</button>
                </div>
            </form>
        </>
    );
}
