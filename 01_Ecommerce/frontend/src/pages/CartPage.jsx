import React from "react";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cart, updateCartItem,  removeItemFromCart, clearCart } = useCart();

  // Add this here at the top
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (cart.length === 0)
    return <div className="p-6 text-center text-gray-500">Your cart is empty.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>
      <div className="space-y-4">
        {cart.map((item) => (
          <div key={item._id} className="flex items-center justify-between bg-white p-4 rounded shadow">
            <div className="flex items-center gap-4">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-contain" />
              <div>
                <h2 className="font-medium">{item.name}</h2>
                <p className="text-sm text-gray-500">${item.price}</p>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => updateCartItem(item._id, item.quantity - 1)}
                    disabled={item.quantity === 1}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateCartItem(item._id, item.quantity + 1)}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
  <button onClick={() => removeItemFromCart(item._id)}>Remove</button>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-between items-center">
        <span className="text-lg font-semibold">Total: ${total.toFixed(2)}</span>
        <button
          onClick={clearCart}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
}
