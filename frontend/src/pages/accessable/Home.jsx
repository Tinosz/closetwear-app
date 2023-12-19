import Footer from "../../components/Footer";
import react, { useEffect, useState } from "react";
import "./styles/HomeStyles.css";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Banner from "../../components/Banner";
import axiosClient from "../../client/axios-client";

export default function Home() {
    const [items, setItems] = useState([]);

    const getNewlyReleased = () => {
        axiosClient
            .get("itemsGetNewlyRelease")
            .then((response) => {
                console.log(response.data);
                setItems(response.data);
            })
            .catch(() => {})
            .finally(() => {});
    };

    useEffect(() => {
        getNewlyReleased();
    }, []);

    const getItems = () => {};

    const responsive = {
        largeDesktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 5,
            slidesToSlide: 2, // optional, default to 1.
        },
        desktop: {
            breakpoint: { max: 1024, min: 800 },
            items: 3,
            slidesToSlide: 3, // optional, default to 1.
        },
        tablet: {
            breakpoint: { max: 800, min: 624 },
            items: 2,
            slidesToSlide: 2, // optional, default to 1.
        },
        mobile: {
            breakpoint: { max: 624, min: 0 },
            items: 1,
            slidesToSlide: 1, // optional, default to 1.
        },
    };

    const handleClick = async (props) => {
        try {
            await axiosClient.post(`/items/${props.id}/increment-click`);
            window.location.href = `/product/${props.id}`;
        } catch (error) {
            console.error("Error incrementing props click count:", error);
        }
    };

    function NewReleased(props) {
        const handleSeeProductClick = () => {
            handleClick(props);
        };

        return (
            <div className="new-release-card">
                <div className="new-release-img" alt="aa">
                    <img src={props.url} />
                </div>
                <div className="new-release-bottom-box">
                    <h2 className="new-release-product">{props.name}</h2>
                    <p className="new-release-price text-black">
                        Rp. {props.price}
                    </p>
                    <button
                        onClick={handleSeeProductClick}
                        className="new-release-btn"
                    >
                        See Product
                    </button>
                </div>
            </div>
        );
    }

    const newlyReleased = items
        .filter((item) => item.available_stock === "1")
        .map((item) => (
            <NewReleased
                key={item.id}
                id={item.id}
                name={item.item_name}
                url={`${import.meta.env.VITE_API_BASE_URL}/storage/${
                    item.images[0].item_image
                }`}
                price={item.item_price}
                desc={item.item_description}
            />
        ));

    function NewReleases() {
        return (
            <>
                <div className="wrap-home">
                    <section id="new-release">
                        <small className="new-release-title">
                            New Release!
                        </small>

                        <Carousel
                            className="new-release-wrap"
                            arrows={true}
                            showDots={true}
                            swipeable={true}
                            draggable={true}
                            responsive={responsive}
                        >
                            {newlyReleased}
                        </Carousel>
                    </section>
                </div>
            </>
        );
    }

    function SectionContent() {
        return (
            <section className="home-latest">
                <div className="grid-container">
                    <div className="category-wrap desktop">
                        <h2 className="category-text">Your Go-to Wear</h2>
                        <p className="category-text-description">
                            Discover a world where style meets ease at
                            ClosetWear, your go-to online destination for
                            fashion that's as comfortable as it is chic. Our
                            curated collection of clothing, including cozy
                            sweaters and trendy ensembles, embodies the essence
                            of simplicity and affordability.
                        </p>
                        <a className="category-link" href="/Catalog">
                            View
                        </a>
                    </div>
                    <div className="category-img-wrap">
                        <div className="relative">
                            <a className="category-img" href="">
                                <div
                                    className="img-wrap"
                                    style={{
                                        backgroundImage: `url(https://www.ledr.com/colours/white.jpg)`,
                                    }}
                                >
                                    <img
                                        src="https://plus.unsplash.com/premium_photo-1664542157778-4dcccb04169e?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                        alt=""
                                    />
                                </div>
                            </a>
                            <span
                                className="category-layer"
                                style={{
                                    backgroundImage: `url(//hatshop.com/cdn/shop/files/texture_indigo-worth-and-worth.jpg?v=1614347676)`,
                                }}
                            ></span>
                        </div>
                    </div>
                    <div className="category-wrap-mobile">
                        <h2 className="category-text">Your Go-to Wear</h2>
                        <p className="category-text-description">
                            Discover a world where style meets ease at
                            ClosetWear, your go-to online destination for
                            fashion that's as comfortable as it is chic. Our
                            curated collection of clothing, including cozy
                            sweaters and trendy ensembles, embodies the essence
                            of simplicity and affordability.
                        </p>
                        <a className="category-link" href="/Catalog">
                            View
                        </a>
                    </div>
                </div>

                <div className="grid-container2">
                    <div className="category-img-wrap">
                        <div className="relative">
                            <a className="category-img" href="">
                                <div
                                    className="img-wrap"
                                    style={{
                                        backgroundImage: `url(https://www.ledr.com/colours/white.jpg)`,
                                    }}
                                >
                                    <img
                                        src="https://images.unsplash.com/photo-1506152983158-b4a74a01c721?q=80&w=2673&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                        alt=""
                                    />
                                </div>
                                <span
                                    className="category-layer2"
                                    style={{
                                        backgroundImage: `url(//hatshop.com/cdn/shop/files/texture_indigo-worth-and-worth.jpg?v=1614347676)`,
                                    }}
                                ></span>
                            </a>
                        </div>
                    </div>
                    <div className="category-wrap">
                        <h2 className="category-text">Learn More About Us!</h2>
                        <a className="category-link" href="/AboutBrand">
                            About us
                        </a>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <>
            <div className="home-wrap">
                <Banner />
                <SectionContent />
                <NewReleases />
            </div>
        </>
    );
}
