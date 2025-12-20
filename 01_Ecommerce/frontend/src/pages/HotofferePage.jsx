import React, { useEffect, useState } from "react";
import { Bannercard } from '../components/000_index.js';
import { getBanners } from "../api/urls.js";
import { useOutletContext } from "react-router";

function HotofferePage() {
  const [banners, setBanners] = useState([]);
  const { searchTerm } = useOutletContext();
  const [loading, setLoading] = useState(true);
useEffect(() => {
  setLoading(true);
  getBanners({ search: searchTerm })
    .then((res) => {
      // Remove last 4 items
        const filtered = res.slice(4); // removes first 4
      setBanners(filtered);
    })
    .catch(console.error)
    .finally(() => setLoading(false));
}, [searchTerm]);


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      {loading ? (
        <p>Loading...</p>
      ) : banners.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {banners.map((product) => (
            <Bannercard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <p>No banners found</p>
      )}
    </div>
  );
}

export default HotofferePage;
