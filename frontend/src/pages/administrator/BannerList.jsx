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

import "./styles/BannerListStyles.css"

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

    const parallaxBg = document.querySelector('.parallax-bg');

    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        parallaxBg.style.transform = `translate3d(0, ${scrollPosition * 1}px, 0)`;
    });
    
    return (
        <>
        <div className="bl-wrap">
        <div className="parallax-bg"></div>
        <div className="bl-container">
            {notification && <div>{notification}</div>}
            <Link to="/Admin/EditBanner"><a>
            <button className="edit-banner-button">Add New Banner</button>
            </a></Link>
            <div>
                <button
                    onClick={onMultipleDelete}
                    className="action-button"
                    disabled={selectedBanners.length === 0}
                    style={{ opacity: selectedBanners.length === 0 ? 0.5 : 1 }}
                >
                    Delete Selected
                </button>{" "}
                <DndContext
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <div className="">
                    <table className="bl-form-container text-center" >
                        <thead>
                        <tr>
                                <th style={{ width: '3%' }}>No.</th>
                                <th style={{ width: '10%' }}>Banner Image</th>
                                <th style={{ width: '15%' }}>Banner Title</th>
                                <th style={{ width: '10%' }}>Banner Subtitle</th>
                                <th style={{ width: '20%' }}>Banner Description</th>
                                <th style={{ width: '10%' }}>Related Items</th>
                                <th style={{ width: '15%' }}>Related Categories</th>
                                <th style={{ width: '5%' }}>Edit</th>
                                <th style={{ width: '5%' }}>Delete</th>
                                <th style={{ width: '5%' }}>Select</th>
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
                    </div>
                </DndContext>
            </div>
        </div>
        </div>
        </>
    );
}
