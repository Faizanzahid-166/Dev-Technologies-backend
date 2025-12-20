import React, { createContext, useContext, useState, useEffect } from "react";
import * as cartApi from "../api/urls.js";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const token = localStorage.getItem("token");

  // Optional: get userId if backend needs it
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  // Load cart from backend
  useEffect(() => {
    if (token) {
      cartApi.getCart(token)
        .then((res) => setCart(res.data.items || []))
        .catch((err) => console.error("Load cart error:", err));
    }
  }, [token]);

  // Add item to cart
  const addItemToCart = async (product, quantity = 1) => {
    if (!token) return alert("Login first");
    try {
      await cartApi.addToCart(product._id, quantity, token);
      setCart((prev) => {
        const existing = prev.find((i) => i._id === product._id);
        if (existing) {
          return prev.map((i) =>
            i._id === product._id
              ? { ...i, quantity: i.quantity + quantity }
              : i
          );
        }
        return [...prev, { ...product, quantity }];
      });
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

 

const updateItemQuantity = async (productId, quantity) => {
  if (!token) return alert("Login first");
  if (quantity < 1) return;

  try {
    await cartApi.updateCartItem(productId, quantity, token);
    setCart((prev) =>
      prev.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  } catch (err) {
    console.error("Update cart error:", err);
  }
};

const removeItemFromCart = async (productId) => {
  if (!token) return alert("Login first");
  try {
    await cartApi.removeFromCart(productId, token);
    setCart((prev) => prev.filter((item) => item._id !== productId));
  } catch (err) {
    console.error("Remove from cart error:", err);
  }
};



  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart: addItemToCart,
        updateCartItem: updateItemQuantity,
         removeItemFromCart, // rename here
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
