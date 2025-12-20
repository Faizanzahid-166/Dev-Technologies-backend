import React,{useState, useEffect} from 'react';
import {getBanners} from '../api/urls.js'
import {Link} from 'react-router'
//import { products } from '../data/products.js';

export default function RecommendedItem() {

  const [banners, setBanners] = useState([]);

  useEffect(() => {
    getBanners()
      .then((res) => {
        console.log("Banner data:", res);
         const start = Math.floor(res.length / 2) - 4;
        setBanners(res.slice(start, start + 8));  // <-- Use the `data` array here
      })
      .catch(console.error);
  }, []);
  
  return (
    <section className="px-4 md:px-12 py-10 bg-[#f7f7f7] hidden sm:block">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-xl md:text-2xl font-semibold mb-6">Recommended Items</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {banners.map((product) => (
              <div className="flex flex-col items-center justify-center gap-3 p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition">
              <Link to={`/banner/${product._id}`}>
               <img src={product.image} alt={product.name} className='rounded-xl'/>
               </Link>
              {product.name}<br/>
              Price: {product.price}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
