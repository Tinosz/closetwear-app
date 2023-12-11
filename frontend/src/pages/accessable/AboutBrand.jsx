import React from "react"
import foto1 from "../../assets/foto1.jpg" 
import foto2 from "../../assets/foto2.jpg"
import foto3 from "../../assets/foto3.jpg"
import foto4 from "../../assets/bottom.jpg"
import foto5 from "../../assets/shirt.jpg"
import foto6 from "../../assets/tops.jpg"
import foto7 from "../../assets/react.svg"
import foto8 from "../../assets/shopee.webp"
import foto9 from "../../assets/tokped.png"
import foto10 from "../../assets/instagram.svg"

import "../accessable/styles/AboutBrand.css"

export default function AboutBrand(){
    return(
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
                <h1>PENJELASAN MENGENAI TOKO</h1>
                <h4>Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum molestiae, eveniet alias suscipit culpa sint officiis assumenda in eaque reiciendis perferendis pariatur animi, voluptatibus nobis minus ipsum expedita voluptas voluptate. Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati nemo fuga aperiam expedita, modi, dicta similique soluta labore eius voluptas perferendis ex nostrum iusto in iste itaque at quia non.</h4>
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
                    <a href=""> 
                        <img src={foto8} alt="" />
                    </a>
                </div>
                <div className="sosmed2">
                    <a href=""> 
                        <img  src={foto9} alt="" />
                    </a>
                </div>
                <div className="sosmed3">
                    <a href=""> 
                        <img src={foto10} alt="" />
                    </a>
                </div>
            </div>
            
            
        </div>

     </div>   
    )
};