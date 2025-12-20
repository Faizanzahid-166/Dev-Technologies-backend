
import {Productcard} from '../components/000_index.js'
import React, { useState, useEffect } from "react";
import { getAllProducts } from "../api/urls.js";
import { useOutletContext } from "react-router";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const { searchTerm } = useOutletContext(); // ✅ get from AppLayout
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

const fetchProducts = (pageNum = 1) => {
  getAllProducts({ page: pageNum, limit: 15 })
    .then((data) => {
      console.log(data)
      setProducts(data.products || []);
      setPages(data.pages || 1);   // total pages
      setPage(data.page || pageNum); // current page
    })
    .catch((err) => console.error("Error fetching products", err));
};

  useEffect(() => {
  fetchProducts(page);
}, [page]);

     useEffect(() => {
    setLoading(true);
    getAllProducts({ search: searchTerm }) // ✅ send search to backend
      .then((data) => {
        setProducts(data.products || []);
      })
      .finally(() => setLoading(false));
  }, [searchTerm]); // ✅ runs when searchTerm changes


  return (
    
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
       {loading ? (
        <p>Loading...</p>
      ) : (
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
           {products.map((product) => (
             <Productcard key={product._id} product={product} />
           ))}
         </div>
      )}

        <div style={{ marginTop: "10px" }}>
       <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="p-2 bg-lime-500 font-bold text-white rounded-lg hover:bg-green-600">Prev</button>
        <span> Page {page} of {pages} </span>
       <button disabled={page >= pages} onClick={() => setPage(page + 1)} className="p-2 bg-blue-600 rounded-lg text-white font-bold hover:bg-blue-800">Next</button>
      </div>


    </div>
  );
}
