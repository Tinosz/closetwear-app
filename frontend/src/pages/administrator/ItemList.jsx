import { useEffect, useState } from "react";
import axiosClient from "../../client/axios-client";
import { useStateContext } from "../../context/ContextProvider";
import { Link, useParams } from "react-router-dom";

export default function ItemList() {
    const { notification } = useStateContext();
    const [items, setItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [pagination, setPagination] = useState({});
    const handleEditClick = async (item) => {
        try {
            // Make a request to increment item_click
            await axiosClient.post(`/items/${item.id}/increment-click`);

            // Now navigate to the EditItem page
            window.location.href = `/Admin/EditItem/${item.id}`;
        } catch (error) {
            console.error("Error incrementing item click count:", error);
        }
    };
    const getItems = (page = 1) => {
        axiosClient.get(`items?page=${page}`).then((response) => {
            console.log(response.data);
            setItems(response.data.data);
            setPagination(response.data);
        });
    };

    useEffect(() => {
        getItems();
    }, []);

    const onDelete = (item) => {
        if (!window.confirm("Are you sure you want to delete this item?")) {
            return;
        }

        axiosClient.delete(`/items/${item.id}`).then(() => {
            getItems();
        });
    };

    const toggleItemSelection = (itemId) => {
        setSelectedItems((prevSelected) =>
            prevSelected.includes(itemId)
                ? prevSelected.filter((id) => id !== itemId)
                : [...prevSelected, itemId]
        );
    };

    const onMultipleDelete = () => {
        if (
            !window.confirm(
                "Are you sure you want to delete the selected items?"
            )
        ) {
            return;
        }

        axiosClient
            .delete("/items/delete-multiple", {
                data: { itemIds: selectedItems },
            })
            .then(() => {
                getItems();
                setSelectedItems([]);
            });
    };

    const onPageChange = (label) => {
        let page;
        switch (label) {
            case 'Next &raquo;':
                page = pagination.current_page + 1;
                break;
            case '&laquo; Previous':
                page = pagination.current_page - 1;
                break;
            default:
                page = parseInt(label);
                break;
        }
        getItems(page);
    };
    

    return (
        <>
            {notification && <div>{notification}</div>}
            <div>
                <button
                    onClick={onMultipleDelete}
                    disabled={selectedItems.length === 0}
                    style={{ opacity: selectedItems.length === 0 ? 0.5 : 1 }}
                >
                    Delete Selected
                </button>
            </div>
            <div>
                <a href="/Admin/EditItem">Add Item</a>
            </div>
            <h2>Item List:</h2>
            <table>
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Item Name</th>
                        <th>Images</th>
                        <th>Price</th>
                        <th>Categories</th>
                        <th>Item Clicks</th>
                        <th>Item Link Clicks</th>
                        <th>Edit</th>
                        <th>Delete</th>
                        <th>Multiple Deletion</th>
                    </tr>
                </thead>
                <tbody>
                    {items.length > 0 ? (
                        items.map((item, index) => (
                            <tr key={item.id}>
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
                                <td>{item.item_price}</td>
                                <td>
                                    <ul>
                                        {item.categories
                                            .filter(
                                                (category) => category.id !== 1
                                            )
                                            .map((category, catIndex) => (
                                                <li key={catIndex}>
                                                    {category.category_name}
                                                </li>
                                            ))}
                                    </ul>
                                </td>
                                <td>{item.item_click}</td>
                                <td>{item.item_link_click}</td>
                                <td>
                                    <Link
                                        to="#"
                                        onClick={() => handleEditClick(item)}
                                    >
                                        Edit
                                    </Link>
                                </td>
                                <td>
                                    <button onClick={(e) => onDelete(item)}>
                                        Delete
                                    </button>
                                </td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.includes(
                                            item.id
                                        )}
                                        onChange={() =>
                                            toggleItemSelection(item.id)
                                        }
                                    />
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
                {pagination.links && (
                    <ul className="pagination">
                        {pagination.links.map((link, index) => (
                            <li
                                key={index}
                                className={`page-item ${
                                    link.active ? 'active' : ''
                                }`}
                            >
                                <button
                                    className="page-link"
                                    onClick={() => onPageChange(link.label)}
                                >
                                    {link.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

        </>
    );
}
