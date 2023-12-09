import react from 'react';
import "./styles/HomeStyles.css"
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Banner from '../../../components/Banner';

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
          breakpoint: { max: 800, min: 464 },
          items: 2,
          slidesToSlide: 2 // optional, default to 1.
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
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
                <p className='new-release-btn'>
                    <button>See Product</button>
                </p>
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

      return(
        <>
            <Banner />
            <NewReleases />
        </>
      )
}