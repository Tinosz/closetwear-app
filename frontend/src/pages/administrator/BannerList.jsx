import { useEffect, useState } from "react";
import axiosClient from "../../client/axios-client";
import { useStateContext } from "../../context/ContextProvider";
import { Link } from "react-router-dom";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableBanner from "../../components/form/SortableBanner";

export default function BannerList() {
    const { notification } = useStateContext();
    const [banners, setBanners] = useState([]);
    const [selectedBanners, setSelectedBanners] = useState([]);

    const getBanners = () => {
        axiosClient.get("banners").then((response) => {
            setBanners(response.data);
            console.log(response.data);
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

        axiosClient
            .delete("/banners/delete-multiple", {
                data: { bannerIds: selectedBanners },
            })
            .then(() => {
                getBanners();
                setSelectedBanners([]);
            });
    };

    function handleDragEnd(event) {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = banners.findIndex(
                (banner) => banner.id === active.id
            );
            const newIndex = banners.findIndex(
                (banner) => banner.id === over.id
            );

            const reorderedBanners = arrayMove(banners, oldIndex, newIndex);

            // Update the state with the new order
            setBanners(reorderedBanners);

            // Prepare the data to be sent to the server
            const updatedBannerOrders = reorderedBanners.map(
                (banner, index) => ({
                    id: banner.id,
                    banner_order: index + 1, // Assuming banner_order starts from 1
                })
            );

            console.log(updatedBannerOrders);

            const formData = new FormData();

            // Append each banner data
            updatedBannerOrders.forEach((banner) => {
                formData.append("id[]", banner.id);
                formData.append("banner_order[]", banner.banner_order);
            });

            console.log(formData);

            axiosClient
                .post("banners/update-order", formData)
                .then(() => {
                    console.log("Banner order updated successfully");
                })
                .catch((err) => {
                    console.error("Error updating banner order:", err);
                });
        }
    }

    return (
        <>
            {notification && <div>{notification}</div>}
            <Link to="/Admin/EditBanner">Add Banner</Link>
            <div>
                <button
                    onClick={onMultipleDelete}
                    disabled={selectedBanners.length === 0}
                    style={{ opacity: selectedBanners.length === 0 ? 0.5 : 1 }}
                >
                    Delete Selected
                </button>{" "}
                <DndContext
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <table>
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Banner Image</th>
                                <th>Banner Title</th>
                                <th>Banner Subtitle</th>
                                <th>Banner Description</th>
                                <th>Related Items</th>
                                <th>Related Categories</th>
                                <th>Edit</th>
                                <th>Delete</th>
                                <th>Select</th>
                            </tr>
                        </thead>
                        <tbody>
                            <SortableContext
                                items={banners.map((banner) => banner.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {banners.length > 0 ? (
                                    banners.map((banner, index) => (
                                        <SortableBanner
                                            key={banner.id}
                                            id={banner.id}
                                            index={index}
                                            banner={banner}
                                            onDelete={onDelete}
                                            toggleBannerSelection={
                                                toggleBannerSelection
                                            }
                                            selectedBanners={selectedBanners}
                                            handle
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7">
                                            No Banners currently present
                                        </td>
                                    </tr>
                                )}
                            </SortableContext>
                        </tbody>
                    </table>
                </DndContext>
            </div>
        </>
    );
}
