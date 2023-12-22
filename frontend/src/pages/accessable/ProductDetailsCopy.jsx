import React, { useState, useEffect, useRef } from "react";
import { ReactDOM } from "react";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

// Import AOS library
import AOS from "aos";
import "aos/dist/aos.css";

import "./styles/ProductDetailStyleCopy.css";

import shopee from "../page-assets/shopee.png";
import whatsapp from "../page-assets/whatsapp.png";
import tokopedia from "../page-assets/tokopedia.png";
import { Link, useParams } from "react-router-dom";
import axiosClient from "../../client/axios-client";
import ScrollProductGallery from "../../components/ScrollProductGallery";
import SwiperProductGallery from "../../components/SwiperProductGallery";

const ProductDetailsCopy = () => {
    const { id } = useParams();
    const [images, setImages] = useState([]);
    const [item, setItem] = useState([]);
    const [recommendedItem, setRecommendedItem] = useState([]);

    useEffect(() => {
        const getItem = async () => {
            try {
                const response = await axiosClient.get(`items/details/${id}`);
                console.log(response.data);
                console.log(response.data.images);

                setItem(response.data);
                setRecommendedItem(response.data.RecommendedItems);

                // Sort the images based on item_image_order
                const sortedImages = response.data.images.sort(
                    (a, b) => a.item_image_order - b.item_image_order
                );

                // Dynamically set the images state
                const imagesArray = sortedImages.map((image) => {
                    return `${import.meta.env.VITE_API_BASE_URL}/storage/${
                        image.item_image
                    }`;
                });
                setImages(imagesArray);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        getItem();
    }, [id]);

    useEffect(() => {
        // Initialize AOS
        AOS.init();
    }, []);

    const handleLinkClick = async (link) => {
        try {
            await axiosClient.post(`/items/${id}/increment-link-click`);

            window.open(link, "_blank");
        } catch (error) {
            console.error("Error incrementing click count:", error);
        }
    };

    const ImageCard = ({ images, title, price, tags }) => {
        // Find the image with the lowest item_image_order
        const firstImage = images.reduce(
            (minImage, currentImage) =>
                minImage.item_image_order < currentImage.item_image_order
                    ? minImage
                    : currentImage,
            images[0]
        );

        return (
            <div className="overflow-hidden shadow-lg" data-aos="fade-up">
                <img
                    className="image-card-item-image"
                    src={`${import.meta.env.VITE_API_BASE_URL}/storage/${
                        firstImage.item_image
                    }`}
                    alt={title}
                />
                <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">{title}</div>
                    <p className="text-gray-700 text-base">Rp.{price}</p>
                </div>
                <div className="px-6 pt-4 pb-2">
                    {tags.map((tag, index) => (
                        <span
                            key={index}
                            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        );
    };

    const ImageGallery = ({ recommendedItem }) => (
        <div className="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {recommendedItem
                .filter((item) => item.available_stock === "1")
                .map((item) => (
                    <Link
                        key={item.id}
                        to={`/product/${item.id}`}
                        onClick={() => handleClick(item)}
                    >
                        <ImageCard
                            key={item.id}
                            title={item.item_name}
                            images={item.images}
                            tags={item.categories
                                .filter((category) => category.id !== 1)
                                .slice(0, 3)
                                .map((category) => category.category_name)}
                            price={item.item_price}
                        />
                    </Link>
                ))}
        </div>
    );
    
    const handleClick = async (item) => {
        try {
            await axiosClient.post(`/items/${item.id}/increment-click`);
            // Use the navigation method you prefer, e.g., react-router navigation
            // For simplicity, this example uses window.location.href
            window.location.href = `/product/${item.id}`;
        } catch (error) {
            console.error("Error incrementing item click count:", error);
        }
    };

    return (
        <div>
            <div className="product-detail-wrapper">
                <div className="scroll-product-gallery">
                    <ScrollProductGallery images={images} />
                </div>
                <div className="swiper-product-gallery">
                    <SwiperProductGallery images={images} />
                </div>
                <div>
                    <div className="product-detail-details">
                        <div className="product-detail-information">
                            <h4 className="product-detail-header">
                                {item.item_name}
                            </h4>
                            <p className="product-detail-item-price">
                                Rp. {item.item_price}
                            </p>
                            <p className="product-detail-item-description">
                                {item.item_description}
                            </p>
                        </div>
                        <div className="product-detail-shop-images flex">
                            <a
                                onClick={() => handleLinkClick(item.tokopedia_link)}
                                href={item.tokopedia_link}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img src={tokopedia} alt="Tokopedia" />
                            </a>
                            <a
                                onClick={() => handleLinkClick(item.shoppee_link)}
                                href={item.shoppee_link}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img src={shopee} alt="Shopee" />
                            </a>
                            <a
                                onClick={() => handleLinkClick(item.whatsapp_link)}
                                href={item.whatsapp_link}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img src={whatsapp} alt="WhatsApp" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            {recommendedItem.length > 0 && (
                <div className="recommended-wrap">
                    <h1 className="rec-title">Recommendation for You</h1>
                    <ImageGallery recommendedItem={recommendedItem} />
                </div>
            )}
        </div>
    );
};

export default ProductDetailsCopy;
