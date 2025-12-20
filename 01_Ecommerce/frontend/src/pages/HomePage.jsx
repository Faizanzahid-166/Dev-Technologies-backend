import {Banner, Productcard, Dealsection, InquiryForm, RecommendedItem, Region,Services} from '../components/000_index'
import { useEffect, useState } from "react";
import { getAllProducts,} from "../api/urls.js";
import { useOutletContext } from "react-router";

function HomePage() {
 const [products, setProducts] = useState([]);
  const { searchTerm } = useOutletContext(); // ✅ get from AppLayout
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    getAllProducts()
      .then((data) => {
        console.log("home",data);
         const eightProducts = getEightDifferentCategoryProducts(data.products);
        setProducts(eightProducts); // depends on backend response
      })
      .catch((err) => console.error("Error fetching products", err));
  }, []);

   const getEightDifferentCategoryProducts = (products) => {
    const seenCategories = new Set();
    const uniqueProducts = [];

    for (let product of products) {
      if (!seenCategories.has(product.category)) {
        uniqueProducts.push(product);
        seenCategories.add(product.category);
      }
      if (uniqueProducts.length === 8) break;
    }

    return uniqueProducts;
  };

   useEffect(() => {
    setLoading(true);
    getAllProducts({ search: searchTerm }) // ✅ send search to backend
      .then((data) => {
        setProducts(data.products || []);
      })
      .finally(() => setLoading(false));
  }, [searchTerm]); // ✅ runs when searchTerm changes


  return (
    <div>
      <Banner />
          <Dealsection />
              {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Productcard key={product._id} product={product} />
          ))}
        </div>
      )}
         <InquiryForm />
         <RecommendedItem />
         <Services />
         <Region />
      
     </div>
    
  )
}

export default HomePage
