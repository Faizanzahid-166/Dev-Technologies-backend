import React,{useState,useEffect} from 'react';
//import { services } from "../data/service.js";
import { getBanners } from "../api/urls.js";
import {Link} from 'react-router'

export default function Services() {
  const [banners, setBanners] = useState([]);

useEffect(() => {
    getBanners()
      .then((res) => {
          const selectedProducts = res.filter(item =>
        ["689c6518654214bdddc127e2","689c64e8654214bdddc127de",
          "689c649e654214bdddc127db","689c642a654214bdddc127d8", ].includes(item._id)
      );
      setBanners(selectedProducts);
          })
    .catch(console.error);
}, []);
 
  return (
    <section  className="bg-white py-10 px-4 md:px-12 hidden sm:block">
      <h1 className='font-bold text-2xl m-2 ml-[10rem]' >Services</h1>
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

       {/* this banner fetch from backend */}
      
 
          {banners.map((banner, i) => (
            
            <div  key={i} className="slide rounded-lg flex-shrink-0 flex flex-col items-center border transition hover:shadow-md shadow-sm p-1  ">
             
             <Link to="/services">
              <img src={banner.image} alt={banner.name}  className="w-80 h-40 object-fit rounded-md m-3 transition hover:shadow-md"/>
              </Link>  
                <div> 
                  
                   <h4 className="font-semibold text-md">{banner.name}</h4>
                    <p className="text-sm text-gray-600">{banner.description}</p> 
                 </div>
           </div>
          ))}
       </div>
   
    </section>
  );
}
