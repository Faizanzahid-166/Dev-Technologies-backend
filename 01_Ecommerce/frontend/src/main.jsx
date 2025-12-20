import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from "react-router";
import './index.css'
import routers from "./router.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { AuthProvider } from './context/AuthContext';



createRoot(document.getElementById('root')).render(
  <StrictMode> 
    
    <AuthProvider>
    <CartProvider>
        <RouterProvider router={routers} />
    </CartProvider>
    </AuthProvider>
  </StrictMode>,
)
