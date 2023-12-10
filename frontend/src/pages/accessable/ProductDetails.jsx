import React, { useState, useEffect, useRef } from "react";
import { ReactDOM } from "react";

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

// Import AOS library
import AOS from "aos";
import "aos/dist/aos.css";

import "./styles/ProductDetailsStyles.css";

import shopee from "../page-assets/shopee.png";
import whatsapp from "../page-assets/whatsapp.png";
import tokopedia from "../page-assets/tokopedia.png";

const ProductDetails = () => {
  const [images, setImages] = useState({
    img1: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    img2: "https://plus.unsplash.com/premium_photo-1664542157778-4dcccb04169e?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    img3: "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?q=80&w=2673&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    img4: "https://swiperjs.com/demos/images/nature-4.jpg",
    img5: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    img6: "https://plus.unsplash.com/premium_photo-1664542157778-4dcccb04169e?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    img7: "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?q=80&w=2673&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    img8: "https://swiperjs.com/demos/images/nature-4.jpg",
  });

  const [activeImg, setActiveImg] = useState(images.img1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [visibleRange, setVisibleRange] = useState([0, 3]);
  const [smallImgCount, setSmallImgCount] = useState(4);

  const handleSmallImageContainerScroll = (event) => {
    const container = event.target;
    const scrollLeft = container.scrollLeft;
    const currentIndex = Math.round(scrollLeft / container.offsetWidth);
    setActiveImg(Object.values(images)[currentIndex]);
  };

  const handlePrev = () => {
    const keys = Object.keys(images);
    const currentIndex = keys.findIndex((key) => images[key] === activeImg);
    const prevIndex = (currentIndex - 1 + keys.length) % keys.length;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveImg(images[keys[prevIndex]]);
      setIsTransitioning(false);
    }, 150);
  };

  const handleNext = () => {
    const keys = Object.keys(images);
    const currentIndex = keys.findIndex((key) => images[key] === activeImg);
    const nextIndex = (currentIndex + 1) % keys.length;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveImg(images[keys[nextIndex]]);
      setIsTransitioning(false);
    }, 150);
  };

  useEffect(() => {
    // Adjust visible range based on the active image index
    const keys = Object.keys(images);
    const currentIndex = keys.findIndex((key) => images[key] === activeImg);
    const end = Math.min(currentIndex + smallImgCount - 1, keys.length - 1);
    setVisibleRange([currentIndex, end]);
  }, [activeImg, images, smallImgCount]);

  const handleSmallImageClick = (img) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveImg(img);
      setIsTransitioning(false);
    }, 150);
  };

  const handleResize = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth < 1024 & screenWidth > 800) {
      setSmallImgCount(2);
    } else if (screenWidth < 1340 & screenWidth > 1024) {
      setSmallImgCount(3);
    } else {
      setSmallImgCount(4);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


  useEffect(() => {
    // Initialize AOS
    AOS.init();
  }, []);

  const ImageCard = ({ imageSrc, title, description, tags }) => (
    <div className="rounded overflow-hidden shadow-lg" data-aos="fade-up">
      <img className="w-full" src={imageSrc} alt={title} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{title}</div>
        <p className="text-gray-700 text-base">{description}</p>
      </div>
      <div className="px-6 pt-4 pb-2">
        {tags.map((tag, index) => (
          <span key={index} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
  
  const ImageGallery = () => (
    <div className="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5" >
      <ImageCard
        imageSrc="https://swiperjs.com/demos/images/nature-4.jpg"
        title="Mountain"
        description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, Nonea! Maiores et perferendis eaque, exercitationem praesentium nihil."
        tags={['#photography', '#travel', '#winter']}
      />
      <ImageCard
        imageSrc="https://swiperjs.com/demos/images/nature-4.jpg"
        title="River"
        description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, Nonea! Maiores et perferendis eaque, exercitationem praesentium nihil."
        tags={['#photography', '#travel', '#summer']}
      />
      <ImageCard
        imageSrc="https://swiperjs.com/demos/images/nature-4.jpg"
        title="Forest"
        description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, Nonea! Maiores et perferendis eaque, exercitationem praesentium nihil."
        tags={['#photography', '#travel', '#fall']}
      />
      <ImageCard
        imageSrc="https://swiperjs.com/demos/images/nature-4.jpg"
        title="Forest"
        description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, Nonea! Maiores et perferendis eaque, exercitationem praesentium nihil."
        tags={['#photography', '#travel', '#fall']}
      />
      <ImageCard
        imageSrc="https://swiperjs.com/demos/images/nature-4.jpg"
        title="Forest"
        description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, Nonea! Maiores et perferendis eaque, exercitationem praesentium nihil."
        tags={['#photography', '#travel', '#fall']}
      />
      <ImageCard
        imageSrc="https://swiperjs.com/demos/images/nature-4.jpg"
        title="Forest"
        description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, Nonea! Maiores et perferendis eaque, exercitationem praesentium nihil."
        tags={['#photography', '#travel', '#fall']}
      />
    </div>
  );

///// RETURN 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <>
      <div className="pd-wrap">
        <div className="product-wrap gap-12">
          
          <div className="cover-wrap">
            <div className="cover-wrap2 gap-2">
              <button className="np-button prev" onClick={handlePrev}>
                &lt;
              </button>
              <button className="np-button next" onClick={handleNext}>
                &gt;
              </button>

              <img
                src={activeImg}
                alt=""
                className={`img-cover ${isTransitioning ? 'fade-out' : 'fade-in'}`}
              />
              <div className="small-img-wrap flex space-x-2">
                {Object.values(images)
                  .slice(visibleRange[0], visibleRange[1] + 1)
                  .map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt=""
                      className={`small-img ${activeImg === img ? 'active-small-img' : ''}`}
                      onClick={() => handleSmallImageClick(img)}
                    />
                  ))}
              </div>
            </div>
          </div>

          <div className="product-desc-wrap">
            <div className="product-title">Product Name</div>
            <div className="price-size">
              <div className="product-price">
                  <div className="price-cur">Rp</div>
                  <div className="price-qty">200000</div>
              </div>
            </div>
            <hr /><br />
            <div className="product-desc">Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero dignissimos repellat dicta itaque similique at eligendi delectus, repudiandae nemo nesciunt doloremque asperiores molestias possimus maxime illum placeat atque totam voluptate. Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident magni ea totam explicabo libero fuga fugiat quidem rem magnam, deleniti suscipit nemo est consequatur recusandae et! Eaque asperiores vitae facere. Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem, explicabo soluta quasi veniam eius porro ut temporibus? Dicta incidunt, veniam ut impedit ipsam enim, ab nulla hic eligendi rerum natus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iste odio tempore voluptatum dolor facere quae exercitationem, possimus reprehenderit architecto enim numquam modi laborum esse repellendus ratione provident accusamus laudantium ipsam? Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero dignissimos repellat dicta itaque similique at eligendi delectus, repudiandae nemo nesciunt doloremque asperiores molestias possimus maxime illum placeat atque totam voluptate. Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident magni ea totam explicabo libero fuga fugiat quidem rem magnam, deleniti suscipit nemo est consequatur recusandae et! Eaque asperiores vitae facere. Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem, explicabo soluta quasi veniam eius porro ut temporibus? Dicta incidunt, veniam ut impedit ipsam enim, ab nulla hic eligendi rerum natus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iste odio tempore voluptatum dolor facere quae exercitationem, possimus reprehenderit architecto enim numquam modi laborum esse repellendus ratione provident accusamus laudantium ipsam?</div>

            <ul className="product-link">
            <li>
              <a href="https://tokopedia.link/LPLsy8xrpFb" className="product-tooltip" target="_blank" rel="noopener noreferrer">
                <img src={tokopedia} alt="" className="tokopedia" />
                <span className="tooltip-text">Tokopedia</span>
              </a>
            </li>
            <li>
              <a href="https://shopee.co.id/closetwear" className="product-tooltip" target="_blank" rel="noopener noreferrer">
                <img src={shopee} alt="" className="shopee" />
                <span className="tooltip-text">Shopee</span>
              </a>
            </li>
            <li>
              <a href="https://wa.me/yourphonenumber" className="product-tooltip" target="_blank" rel="noopener noreferrer">
                <img src={whatsapp} alt="" className="whatsapp" />
                <span className="tooltip-text">WhatsApp</span>
              </a>
            </li>
          </ul>

            

          </div>
      </div>

      <div className="recommended-wrap">
        <h1 className="rec-title">Recommendation for You</h1>
        <ImageGallery />
      </div>
    </div>
    </>
  )
}

export default ProductDetails;