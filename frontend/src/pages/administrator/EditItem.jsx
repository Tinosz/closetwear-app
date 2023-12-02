import { useState, useCallback, useEffect } from "react";
import {useDropzone} from 'react-dropzone'
import axiosClient from "../../client/axios-client";



export default function EditItem() {
    const [categories, setCategories] = useState([]);
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
        category_id: [],
    });

    const onSubmit = (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append("id", item.id);
        formData.append("item_name", item.item_name);
        formData.append("item_price", item.item_price);
        formData.append("item_description", item.item_description);
        item.category_id.forEach((categoryId) => {
            formData.append("category_id", categoryId);
        });           
        formData.append("tokopedia_link", item.tokopedia_link);
        formData.append("shoppee_link", item.shoppee_link);
        formData.append("whatsapp_link", item.whatsapp_link);
        formData.append("available_stock", item.available_stock);

    
        for (let i = 0; i < item.item_image.length; i++) {
            formData.append(`item_image`, item.item_image[i]);
        }

        console.log(formData);
    };
    

    const onDrop = useCallback((acceptedFiles) => {
        setItem((prevItem) => ({
            ...prevItem,
            item_image: [...prevItem.item_image, ...acceptedFiles], // Append new files to the existing array
        }));
    }, []);

    const handleImageRemove = (indexToRemove) => {
    setItem((prevItem) => ({
        ...prevItem,
        item_image: prevItem.item_image.filter((_, index) => index !== indexToRemove),
    }));
};

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*':[]
        }
    })

    const getCategories = () => {
        axiosClient
        .get("categories")
        .then((response) => {
            console.log(response.data);
            setCategories(response.data);
        })
        .catch(() => {
            
        })
        .finally(() => {
            // setIsLoading(false);
        });
    }

    useEffect(() => {
        getCategories();
    }, []);
    // const [files, setFiles] = useState([]);


    return (
        <>
            <form onSubmit={onSubmit}>
                <input
                    placeholder="Product Name"
                    onChange={(e) =>
                        setItem({ ...item, item_name: e.target.value })
                    }
                />
                <textarea
                    placeholder="Product Description"
                    onChange={(e) =>
                        setItem({ ...item, item_description: e.target.value })
                    }
                />
                {categories.map((category) => (
                        <label key={category.id}>
                            <input
                                type="checkbox"
                                checked={item.category_id.includes(category.id)}
                                onChange={() => {
                                    setItem((prevItem) => {
                                        const updatedCategoryId = prevItem.category_id.includes(category.id)
                                            ? prevItem.category_id.filter((id) => id !== category.id)
                                            : [...prevItem.category_id, category.id];

                                        return {
                                            ...prevItem,
                                            category_id: updatedCategoryId,
                                        };
                                    });
                                }}
                            />
                            {category.category_name}
                        </label>
                        ))}
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
                                <p>Drag and drop some images here, or click to select files</p>
                            )}
                            
                </div>        
                {/* Selected Images Preview */}
                {item.item_image.length > 0 && (
                    <div>
                        <h3>Selected Images:</h3>
                        {item.item_image.map((image, index) => (
                            <div key={index} className="image-preview">
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt={`Preview ${index}`}
                                    className="w-40"
                                    onLoad={() => {
                                        URL.revokeObjectURL(URL.createObjectURL(image))
                                    }}
                                />
                                <p>{image.name}</p>
                                <button
                                    type="button"
                                    onClick={() => handleImageRemove(index)}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                <p>Available Stock:</p>
                <label>
                    <input
                        type="radio"
                        name="available_stock"
                        value="1"
                        checked={item.available_stock === 1}
                        onChange={() => setItem({ ...item, available_stock: 1 })}
                    />
                    Yes
                </label>
                <label>
                    <input
                        type="radio"
                        name="available_stock"
                        value="0"
                        checked={item.available_stock === 0}
                        onChange={() => setItem({ ...item, available_stock: 0 })}
                    />
                    No
                </label>
                
        
                {/* <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                />

                {item.item_image.length > 0 && (
                    <div>
                        <h3>Selected Images:</h3>
                        {item.item_image.map((image, index) => (
                            <div key={index} className="image-preview">
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt={`Preview ${index}`}
                                    className="w-40"
                                />
                                <p>{image.name}</p>
                                <button
                                    type="button"
                                    onClick={() => handleImageRemove(index)}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )} */}
                <div>
                    <button type="submit" className="bg-blue-300">Add Item</button>
                </div>
            </form>
        </>
    );
}
