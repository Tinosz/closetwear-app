import { useRef, useEffect, useState } from "react";
import "./styles/ScrollProductGallery.css";

export default function ScrollProductGallery({images}) {
    const scrollProductDisplayRef = useRef(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const handleImageClick = (index) => {
        const navbarHeight = 5 * 16;
        const imageElement = scrollProductDisplayRef.current.children[index];
        const topOffset = imageElement.offsetTop - navbarHeight;

        window.scrollTo({
            top: topOffset,
            behavior: "smooth",
        });

        setActiveImageIndex(index);
    };

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: "0px",
            threshold: 0.5, 
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const index = parseInt(entry.target.dataset.index, 10);
                    setActiveImageIndex(index);
                }
            });
        }, options);

        const images = Array.from(scrollProductDisplayRef.current.children);

        images.forEach((image, index) => {
            observer.observe(image);
            image.dataset.index = index; // Store the index as a data attribute
        });

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <div className="scroll-product-wrap">
            <div className="scroll-product-left-display md:max-lg:w-20 md:max-lg:h-80">
                {images.map((imageUrl, index) => (
                    <img
                        key={index}
                        src={imageUrl}
                        onClick={() => handleImageClick(index)}
                        className={index === activeImageIndex ? "active" : ""}
                    />
                ))}
            </div>
            <div
                className="scroll-product-display md:max-lg:w-72 md:max-xl:w-72"
                ref={scrollProductDisplayRef}
            >
                {images.map((imageUrl, index) => (
                    <img key={index} src={imageUrl} alt={`product-${index}`} />
                ))}
            </div>
        </div>
    );
}
