import React from "react";
import foto1 from "../../assets/foto1.jpg";
import foto2 from "../../assets/foto2.jpg";
import foto3 from "../../assets/foto3.jpg";
import foto4 from "../../assets/bottom.jpg";
import foto5 from "../../assets/shirt.jpg";
import foto6 from "../../assets/tops.jpg";
import foto7 from "../../assets/react.svg";
import foto8 from "../../assets/shopee.webp";
import foto9 from "../../assets/tokped.png";
import foto10 from "../../assets/instagram.svg";

import "../accessable/styles/AboutBrand.css";

export default function AboutBrand() {
    return (
        <div className="container">
            <div className="box1">
                <div className="text">
                    <h1>CLOSETWEAR</h1>
                    <h4>ABOUT BRAND</h4>
                </div>
                {/* <div className="pic">
                <img src={foto3} alt="" />
            </div> */}
            </div>
            <div className="box2">
                <div className="text2">
                    <h1>Welcome to ClosetWear!</h1>
                    <h4>
                        Step into a realm of unparalleled style and comfort at
                        ClosetWear, your ultimate online destination for fashion
                        that resonates with simplicity and affordability.
                        Embrace the essence of cozy elegance as you explore our
                        curated collection, featuring everything from snug
                        sweaters to effortlessly chic ensembles. <br />
                        <br />
                        Proudly crafted in Indonesia, each garment tells a
                        unique story of comfort and craftsmanship. Our
                        commitment to simplicity and affordability sets us
                        apart, making ClosetWear more than just a fashion
                        destination—it's a celebration of style, culture, and
                        the art of feeling good in what you wear. Your style
                        journey begins with us. Experience the intersection of
                        comfort, simplicity, and affordability at ClosetWear,
                        where every piece is a statement and every outfit is an
                        expression of your unique personality. Welcome to a
                        world where fashion feels like home.
                    </h4>
                </div>
                <div className="pic">
                    <img src={foto3} alt="" />
                </div>
            </div>
            <div className="box3">
                <img src={foto4} alt="" />
                <img src={foto5} alt="" />
                <img src={foto6} alt="" />
                <img src={foto6} alt="" />
            </div>

            <div className="box4">
                <div className="titlebox4">
                    <h2>REACH US OUT!</h2>
                </div>
                <div className="allSosmed">
                    <div className="sosmed1">
                        <a href="https://shopee.co.id/closetwear" target="_blank">
                            <img src={foto8} alt="" />
                        </a>
                    </div>
                    <div className="sosmed2">
                        <a
                            href="
                        https://www.tokopedia.com/closetwear"
                         target="_blank">
                            <img src={foto9} alt="" />
                        </a>
                    </div>
                    <div className="sosmed3">
                        <a href="https://www.instagram.com/closetwear.id/" target="_blank">
                            <img src={foto10} alt="" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
