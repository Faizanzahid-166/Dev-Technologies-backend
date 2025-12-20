import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getProductById } from "../api/urls.js";
import { useCart } from "../context/CartContext.jsx";

const ProductdetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();
  
  useEffect(() => {
    if (!id) return;
    getProductById(id)
      .then((data) => setProduct(data.product))
      .catch((err) => console.error("Error fetching product:", err));
  }, [id]);


  if (!product) return <p>Loading...</p>;

  return (
 <div className="max-w-5xl mx-auto px-4 py-8">
      {product && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Product Image */}
          <div className="flex justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-full max-w-md rounded-lg shadow-md"
            />
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
            <p className="text-gray-700 mb-4">{product.description}</p>
            <p className="text-lg font-semibold mb-2">Price: ${product.price}</p>
            <p className="text-sm text-gray-500 mb-6">Stock: {product.stock}</p>

            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow"
                onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductdetailsPage;
