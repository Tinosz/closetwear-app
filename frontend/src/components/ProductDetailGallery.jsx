import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";

import './styles/ProductDetailGallery.css';

export default function ProductDetailGallery({ images }) {
    const [ThumbsSwiper, setThumbsSwiper] = useState(null);

    return (
        <>
            <Swiper
                spaceBetween={10}
                navigation={true}
                thumbs={{ swiper: ThumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs]}
            >
                {images.map((image, index) => (
                    <SwiperSlide key={index}>
                        <img
                            src={`${
                                import.meta.env.VITE_API_BASE_URL
                            }/storage/${image.item_image}`}
                            alt={`Product Image ${index + 1}`}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
            <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
            >
                {images.map((image, index) => (
                    <SwiperSlide key={index}>
                        <img
                            src={`${
                                import.meta.env.VITE_API_BASE_URL
                            }/storage/${image.item_image}`}
                            alt={`Product Image ${index + 1}`}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    );
}
