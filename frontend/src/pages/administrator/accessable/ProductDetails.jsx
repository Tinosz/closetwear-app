import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { FreeMode, Navigation, Thumbs } from 'swiper/core';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

SwiperCore.use([FreeMode, Navigation, Thumbs]);

export default function ProductDetails() {
  const Products = () => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    return (
      <div className="page-wrap">
        <div className="product-wrap">
          <Swiper
            style={{
              '--swiper-navigation-color': '#f55',
              '--swiper-pagination-color': '#f55',
            }}
            spaceBetween={10}
            navigation={true}
            thumbs={{ swiper: thumbsSwiper }}
            modules={[FreeMode, Navigation, Thumbs]}
            className="mySwiper2"
          >
            <SwiperSlide>
              <img src="https://swiperjs.com/demos/images/nature-1.jpg" alt="Nature 1" />
            </SwiperSlide>
            <SwiperSlide>
              <img src="https://swiperjs.com/demos/images/nature-2.jpg" alt="Nature 2" />
            </SwiperSlide>
          </Swiper>
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={4}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="mySwiper"
          >
            <SwiperSlide>
              <img src="https://swiperjs.com/demos/images/nature-1.jpg" alt="Nature 1" />
            </SwiperSlide>
            <SwiperSlide>
              <img src="https://swiperjs.com/demos/images/nature-2.jpg" alt="Nature 2" />
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    );
  };

  return <Products />;
}
