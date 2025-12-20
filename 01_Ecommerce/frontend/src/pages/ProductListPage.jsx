// src/pages/ProductList.jsx
import { useEffect, useState } from "react";
import { getAllProducts,getBanners } from "../api/urls.js";

export default function ProductListPage() {
  const [products, setProducts] = useState([]);


  useEffect(() => {
    getAllProducts()
      .then((data) =>  
       setProducts(data.products)
      )
      .catch((err) => console.error("Error fetching products", err));


      // getBanners()
      // .then((res) => 
      // setProducts(res.products.data))
      // .catch((err) => console.error("error",err))
  }, []);

  return (
    <div>
      <h1 className="font-bold text-2xl">All Products</h1>
      <div className="p-2 mx-auto border-2 rounded-xl ">
      {products.map((p) => (
        <div key={p._id} className="p-2 mx-auto border-2 rounded-xl m-2">
        <div>{p.name}</div>
        <div><img src={p.img} alt="" /></div>   
        </div>
      ))}
      </div>
    </div>
  );
}
