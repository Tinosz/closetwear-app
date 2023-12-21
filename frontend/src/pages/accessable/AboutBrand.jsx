import React from "react";
import banner1 from "../../assets/banner1.png";
import banner2 from "../../assets/banner2.png";
import poster1 from "../../assets/poster1.png";
import instagram from "../../assets/Instagram.jpg";
import whatsapp from "../../assets/Whatsapp.jpg";
import tokopedia from "../../assets/Tokped.jpg";
import shopee from "../../assets/Shopee.jpg";


import "../accessable/styles/AboutBrand.css";

export default function AboutBrand() {
    return (
        <div className="container">
            <div className="box1">
                <div className="text">
                    <img src={banner1} alt="" />
                </div> 
            </div>
            <div className="box2">
                <div className="text2">
                    <h1>TOP LOCAL BRAND</h1>
                    <h4>
                        Step into a realm of unparalleled style and comfort at
                        ClosetWear, your ultimate online destination for fashion
                        that resonates with simplicity and affordability.
                        Embrace the essence of cozy elegance as you explore our
                        curated collection, featuring everything from snug
                        sweaters to effortlessly chic ensembles. <br />
                        <br />
                    
                    </h4>
                </div>
                <div className="pic">
                    <img src={banner2} alt="" />
                </div>
            </div>
            <div className="box3">
                <div className="title-box3">
                    <h1>GOOD TESTIMONIES</h1>
                </div>
                <div className="pics">
                    <img src={poster1} alt="" />
                </div>
            </div>

            <div className="box4">
                <div className="box-center">
                    <div className="titlebox4">
                        <h2>CONTACT US</h2>
                    </div>
                    <div className="all-sosmed">
                        <a href="https://www.instagram.com/closetwear.id">
                            <img src={instagram} alt="" />
                        </a>
                        <a href="">
                            <img src={whatsapp} alt="" />
                        </a>
                        <a href="https://www.tokopedia.com/closetwear">
                            <img src={tokopedia} alt="" />
                        </a>
                        <a href="https://shopee.co.id/closetwear">
                            <img src={shopee} alt="" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
