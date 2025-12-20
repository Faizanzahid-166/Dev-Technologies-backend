import React, { useEffect, useState } from "react";
import { Productcard, } from './000_index.js'
import { getAllProducts } from "../api/urls.js"; // Assuming you have this API call
import DealsTimer from './05_DealsTimer.jsx'

const DealTimer = () => {
 const [products, setProducts] = useState([]);

  
  useEffect(() => {
    getAllProducts()
      .then((data) => {
        console.log("dealsection",data);
         const start = Math.floor(data.products.length / 2) - 4;
        setProducts(data.products.slice(start, start + 6)); // depends on backend response
      })
      .catch((err) => console.error("Error fetching products", err));
  }, []);



  return (
        <>
        <section className="px-4 md:px-12 py-8 bg-gray-300 m-1 ">
          <div className="max-w-[1200px] mx-auto">
            {/* Title and Timer */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-semibold mb-2 md:mb-0">Deals and Offers</h2>
              <DealsTimer />
            </div>
    
            {/* Product Cards */}
            <div className="flex gap-4 overflow-x-auto no-scrollbar">
              {products.map((item) => (
                <div key={item.id} className="min-w-[180px] bg-white shadow rounded-lg p-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-28 mx-auto object-contain mb-3"
                  />
                  <h3 className="text-sm font-medium text-center">{item.category}</h3>
                  <p className="text-center text-gray-600 text-sm">Stock: {item.stock}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        </>
  );
};

export default DealTimer;
