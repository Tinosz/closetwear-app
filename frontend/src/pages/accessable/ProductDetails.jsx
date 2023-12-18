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
import { useParams } from "react-router-dom";
import axiosClient from "../../client/axios-client";
import ProductDetailGallery from "../../components/ProductDetailGallery";

const ProductDetails = () => {
  const [images, setImages] = useState({});

  const [item, setItem] = useState([]);
  const { id } = useParams({});

  const getItem = () => {
    axiosClient
      .get(`items/${id}`)
      .then((response) => {
        console.log(response.data);
        setItem(response.data);
  
        // Sort the images based on item_image_order
        const sortedImages = response.data.images.sort((a, b) => a.item_image_order - b.item_image_order);
  
        // Dynamically set the images state
        const imagesObject = {};
        sortedImages.forEach((image, index) => {
          imagesObject[`img${index + 1}`] = `${import.meta.env.VITE_API_BASE_URL}/storage/${image.item_image}`;
        });
        setImages(imagesObject);
      })
      .catch(() => {})
      .finally(() => {    console.log(item.images);
});
  };

  const fetchItemsByCategory = async (categoryId = 1) => {
    try {
      const response = await axiosClient.get(`/api/items/by-category/${categoryId}`);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };
  

  useEffect(()=> {
    getItem();
    fetchItemsByCategory();
  }, [])

  const handleLinkClick = async (link) => {
    try {
      await axiosClient.post(`/items/${id}/increment-link-click`);

      window.open(link, '_blank');
    } catch (error) {
      console.error("Error incrementing click count:", error);
    }
  };

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
    // Set default image index to 1 after fetching the item data
    setActiveImg(images.img1);
  }, [images]);
  
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
        <div className=" text-xl mb-2">{title}</div>
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
          {/* <ProductDetailGallery images={item.images} /> */}

          <div className="product-desc-wrap">
            <div className="product-title">{item.item_name}</div>
            <div className="price-size">
              <div className="product-price">
                  <div className="price-cur">Rp</div>
                  <div className="price-qty">{item.item_price}</div>
              </div>
            </div>
            <hr /><br />
            <div className="product-desc">{item.item_description}</div>

            <ul className="product-link">
            <li>
              <a onClick={() => handleLinkClick(item.tokopedia_link)} className="product-tooltip cursor-pointer" target="_blank" rel="noopener noreferrer">
                <img src={tokopedia} alt="" className="tokopedia" />
                <span className="tooltip-text">Tokopedia</span>
              </a>
            </li>
            <li>
              <a onClick={() => handleLinkClick(item.shoppee_link)} className="product-tooltip cursor-pointer" target="_blank" rel="noopener noreferrer">
                <img src={shopee} alt="" className="shopee" />
                <span className="tooltip-text">Shopee</span>
              </a>
            </li>
            <li>
              <a onClick={() => handleLinkClick(item.whatsapp_link)} className="product-tooltip cursor-pointer" target="_blank" rel="noopener noreferrer">
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