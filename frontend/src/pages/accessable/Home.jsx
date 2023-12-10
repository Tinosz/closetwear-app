import react from 'react';
import "./styles/HomeStyles.css"
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Banner from '../../components/Banner';

export default function Home() {
    const responsive = {
        largeDesktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 5,
          slidesToSlide: 2 // optional, default to 1.
        },
        desktop: {
          breakpoint: { max: 1024, min: 800 },
          items: 3,
          slidesToSlide: 3 // optional, default to 1.
        },
        tablet: {
          breakpoint: { max: 800, min: 624 },
          items: 2,
          slidesToSlide: 2 // optional, default to 1.
        },
        mobile: {
          breakpoint: { max: 624, min: 0 },
          items: 1,
          slidesToSlide: 1 // optional, default to 1.
        }
    };

    function NewReleased(props) {
    return(
        <div className='new-release-card'>
            <div className='new-release-img' style={{ backgroundImage: `url(${props.url})` }} alt="aa" />
            <div className='new-release-bottom-box'>
                <h2 className='new-release-product'>{props.name}</h2>
                <p className='new-release-price'>{props.price}</p>
                <p className='new-release-desc'>{props.desc}</p>
                <a href={`/products/${props.id}`} className='new-release-btn'>
                    See Product
                </a>


            </div>
        </div>
    )
    }

    const newReleasedData = [
    {
        id: 1,
        imageUrl: "https://plus.unsplash.com/premium_photo-1675186049409-f9f8f60ebb5e?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        name: "Sport Sweater",
        price: "$30",
        desc: "Some description"
    },
    {
        id: 2,
        imageUrl: "https://images.unsplash.com/photo-1701707244542-bc22a6e5a8eb?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        name: "Sport Shoes",
        price: "$30",
        desc: "Some description"
    },
    {
        id: 3,
        imageUrl: "https://images.unsplash.com/photo-1701707244542-bc22a6e5a8eb?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        name: "Sport Socks",
        price: "$30",
        desc: "Some description"
    },
    {
        id: 4,
        imageUrl: "https://images.unsplash.com/photo-1701707244542-bc22a6e5a8eb?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        name: "Sport Hats",
        price: "$30",
        desc: "Some description"
    },
    {
        id: 5,
        imageUrl: "https://images.unsplash.com/photo-1701707244542-bc22a6e5a8eb?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        name: "Sport Bags",
        price: "$30",
        desc: "Some description"
    },
    {
        id: 6,
        imageUrl: "https://images.unsplash.com/photo-1701707244542-bc22a6e5a8eb?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        name: "Sport Shirts",
        price: "$30",
        desc: "Some description"
    },
    {
        id: 7,
        imageUrl: "https://images.unsplash.com/photo-1701707244542-bc22a6e5a8eb?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        name: "Sport Trousers",
        price: "$30",
        desc: "Some description"
    },
    {
        id: 8,
        imageUrl: "https://images.unsplash.com/photo-1701707244542-bc22a6e5a8eb?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        name: "Sport Gloves",
        price: "$30",
        desc: "Some description"
    },
    ]

    const newlyReleased = newReleasedData.map(item => (
    <NewReleased 
        id={item.id}
        name={item.name} 
        url={item.imageUrl} 
        price={item.price} 
        desc={item.desc}
    />
    ))

    function NewReleases() {
        return(
            <>
                <div className='wrap-home'>
                    <section id='new-release'>
                        <small className='new-release-title'>New Release!</small>
    
                        <Carousel className='new-release-wrap' responsive={responsive}>
                            {newlyReleased}
                        </Carousel>
                        
                    </section>
    
                </div>
            </>
        );
    }

    function LatestRelease() {
        return(
            <section className='home-latest'>
                <div className='grid-container'>
                    
                    <div className='category-wrap'>
                            <h2>
                                <a className='category-text' href="">Woman's Sweater</a>
                            </h2>
                            <a className='category-link' href="">View</a>
                    </div>
                    <div className='category-img-wrap'>
                        <div className='relative'>
                            <a className="category-img" href=''>
                                <div className='img-wrap'
                                style={{backgroundImage: `url(https://www.ledr.com/colours/white.jpg)`}}>
                                    <img src="https://plus.unsplash.com/premium_photo-1664542157778-4dcccb04169e?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                                </div>
                            </a>
                            <span className='category-layer' style={{ backgroundImage: `url(//hatshop.com/cdn/shop/files/texture_indigo-worth-and-worth.jpg?v=1614347676)` }}></span>
                        </div>
                    </div>
                    
                </div>
                
                <div className='grid-container2'>
                    
                    
                    <div className='category-img-wrap'>
                        <div className='relative'>
                            <a className="category-img" href=''>
                                <div className='img-wrap'
                                style={{backgroundImage: `url(https://www.ledr.com/colours/white.jpg)`}}
                                >
                                    <img src="https://images.unsplash.com/photo-1506152983158-b4a74a01c721?q=80&w=2673&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                                </div>
                            <span className='category-layer2' style={{ backgroundImage: `url(//hatshop.com/cdn/shop/files/texture_indigo-worth-and-worth.jpg?v=1614347676)` }}></span>
                            </a>
                        </div>
                    </div>
                    <div className='category-wrap2'>
                            <h2>
                                <a className='category-text' href="">Men's Sweater</a>
                            </h2>
                            <a className='category-link' href="">View</a>
                    </div>
                </div>
            </section>
        )
    }

      return(
        <>
            <Banner />
            <LatestRelease />
            <NewReleases />
        </>
      )
}