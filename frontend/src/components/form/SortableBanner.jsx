import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Link } from "react-router-dom";

function SortableBanner({
    id,
    index,
    banner,
    onDelete,
    toggleBannerSelection,
    selectedBanners,
}) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({
            id: id,
        });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const imageUrl =
        typeof banner.banner_image === "object"
            ? URL.createObjectURL(banner.banner_image)
            : `${import.meta.env.VITE_API_BASE_URL}/storage/${
                  banner.banner_image
              }`;

    const itemName =
        typeof banner.banner_image === "object"
            ? banner.banner_image.name
            : banner.items.length > 0
            ? banner.items[0].item_name
            : "No Items Related";

    return (
        <tr ref={setNodeRef} style={style}>
            <td
                {...attributes}
                {...listeners}
                className="cursor-move text-center"
            >
                {" "}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    data-name="Layer 1"
                    viewBox="0 0 24 24"
                    id="draggabledots"
                >
                    <path
                        fill="#D71313"
                        d="M8.5,10a2,2,0,1,0,2,2A2,2,0,0,0,8.5,10Zm0,7a2,2,0,1,0,2,2A2,2,0,0,0,8.5,17Zm7-10a2,2,0,1,0-2-2A2,2,0,0,0,15.5,7Zm-7-4a2,2,0,1,0,2,2A2,2,0,0,0,8.5,3Zm7,14a2,2,0,1,0,2,2A2,2,0,0,0,15.5,17Zm0-7a2,2,0,1,0,2,2A2,2,0,0,0,15.5,10Z"
                    ></path>
                </svg>
                {index + 1}
            </td>
            <td>
                <img
                    className="w-40"
                    src={imageUrl}
                    alt={`Banner Image ${index + 1}`}
                />
            </td>
            <td>{banner.banner_title}</td>
            <td>{banner.banner_subtitle}</td>
            <td>{banner.banner_description}</td>
            <td>
                {banner.items.length > 0 ? (
                    banner.items.map((item) => (
                        <li
                            key={item.id}
                            className="flex items-center space-x-2"
                        >
                            <span className="mr-2">{item.item_name}</span>
                            {item.images.length > 0 && (
                                <img
                                    className="w-10"
                                    src={`${
                                        import.meta.env.VITE_API_BASE_URL
                                    }/storage/${item.images[0].item_image}`}
                                    alt="Image"
                                />
                            )}
                        </li>
                    ))
                ) : (
                    <li>No Items Related</li>
                )}
            </td>

            <td>
                <ul>
                    {banner.categories.length > 0 ? (
                        banner.categories
                            .filter((category) => category.id !== 1)
                            .map((category, catIndex) => (
                                <li key={catIndex}>{category.category_name}</li>
                            ))
                    ) : (
                        <li>No Categories Related</li>
                    )}
                </ul>
            </td>
            <td>
                <Link to={`/Admin/EditBanner/${banner.id}`}>Edit</Link>
            </td>
            <td>
                <button onClick={() => onDelete(banner)}>Delete</button>
            </td>
            <td>
                <input
                    type="checkbox"
                    checked={selectedBanners.includes(banner.id)}
                    onChange={() => toggleBannerSelection(banner.id)}
                />
            </td>
        </tr>
    );
}

export default SortableBanner;
