import { useEffect, useState } from "react";
import axiosClient from "../../client/axios-client";
import { useStateContext } from "../../context/ContextProvider";
import { Link } from "react-router-dom";

export default function BannerList() {
    const { notification } = useStateContext();
    const [banners, setBanners] = useState([]);
    const [selectedBanners, setSelectedBanners] = useState([]);

    const getBanners = () => {
        axiosClient.get("banners").then((response) => {
            console.log(response.data);
            setBanners(response.data);
        });
    };

    useEffect(() => {
        getBanners();
    }, []);

    const onDelete = (banner) => {
        if (!window.confirm("Are you sure you want to delete this banner?")) {
            return;
        }

        axiosClient.delete(`/banners/${banner.id}`).then(() => {
            getBanners();
        });
    };

    const toggleBannerSelection = (bannerId) => {
        setSelectedBanners((prevSelected) =>
            prevSelected.includes(bannerId)
                ? prevSelected.filter((id) => id !== bannerId)
                : [...prevSelected, bannerId]
        );
    };

    const onMultipleDelete = () => {
        if (
            !window.confirm(
                "Are you sure you want to delete the selected banners?"
            )
        ) {
            return;
        }

        console.log("Selected Banners:", selectedBanners);

        axiosClient
            .delete("/banners/delete-multiple", {
                data: { bannerIds: selectedBanners },
            })
            .then(() => {
                getBanners();
                setSelectedBanners([]);
            });
    };

    return (
        <>
        <Link to="/Admin/EditBanner">Add Banner</Link>
            <div>
                <button onClick={onMultipleDelete}>Delete Selected</button>
                <table>
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Banner Image</th>
                            <th>Related Items</th>
                            <th>Related Categories</th>
                            <th>Edit</th>
                            <th>Delete</th>
                            <th>Select</th>
                        </tr>
                    </thead>
                    <tbody>
                        {banners.length > 0 ? (
                            banners.map((banner, index) => (
                                <tr key={banner.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <img
                                            className="w-40"
                                            src={`${
                                                import.meta.env
                                                    .VITE_API_BASE_URL
                                            }/storage/${banner.banner_image}`}
                                            alt={`Banner Image` + index + 1}
                                        />
                                    </td>
                                    <td>
                                        {banner.items.length > 0 ? (
                                            banner.items.map((item) => {
                                                // Find the image with the lowest item_image_order
                                                const lowestOrderImage =
                                                    item.images.reduce(
                                                        (lowest, current) => {
                                                            return current.item_image_order <
                                                                lowest.item_image_order
                                                                ? current
                                                                : lowest;
                                                        },
                                                        item.images[0]
                                                    );

                                                return (
                                                    <li key={item.id}>
                                                        {item.item_name}
                                                        {lowestOrderImage && (
                                                            <img
                                                                className="w-20"
                                                                src={`${
                                                                    import.meta
                                                                        .env
                                                                        .VITE_API_BASE_URL
                                                                }/storage/${
                                                                    lowestOrderImage.item_image
                                                                }`}
                                                                alt={`Image`}
                                                            />
                                                        )}
                                                    </li>
                                                );
                                            })
                                        ) : (
                                            <li>No Items Related</li>
                                        )}
                                    </td>
                                    <td>
                                        <ul>
                                            {banner.categories.length > 0 ? (
                                                banner.categories
                                                    .filter(
                                                        (category) =>
                                                            category.id !== 1
                                                    )
                                                    .map(
                                                        (
                                                            category,
                                                            catIndex
                                                        ) => (
                                                            <li key={catIndex}>
                                                                {
                                                                    category.category_name
                                                                }
                                                            </li>
                                                        )
                                                    )
                                            ) : (
                                                <li>No Categories Related</li>
                                            )}
                                        </ul>
                                    </td>
                                    <td>
                                        <Link
                                            to={
                                                `/Admin/EditBanner/` + banner.id
                                            }
                                        >
                                            Edit
                                        </Link>
                                    </td>
                                    <td>
                                        <button
                                            onClick={(e) => onDelete(banner)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedBanners.includes(
                                                banner.id
                                            )}
                                            onChange={() =>
                                                toggleBannerSelection(banner.id)
                                            }
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">
                                    No Banners currently present
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}
