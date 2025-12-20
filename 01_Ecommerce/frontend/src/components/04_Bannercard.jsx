import React from "react";
import { useCart } from "../context/CartContext.jsx";
import { Link } from "react-router";

export default function Bannerard({ product }) {
  const { addToCart } = useCart();


  return (

    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <Link to={`/banner/${product._id}`}>
      <div className="product-card">
      <div className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
        
        <img
          src={product.image}
          alt={product.name}
          className="object-contain h-full w-fit p-4"
        />
        </div>
        </div>
        </Link>

      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-lg font-semibold text-blue-600">${product.price}</p>
        <button
            onClick={() => addToCart(product)}
          className="mt-auto bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Add to Cart
        </button>
      

      </div>
    </div>
  
  );
}
