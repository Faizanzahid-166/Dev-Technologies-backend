import React from 'react'
import { Link } from "react-router";
import { useCart } from "../context/CartContext.jsx";

function Linkbar() {
        const { cart } = useCart();
  return (
    <div>
        <header className="shadow  py-3">
            
                    {/* routers links pages button */}

                    {/* product route page */}
                    <div className="flex items-center gap-4 m-2 px-3 py-1 justify-center">
                    {/* adminpanel */}
                     <Link to="/adminpanel" className="hover:text-blue-700  bg-green-600 text-white font-bold p-3 rounded-xl text-sm">
                      Admin Panel
                    </Link>

                    {/* Home route page */}
                    <Link to="/" className="hover:text-blue-700 font-bold text-sm">
                      Home
                    </Link>
                      <span className="font-bold">|</span>
                  
                      <Link to="/productspage" className="hover:text-blue-700 font-bold text-sm">
                        Products 
                      </Link>
                      <span className="font-bold">|</span>
                    
                    {/* card link page route */}
                      <Link to="/cartpage" className="hover:text-blue-700 font-bold text-sm ">
                    Cart🛒
                    {cart.length > 0 && (
                      <span className="relative top-[-1rem] left-[-1.2rem] bg-red-500 text-[9px] rounded-full px-1">
                        {cart.length}
                      </span>
                    )}
                  </Link>
                  <span className="font-bold">|</span>

                   <Link to="/hotofferepage" className="hover:text-blue-700 font-bold text-sm ">
                      Hot offere 
                  </Link>
                  {/* <span className="font-bold">|</span> */}
                    </div>
        </header>      
    </div>
  )
}

export default Linkbar
