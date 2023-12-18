import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import axiosClient from '../client/axios-client';
import { Parallax, EffectFade, Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import './styles/BannerStyles.css';

const commonSwiperOptions = {
  slidesPerView: 1,
  spaceBetween: 30,
  speed: 600,
  parallax: true,
  effect: 'fade',
  loop: true,
  pagination: {
    clickable: true,
  },
  autoplay: {
    delay: 6000,
    disableOnInteraction: false,
  },
  modules: [Parallax, Autoplay, EffectFade, Pagination],
  className: 'mySwiper',
};

const BannerSection = ({ items }) => (
  <section className='banner-wrap'>
    <Swiper {...commonSwiperOptions}>
      {items.map((item) => (
        <SwiperSlide key={item.id}>
          {item.categories.length > 0 || item.items.length > 0 ? (
            <Link to={`/Catalog/Banner/${item.id}`} className="clickable-banner">
              <div>
                <img
                  className="parallax-bg banner-img desktop"
                  src={`${import.meta.env.VITE_API_BASE_URL}/storage/${item.banner_image}`}
                  alt={`Slide ${item.id}`}
                  data-swiper-parallax="-23%"
                />
                <div
                  className="parallax-bg banner-img bg-contain mobile"
                  style={{ backgroundImage: `url(${import.meta.env.VITE_API_BASE_URL}/storage/${item.banner_image})` }}
                  alt={`Slide ${item.id}`}
                  data-swiper-parallax="-23%"
                />
                {(item.banner_title || item.banner_subtitle || item.banner_description) && (
                  <div className='banner-text-wrap' data-swiper-parallax="-400">
                    {item.banner_title && (
                      <h1 className="banner-title" data-swiper-parallax="-300">
                        {item.banner_title}
                      </h1>
                    )}
                    {item.banner_subtitle && (
                      <h1 className="banner-subtitle" data-swiper-parallax="-200">
                        {item.banner_subtitle}
                      </h1>
                    )}
                    {item.banner_description && (
                      <h1 className="banner-desc" data-swiper-parallax="-100">
                        <p>{item.banner_description}</p>
                      </h1>
                    )}
                  </div>
                )}
              </div>
            </Link>
          ) : (
            <div>
              <img
                className="parallax-bg banner-img desktop"
                src={`${import.meta.env.VITE_API_BASE_URL}/storage/${item.banner_image}`}
                alt={`Slide ${item.id}`}
                data-swiper-parallax="-23%"
              />
              <div
                className="parallax-bg banner-img bg-contain mobile"
                style={{ backgroundImage: `url(${import.meta.env.VITE_API_BASE_URL}/storage/${item.banner_image})` }}
                alt={`Slide ${item.id}`}
                data-swiper-parallax="-23%"
              />
              <div className="container">
                {(item.banner_title || item.banner_subtitle || item.banner_description) && (
                  <div className='banner-text-wrap' data-swiper-parallax="-400">
                    {item.banner_title && (
                      <h1 className="banner-title" data-swiper-parallax="-300">
                        {item.banner_title}
                      </h1>
                    )}
                    {item.banner_subtitle && (
                      <h1 className="banner-subtitle" data-swiper-parallax="-200">
                        {item.banner_subtitle}
                      </h1>
                    )}
                    {item.banner_description && (
                      <h1 className="banner-desc" data-swiper-parallax="-100">
                        <p>{item.banner_description}</p>
                      </h1>
                    )}
                  </div>
                )}
              </div>
              
            </div>
          )}
        </SwiperSlide>
      ))}
    </Swiper>
  </section>
);

const App = () => {
  const [banners, setBanners] = useState([]);

  const getBanners = () => {
    axiosClient.get("banners").then((response) => {
      setBanners(response.data);
      console.log(response.data);
    });
  };

  useEffect(() => {
    getBanners();
  }, []);

  return (
    <>
      <BannerSection items={banners} />
    </>
  );
};

export default App;
