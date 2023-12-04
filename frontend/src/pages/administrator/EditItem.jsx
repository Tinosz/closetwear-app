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

export default function EditItem() {
    const { id } = useParams();
    const { setNotification } = useStateContext();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState(null);
    const [item, setItem] = useState({
        id: null,
        item_name: "",
        item_price: "",
        item_description: "",
        tokopedia_link: "",
        shoppee_link: "",
        whatsapp_link: "",
        available_stock: 1,
        item_image: [],
        item_image_order: [],
        categories: [],
    });

    const onSubmit = (e) => {
        e.preventDefault();

        // Create a new order array based on the current order of item_image
        const newOrder = Array.from(
            { length: item.item_image.length },
            (_, index) => index + 1
        );

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

        for (let i = 0; i < item.item_image.length; i++) {
            formData.append(`item_image[]`, item.item_image[i]);
            formData.append(`item_image_order[]`, newOrder[i]); // Use the new order
        }
        
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
                });
        } else {
            console.log(formData);
            axiosClient
                .post("/items", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then(() => {
                    setNotification("Category was successfully added.");
                    navigate("/Admin/ItemList");
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

    const onDrop = useCallback((acceptedFiles) => {
        setItem((prevItem) => {
            const numUploadedImages = prevItem.item_image.length;
            const newOrders = Array.from(
                { length: acceptedFiles.length },
                (_, index) => numUploadedImages + index + 1
            );

            return {
                ...prevItem,
                item_image: [...prevItem.item_image, ...acceptedFiles],
                item_image_order: [...prevItem.item_image_order, ...newOrders],
            };
        });
    }, []);

    const handleImageRemove = (indexToRemove) => {
        setItem((prevItem) => {
            const updatedImages = prevItem.item_image.filter(
                (_, index) => index !== indexToRemove
            );
            const updatedOrders = prevItem.item_image_order.filter(
                (_, index) => index !== indexToRemove
            );

            return {
                ...prevItem,
                item_image: updatedImages,
                item_image_order: updatedOrders,
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
                console.log(response.data);
                setCategories(response.data);
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
                    setItem(data);
                    console.log(data);
                })
                .catch(() => {});
        }
    }, []);

    function handleDragEnd(event) {
        const { active, over } = event;
        if (active.id !== over.id) {
            setItem((prevItem) => {
                const activeIndex = prevItem.item_image_order.indexOf(
                    active.id
                );
                const overIndex = prevItem.item_image_order.indexOf(over.id);

                const reorderedImages = arrayMove(
                    prevItem.item_image,
                    activeIndex,
                    overIndex
                );

                const reorderedOrders = arrayMove(
                    prevItem.item_image_order,
                    activeIndex,
                    overIndex
                );

                return {
                    ...prevItem,
                    item_image: reorderedImages,
                    item_image_order: reorderedOrders,
                };
            });
        }
    }

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
                    placeholder="Item Name"
                    onChange={(e) =>
                        setItem({ ...item, item_name: e.target.value })
                    }
                />
                <input
                    type="number"
                    placeholder="Price"
                    onChange={(e) =>
                        setItem({ ...item, item_price: e.target.value })
                    }
                />
                <textarea
                    placeholder="Item Description"
                    onChange={(e) =>
                        setItem({ ...item, item_description: e.target.value })
                    }
                />
                {categories.length > 0 ? (
                    categories.map((category) => (
                        <label key={category.id}>
                            <input
                                type="checkbox"
                                checked={item.categories.includes(category.id)}
                                onChange={() => {
                                    setItem((prevItem) => {
                                        const updatedCategoryId =
                                            prevItem.categories.includes(
                                                category.id
                                            )
                                                ? prevItem.categories.filter(
                                                      (id) => id !== category.id
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
                            {category.category_name}
                        </label>
                    ))
                ) : (
                    <p>No categories available.</p>
                )}

                <input
                    placeholder="Tokopedia Link"
                    onChange={(e) =>
                        setItem({ ...item, tokopedia_link: e.target.value })
                    }
                />
                <input
                    placeholder="Shoppee Link"
                    onChange={(e) =>
                        setItem({ ...item, shoppee_link: e.target.value })
                    }
                />
                <input
                    placeholder="Whatsapp Link"
                    onChange={(e) =>
                        setItem({ ...item, whatsapp_link: e.target.value })
                    }
                />

                <div {...getRootProps()}>
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
                <DndContext
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    {item.item_image_order.length > 0 && (
                        <div>
                            <h3>Selected Images:</h3>
                            <SortableContext
                                items={item.item_image_order}
                                strategy={horizontalListSortingStrategy}
                            >
                                {item.item_image_order.map((order, index) => (
                                    <SortableItem
                                        key={order}
                                        id={order}
                                        index={index}
                                        handleImageRemove={handleImageRemove}
                                        image={item.item_image[index]}
                                        handle
                                    />
                                ))}
                            </SortableContext>
                        </div>
                    )}
                </DndContext>
                <p>Available Stock:</p>
                <label>
                    <input
                        type="radio"
                        name="available_stock"
                        value="1"
                        checked={item.available_stock === 1}
                        onChange={() =>
                            setItem({ ...item, available_stock: 1 })
                        }
                    />
                    Yes
                </label>
                <label>
                    <input
                        type="radio"
                        name="available_stock"
                        value="0"
                        checked={item.available_stock === 0}
                        onChange={() =>
                            setItem({ ...item, available_stock: 0 })
                        }
                    />
                    No
                </label>
                <div>
                    <button type="submit" className="bg-blue-300">
                        Add Item
                    </button>
                </div>
            </form>
        </>
    );
}
