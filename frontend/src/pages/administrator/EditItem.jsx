import { useState, useCallback } from "react";
import {useDropzone} from 'react-dropzone'



export default function EditItem() {

    const [item, setItem] = useState({
        id: null,
        item_name: "",
        item_price: "",
        item_description: "",
        tokopedia_link: "",
        shoppee_link: "",
        whatsapp_link: "",
        available_stock: "",
        item_image: [], 
        category_name: [],
    });

    const onSubmit = (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append("id", item.id);
        formData.append("item_name", item.item_name);
        formData.append("item_price", item.item_price);
        formData.append("item_description", item.item_description);
        formData.append("tokopedia_link", item.tokopedia_link);
        formData.append("shoppee_link", item.shoppee_link);
        formData.append("whatsapp_link", item.whatsapp_link);
        formData.append("available_stock", item.available_stock);
    
        for (let i = 0; i < item.item_image.length; i++) {
            formData.append(`item_image_${i}`, item.item_image[i]);
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

    

    const [files, setFiles] = useState([]);


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
                <button type="submit">Add Item</button>
            </form>
        </>
    );
}
