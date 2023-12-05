import { useEffect, useState } from "react";
import axiosClient from "../../client/axios-client";
import { useStateContext } from "../../context/ContextProvider";
import { Link } from "react-router-dom";

export default function ItemList() {
    const { notification } = useStateContext();
    const [items, setItems] = useState([]);

    const getItems = () => {
        axiosClient.get("items").then((response) => {
            console.log(response.data);
            setItems(response.data);
        });
    };

    useEffect(() => {
        getItems();
    }, []);

    return (
        <>
            <h2>Item List:</h2>
            <table>
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Product Name</th>
                        <th>Images</th>
                        <th>Price</th>
                        <th>Categories</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {items.length > 0 ? (
                        items.map((item, index) => (
                            <tr key={item.id}>
                                <td>{index + 1}</td>
                                <td>{item.item_name}</td>
                                <td>
                                    {item.images.map((image, imgIndex) => (
                                        <span key={imgIndex}>
                                            <img className="w-20" src={`${import.meta.env.VITE_API_BASE_URL}/storage/${image.item_image}`} alt={`Image ${imgIndex + 1}`} />
                                        </span>
                                    ))}
                                </td>
                                <td>{item.item_price}</td>
                                <td>
                                    <ul>
                                        {item.categories.filter(category => category.id !== 1).map(
                                            (category, catIndex) => (
                                                <li key={catIndex}>
                                                    {category.category_name}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </td>
                                <td>
                                    <Link to={"/Admin/EditItem/" + item.id}>
                                        Edit
                                    </Link>
                                </td>
                                <td>
                                    <button>Delete</button>
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
        </>
    );
}
