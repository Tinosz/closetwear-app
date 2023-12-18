import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axiosClient from "../../client/axios-client";
import { useStateContext } from "../../context/ContextProvider";

import { DndContext, closestCenter } from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "../../components/form/SortableItems";

import "./styles/EditItemStyles.css";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export default function EditItem() {
    const { id } = useParams();
    const { setNotification } = useStateContext();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [featuredCategories, setFeaturedCategories] = useState([]);
    const [nonFeaturedCategories, setNonFeaturedCategories] = useState([]);
    const [errors, setErrors] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [item, setItem] = useState({
        id: null,
        item_name: "",
        item_price: "",
        item_description: "",
        tokopedia_link: "",
        shoppee_link: "",
        whatsapp_link: "",
        available_stock: 1,
        images: [],
        categories: [],
    });

    const onSubmit = (e) => {
        e.preventDefault();

        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true);

        let newOrder = [];

        // If it's an update, reset the order array
        if (!id) {
            newOrder = Array.from(
                { length: item.images.length },
                (_, index) => index + 1
            );
        }

        const formData = new FormData();
        formData.append("id", item.id);
        formData.append("item_name", item.item_name);
        formData.append("item_price", item.item_price);
        formData.append("item_description", item.item_description);

        item.categories.forEach((category) => {
            formData.append("categories[]", category);
        });

        formData.append("tokopedia_link", item.tokopedia_link);
        formData.append("shoppee_link", item.shoppee_link);
        formData.append("whatsapp_link", item.whatsapp_link);
        formData.append("available_stock", item.available_stock);

        for (let i = 0; i < item.images.length; i++) {
            formData.append(
                `images[${i}][item_image]`,
                item.images[i].item_image
            );

            // If it's an update, reset the order; otherwise, use the new order array
            formData.append(
                `images[${i}][item_image_order]`,
                id ? i + 1 : newOrder[i]
            );
        }

        // console.log(formData)

        if (id) {
            formData.append("_method", "PUT");
        }

        if (id) {
            console.log(formData);
            axiosClient
                .post(`/items/${item.id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                })
                .then(() => {
                    setNotification("Item was successfully updated.");
                    navigate("/Admin/ItemList");
                })
                .catch((err) => {
                    console.log(err);
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                    setIsSubmitting(false)
                });
        } else {
            // console.log(formData);
            axiosClient
                .post("/items", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then(() => {
                    setNotification("Item was successfully added.");
                    navigate("/Admin/ItemList");
                })
                .catch((err) => {
                    // console.log(err);
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                    setIsSubmitting(false)
                });
        }
    };

    const onDrop = useCallback((acceptedFiles) => {
        setItem((prevItem) => {
            const numUploadedImages = prevItem.images.length;
            const newOrders = Array.from(
                { length: acceptedFiles.length },
                (_, index) => numUploadedImages + index + 1
            );

            return {
                ...prevItem,
                images: [
                    ...prevItem.images,
                    ...acceptedFiles.map((file, index) => ({
                        item_image: file,
                        item_image_order: newOrders[index],
                    })),
                ],
            };
        });
    }, []);

    const handleImageRemove = (indexToRemove) => {
        setItem((prevItem) => {
            const updatedImages = prevItem.images
                .filter((_, index) => index !== indexToRemove)
                .map((image, index) => ({
                    ...image,
                    item_image_order: index + 1,
                }));
    
            return {
                ...prevItem,
                images: updatedImages,
            };
        });
    };
    

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [],
        },
    });

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
        getCategories();

        if (id) {
            axiosClient
                .get(`/items/${id}`)
                .then(({ data }) => {
                    const categoryIds = data.categories.map(
                        (category) => category.id
                    );
                    const sortedImages = data.images
                        .slice()
                        .sort(
                            (a, b) => a.item_image_order - b.item_image_order
                        );

                    setItem((prevItem) => ({
                        ...prevItem,
                        ...data,
                        categories: categoryIds,
                        images: sortedImages, // Update the images in sorted order
                    }));

                      console.log(data);
                })
                .catch(() => {});
        }
    }, [id]);

    function handleDragEnd(event) {
        const { active, over } = event;
        if (active.id !== over.id) {
            setItem((prevItem) => {
                const activeIndex = prevItem.images.findIndex(
                    (image) => image.item_image_order === active.id
                );

                const overIndex = prevItem.images.findIndex(
                    (image) => image.item_image_order === over.id
                );

                const reorderedImages = arrayMove(
                    prevItem.images,
                    activeIndex,
                    overIndex
                );

                return {
                    ...prevItem,
                    images: reorderedImages,
                };
            });
        }
    }

    const parallaxBg = document.querySelector('.parallax-bg');

    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        parallaxBg.style.transform = `translate3d(0, ${scrollPosition * 1}px, 0)`;
    });

    return (
        <>
        <div className="parallax-bg"></div>
        <div className="overlay"></div>
        <div className="edit-wrap">
        <div className="edit-item">
            {errors && (
                <div className="bg-red-500 text-white p-2 mb-4">
                    <ul>
                        {Object.values(errors).map((error, index) => (
                            <li key={index}>{error[0]}</li>
                        ))}
                    </ul>
                </div>
            )}
            <form className="form-wrap" onSubmit={onSubmit}>
                <div className="field field_v3">
                    <label for="item-name" className="ha-screen-reader">Item Name</label>
                    <input
                        placeholder="Item Name"
                        id="item-name"
                        className="field__input"
                        onChange={(e) =>
                            setItem({ ...item, item_name: e.target.value })
                        }
                        value={item.item_name}
                    />
                    <span class="field__label-wrap" aria-hidden="true">
                        <span class="field__label">Item Name</span>
                    </span>
                </div>

                <div className="field field_v3">
                    <label for="item-price" className="ha-screen-reader">Item Price</label>
                        <input
                        type="number"
                        id="item-price"
                        className="field__input"
                        placeholder="Price"
                        onChange={(e) =>
                            setItem({ ...item, item_price: e.target.value })
                        }
                        value={item.item_price}
                        />
                    <span class="field__label-wrap" aria-hidden="true">
                        <span class="field__label">Item Price</span>
                    </span>
                </div>

                <div className="field field_v3">
                    <label for="item-desc" className="ha-screen-reader">Item Description</label>
                        <textarea
                        placeholder="Item Description"
                        id="item-desc"
                        className="field__input"
                        onChange={(e) =>
                            setItem({ ...item, item_description: e.target.value })
                        }
                        value={item.item_description}
                        />
                    <span class="field__label-wrap" aria-hidden="true">
                        <span class="field__label">Item Description</span>
                    </span>
                </div>
                
                
                {featuredCategories.length > 0 && (
                    <div>
                        <h3>Featured Categories:</h3>
                        {featuredCategories.map((category) => (
                            <div className="checkbox-wrapper-24">
                                <input
                                    type="checkbox"
                                    id={category.id}
                                    checked={item.categories.includes(
                                        category.id
                                    )}
                                    onChange={() => {
                                        setItem((prevItem) => {
                                            const updatedCategoryId =
                                                prevItem.categories.includes(
                                                    category.id
                                                )
                                                    ? prevItem.categories.filter(
                                                          (id) =>
                                                              id !== category.id
                                                      )
                                                    : [
                                                          ...prevItem.categories,
                                                          category.id,
                                                      ];
        
                                            return {
                                                ...prevItem,
                                                categories: updatedCategoryId,
                                            };
                                        });
                                    }}
                                />
                            <label for={category.id} key={category.id}>
                                <span></span>{category.category_name} <FontAwesomeIcon icon={faStar} />
                            </label>
                            </div>
                        ))}
                    </div>
                )}

                {nonFeaturedCategories.length > 0 && (
                    <div>
                        <h3>Non-Featured Categories:</h3>
                        {nonFeaturedCategories.filter((category) => category.id !== 1).map((category) => (
                            <div className="checkbox-wrapper-24">
                                <input
                                    type="checkbox"
                                    id={category.id}
                                    checked={item.categories.includes(
                                        category.id
                                    )}
                                    onChange={() => {
                                        setItem((prevItem) => {
                                            const updatedCategoryId =
                                                prevItem.categories.includes(
                                                    category.id
                                                )
                                                    ? prevItem.categories.filter(
                                                          (id) =>
                                                              id !== category.id
                                                      )
                                                    : [
                                                          ...prevItem.categories,
                                                          category.id,
                                                      ];

                                            return {
                                                ...prevItem,
                                                categories: updatedCategoryId,
                                            };
                                        });
                                    }}
                                />
                            <label for={category.id} key={category.id}>
                                <span></span>{category.category_name}
                            </label>
                            </div>
                        ))}
                    </div>
                )}
                <div className="field field_v3">
                    <label for="tokopedia" className="ha-screen-reader">Tokopedia  Link </label>
                        <input
                        placeholder="Tokopedia Link"
                        id="tokopedia"
                        className="field__input"
                        onChange={(e) =>
                            setItem({ ...item, tokopedia_link: e.target.value })
                        }
                        value={item.tokopedia_link}
                        />
                    <span class="field__label-wrap" aria-hidden="true">
                        <span class="field__label">Tokopedia Link</span>
                    </span>
                </div>

                <div className="field field_v3">
                    <label for="shopee" className="ha-screen-reader">Shopee Link </label>
                        <input
                        placeholder="Shoppee Link"
                        id="shopee"
                        className="field__input"
                        onChange={(e) =>
                            setItem({ ...item, shoppee_link: e.target.value })
                        }
                        value={item.shoppee_link}
                        />
                    <span class="field__label-wrap" aria-hidden="true">
                        <span class="field__label">Shopee Link</span>
                    </span>
                </div>

                <div className="field field_v3">
                    <label for="whatsapp" className="ha-screen-reader">WhatsApp  Link </label>
                        <input
                        placeholder="Whatsapp Link"
                        id="whatsapp"
                        className="field__input"
                        onChange={(e) =>
                            setItem({ ...item, whatsapp_link: e.target.value })
                        }
                        value={item.whatsapp_link}
                        />
                    <span class="field__label-wrap" aria-hidden="true">
                        <span class="field__label">WhatsApp Link</span>
                    </span>
                </div>

                <div
                    {...getRootProps()}
                    className="border-4 h-[250px] w-[500px] rounded-md p-10 m-10 border-red-500 flex items-center justify-center"
                >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <p>Drop your images here ...</p>
                    ) : (
                        <p>
                            Drag and drop some images here, or click to select
                            files
                        </p>
                    )}
                </div>

                <div className="drag-img-wrap">
                <DndContext
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    {item.images.length > 0 && (
                        <div >
                            <h3>Selected Images:</h3>
                            <SortableContext
                                items={item.images.map(
                                    (image) => image.item_image_order
                                )}
                                
                                strategy={horizontalListSortingStrategy}
                            >
                                {item.images.map((image, index) => (
                                    <SortableItem
                                        key={image.id}
                                        id={image.item_image_order}
                                        index={index}
                                        handleImageRemove={handleImageRemove}
                                        image={image.item_image}
                                        handle
                                    />
                                ))}
                            </SortableContext>
                        </div>
                    )}
                </DndContext>
                </div>

                <p>Available Stock?</p>
                <div className="checkbox-wrapper-24">
                    <input
                        type="checkbox"
                        id="available"
                        checked={Number(item.available_stock) === 1}
                        onChange={() =>
                            setItem({
                                ...item,
                                available_stock:
                                    item.available_stock === 1 ? 0 : 1,
                            })
                        }
                    />
                <label for="available"><span></span>Available</label>
                </div>
                <div>
                    <button type="submit" className="bg-blue-300" disabled={isSubmitting}>
                    {id ? "Update Item" : "Add Item"}
                    </button>
                </div>
            </form>
        </div>
        </div>
        </>
    );
}
