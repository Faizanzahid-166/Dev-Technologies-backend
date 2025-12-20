import React, { useEffect, useState, useRef } from "react";
import { getBanners } from "../api/urls.js";
import {Link} from 'react-router'

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef(null);

useEffect(() => {
  getBanners()
    .then((res) => {
       console.log("Banner data:", res);
      // setBanners(res.slice(0));  // <-- Use the `data` array here
         const selectedProducts = res.filter(item =>
        ["689a293b2f65a3faa2e64368","689a1d832f65a3faa2e64365",
          "68996bef80d3c5a73c7a9ab3","68996af7f7535705bb34e0ed",
          "68996c5480d3c5a73c7a9ab6", ].includes(item._id)
      );
      setBanners(selectedProducts);
    })
    .catch(console.error);
}, []);



  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setCurrent((prevIndex) =>
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => {
      resetTimeout();
    };
  }, [current, banners.length]);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const goToSlide = (index) => {
    setCurrent(index);
  };

  if (banners.length === 0) return <div>Loading banners...</div>;

  return (
    <section className="max-w-[1200px] mx-auto px-4 mt-6 hidden sm:block">
    <div className="flex flex-col lg:flex-row gap-4">
        
        {/* Left: Category List */}
        <div className="bg-white shadow rounded-md w-full lg:w-[200px] hidden lg:block">
          <ul className="text-sm text-gray-700 divide-y">
            {[
              'Automobiles',
              'Clothes and wear',
              'Home interiors',
              'Computer and tech',
              'Tools, equipments',
              'Sports and outdoor',
              'Animal and pets',
              'Machinery tools',
              'More category'
            ].map((item, idx) => (
              <li key={idx} className="p-2 hover:bg-gray-100 cursor-pointer">
                {item}
              </li>
            ))}
          </ul>
        </div>

            {/* Center: Banner */}
                <div className="flex-1">
                  <div className="bg-[#0044ff36] rounded-md overflow-hidden w-full h-full flex items-center justify-center p-4 md:p-6">
                    <div className="banner-slider relative overflow-hidden">
                           <h2 className="text-xl md:text-2xl font-semibold mb-2">
                              Latest trending <br /> <span className="text-[#238aff]">Electronic items</span>
                           </h2>
                     {/* this banner fetch from backend */}
                     <div className="slides flex transition-transform duration-500" style={{ transform: `translateX(-${current * 100}%)` }}>
                       {banners.map((banner, i) => (
                        <div  key={i} className="slide flex-shrink-0 w-full flex flex-col items-center">
                        <img src={banner.image} alt={banner.name} width={300} />
                        </div>
                      ))}
                      </div>

                      


                     {/* Dots */}
                     <div className="dots flex justify-center mt-4">
                       {banners.map((_, idx) => (
                       <button key={idx} className={`mx-1 w-3 h-3 rounded-full ${ idx === current ? "bg-blue-600" : "bg-gray-300" }`} onClick={() => goToSlide(idx)} aria-label={`Go to slide ${idx + 1}`}/>))}
                     </div>

                     
                  
                    </div>
                  </div>
                 </div>
        
                {/* Right: CTA Cards */}
                <div className="hidden lg:block flex-col gap-3 w-[220px]">
                  <div className="bg-white shadow rounded-md p-3">
                    <p className="text-sm text-gray-600">Hi, user</p>
                    <button className="bg-[#127FFF] text-white text-sm px-4 py-1 mt-2 rounded">Join now</button>
                    <Link to="login">
                    <button className="border text-sm text-[#127FFF] mt-2 w-full py-1 rounded border-[#127FFF]">Log in</button>
                    </Link>
                  </div>
                  <div className="bg-orange-100 text-orange-800 text-sm rounded-md p-3">
                    <p>Get US $10 off</p>
                    <p>with a new supplier</p>
                  </div>
                  <div className="bg-teal-100 text-teal-800 text-sm rounded-md p-3">
                    <p>Send quotes with</p>
                    <p>supplier preferences</p>
                  </div>
                </div>
              </div>
            </section>


  );
};

export default Banner;
