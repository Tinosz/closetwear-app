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
        images: [],
        categories: [],
    });

    const onSubmit = (e) => {
        e.preventDefault();

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
            formData.append(`images[${i}][item_image]`, item.images[i].item_image);
            
            // If it's an update, reset the order; otherwise, use the new order array
            formData.append(`images[${i}][item_image_order]`, id ? i + 1 : newOrder[i]);
        }

        console.log(formData)
        
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
                    setNotification("Item was successfully added.");
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
            const updatedImages = prevItem.images.filter(
                (_, index) => index !== indexToRemove
            );
    
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
              const categoryIds = data.categories.map(category => category.id);
              const sortedImages = data.images.slice().sort((a, b) => a.item_image_order - b.item_image_order);

            setItem(prevItem => ({
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
                    value={item.item_name}
                />
                <input
                    type="number"
                    placeholder="Price"
                    onChange={(e) =>
                        setItem({ ...item, item_price: e.target.value })
                    }
                    value={item.item_price}
                />
                <textarea
                    placeholder="Item Description"
                    onChange={(e) =>
                        setItem({ ...item, item_description: e.target.value })
                    }
                    value={item.item_description}
                />
                {categories.length > 0 ? (
                    
                    categories.filter(category => category.id !== 1).map((category) => (
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
                    value={item.tokopedia_link}
                />
                <input
                    placeholder="Shoppee Link"
                    onChange={(e) =>
                        setItem({ ...item, shoppee_link: e.target.value })
                    }
                    value={item.shoppee_link}
                />
                <input
                    placeholder="Whatsapp Link"
                    onChange={(e) =>
                        setItem({ ...item, whatsapp_link: e.target.value })
                    }
                    value={item.whatsapp_link}
                />

                <div {...getRootProps()} className="border-4 h-[250px] w-[500px] rounded-md p-10 m-10 border-red-500 flex items-center justify-center">
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
    {item.images.length > 0 && (
        <div>
            <h3>Selected Images:</h3>
            <SortableContext
                items={item.images.map((image) => image.item_image_order)}
                strategy={horizontalListSortingStrategy}
            >
                {/* Sort the images array by item_image_order */}
                {item.images
                    .map((image, index) => (
                        <SortableItem
                            key={image.item_image_order}
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


                <p>Available Stock:</p>
                <label>
                    <input
                        type="radio"
                        name="available_stock"
                        value="1"
                        checked={Number(item.available_stock) === 1}
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
                        checked={Number(item.available_stock) === 0}
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