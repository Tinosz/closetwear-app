import './styles/ItemListStyles.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
export default function ItemListRow({ item, index, onDelete,handleEditClick, toggleItemSelection, selectedItems   }){
        const featuredCategories = [];
        const nonFeaturedCategories = [];

        item.categories.forEach((category) => {
            if (category.featured === 1) {
                featuredCategories.push(
                    category
                );
            } else {
                nonFeaturedCategories.push(
                    category
                );
            }
        });

        return (
            <tr
                className="odd:bg-white odd:light:bg-black-900 even:bg-black-50 even:dark:bg-black-800 border-b dark:border-black-700"
                key={item.id}
            >
                <td className="px-6 py-4 border border-2 border-black">
                    {index + 1}
                </td>
                <td
                    scope="row"
                    className="px-6 py-4 border border-2 border-black font-medium text-black-900 dark:text-white w-28"
                    style={{
                        color: "black",
                        maxWidth: "200px",
                        wordWrap: "break-word",
                    }}
                >
                    {item.item_name}
                </td>
                <td className="px-6 py-4 border border-2 border-black">
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
                <td className="px-6 py-4 border border-2 border-black">
                    {item.item_price}
                </td>
                <td className="px-6 py-4 border border-2 border-black">
                    <ul>
                        {featuredCategories
                            .filter(
                                (category) =>
                                    category.id !==
                                    1
                            )
                            .map(
                                (
                                    category,
                                    catIndex
                                ) => (
                                    <li
                                        key={
                                            catIndex
                                        }
                                    >
                                        {
                                            category.category_name
                                        }
                                        {category.featured ===
                                            1 && (
                                            <FontAwesomeIcon
                                                icon={
                                                    faStar
                                                }
                                            />
                                        )}
                                    </li>
                                )
                            )}
                    </ul>
                    <ul>
                        {nonFeaturedCategories
                            .filter(
                                (category) =>
                                    category.id !==
                                    1
                            )
                            .map(
                                (
                                    category,
                                    catIndex
                                ) => (
                                    <li
                                        key={
                                            catIndex
                                        }
                                    >
                                        {
                                            category.category_name
                                        }
                                    </li>
                                )
                            )}
                    </ul>
                </td>
                <td className="px-6 py-4 border border-2 border-black">
                    {parseInt(
                        item.available_stock
                    ) === 1
                        ? "Yes"
                        : "No"}
                </td>
                <td className="px-6 py-4 border border-2 border-black">
                    {item.item_click}
                </td>
                <td className="px-6 py-4 border border-2 border-black">
                    {item.item_link_click}
                </td>
                <td className="px-6 py-4 border border-2 border-black">
                    <Link
                        to="#"
                        onClick={() =>
                            handleEditClick(
                                item
                            )
                        }
                    >
                        <button className="edit-banner-button">
                            Edit
                        </button>
                    </Link>
                </td>
                <td className="px-6 py-4 border border-2 border-black">
                    <button
                        className="action-button"
                        onClick={(e) =>
                            onDelete(item)
                        }
                    >
                        Delete
                    </button>
                </td>
                <td className="px-6 py-4 border border-2 border-black">
                <div className="checkbox-wrapper-24">
                    <input
                        type="checkbox"
                        id={`checkbox-${item.id}`} 
                        className="field__input"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleItemSelection(item.id)}
                    />
                    <label htmlFor={`checkbox-${item.id}`}><span></span></label> 
                </div>
            </td>
            </tr>
        );
}