import React, { useRef, useState } from 'react';
import "./styles/BannerStyles.css";

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// import './styles.css';

// import required modules
import { Parallax, EffectFade, Autoplay, Pagination } from 'swiper/modules';
import NavigationBar from './NavigationBar';

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
  
  const bannerSlide = [
    {
      id: 1,
      title: 'Title 1',
      subtitle: 'Subtitle 1',
      description: 'Description 1',
      imageUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: 2,
      title: 'Title 2',
      subtitle: 'Subtitle 2',
      description: 'Description 2',
      imageUrl: 'https://plus.unsplash.com/premium_photo-1664542157778-4dcccb04169e?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: 3,
      title: 'Title 3',
      subtitle: 'Subtitle 3',
      description: 'Description 3',
      imageUrl: 'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?q=80&w=2673&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: 4,
      title: 'Title 4',
      subtitle: 'Subtitle 4',
      description: 'Description 4',
      imageUrl: 'https://swiperjs.com/demos/images/nature-4.jpg',
    },
  ];
  
  const BannerSection = ({ items }) => (
    <section className='banner-wrap'>
    {/* <NavigationBar /> */}
      <Swiper {...commonSwiperOptions}>
        {items.map((item) => (
          <SwiperSlide key={item.id}>
            <img
              className="parallax-bg banner-img desktop"
              src={item.imageUrl}
              alt={`Slide ${item.id}`}
              data-swiper-parallax="-23%"
            />
            <div
              className="parallax-bg banner-img bg-contain mobile"
              style={{ backgroundImage: `url(${item.imageUrl})` }}
              alt={`Slide ${item.id}`}
              data-swiper-parallax="-23%"
            />

            <div className='banner-text-wrap' data-swiper-parallax="-400">
                <h1 className="banner-title" data-swiper-parallax="-300">
                    {item.title}
                </h1>
                <h1 className="banner-subtitle" data-swiper-parallax="-200">
                    {item.subtitle}
                </h1>
                <h1 className="banner-desc" data-swiper-parallax="-100">
                    <p>{item.description}</p>
                </h1>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
  
  const App = () => (
    <>
      
      <BannerSection items={bannerSlide} />
      {/* Add more sections with different sets of items if needed */}
    </>
  );
  
  export default App;