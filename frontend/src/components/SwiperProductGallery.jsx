import { Swiper, SwiperSlide } from "swiper/react";

import "./styles/SwiperProductGalleryStyles.css";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Pagination, Navigation } from "swiper/modules";

export default function SwiperProductGallery({images}) {


    return (
        <div className="swiper-container">
            <Swiper modules={[Pagination]} className="mySwiper" pagination={true} style={{ "--swiper-pagination-color": "#D71313" }}>
                {images.map((imageUrl, index) => (
                    <SwiperSlide key={index} className="swiper-slide-item-image">
                        <img src={imageUrl} className="swiper-slide-image" alt={`Slide ${index + 1}`} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
