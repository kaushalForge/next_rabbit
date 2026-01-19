"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

const cart = {
  products: [
    {
      name: "Stylish Jacket",
      size: "M",
      color: "Black",
      price: 120,
      image: "https://picsum.photos/150?random=1",
    },
    {
      name: "Casual Sneakers",
      size: "42",
      color: "White",
      price: 225,
      image: "https://picsum.photos/150?random=2",
    },
  ],
  totalPrice: 345,
};

const Checkout = () => {
  // Optional: read query param if needed
  const searchParams = useSearchParams();
  const productId = searchParams?.get("productId");

  const [checkoutId, setCheckoutId] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  const handleCreateCheckout = (e) => {
    e.preventDefault();
    // In real app, call backend to create checkout session
    setCheckoutId(123);
  };

  const handleChange = (field, value) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
      {/* Left Section */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h2 className="text-2xl uppercase mb-6">Checkout</h2>
        {productId && <p className="mb-4 text-sm text-gray-500">Buying product: {productId}</p>}
        <form onSubmit={handleCreateCheckout}>
          <h3 className="text-lg mb-4">Contact Details</h3>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value="user@example.com"
              className="w-full p-2 border rounded"
              disabled
            />
          </div>

          <h3 className="text-lg mb-4">Delivery</h3>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                value={shippingAddress.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Last Name</label>
              <input
                type="text"
                value={shippingAddress.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              value={shippingAddress.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">City</label>
              <input
                type="text"
                value={shippingAddress.city}
                onChange={(e) => handleChange("city", e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Postal Code</label>
              <input
                type="text"
                value={shippingAddress.postalCode}
                onChange={(e) => handleChange("postalCode", e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Country</label>
            <input
              type="text"
              value={shippingAddress.country}
              onChange={(e) => handleChange("country", e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Phone</label>
            <input
              type="tel"
              value={shippingAddress.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mt-6">
            {!checkoutId ? (
              <button
                className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition-colors"
                type="submit"
              >
                Continue to Payment
              </button>
            ) : (
              <div>
                <h3 className="text-lg mb-4">Pay with Paypal</h3>
                {/* Render Paypal button here */}
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Right Section (Cart Summary) */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h2 className="text-2xl uppercase mb-6">Order Summary</h2>
        <ul className="space-y-4">
          {cart.products.map((p, i) => (
            <li key={i} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-sm text-gray-500">
                    {p.color} / {p.size}
                  </p>
                </div>
              </div>
              <p className="font-semibold">${p.price}</p>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span>${cart.totalPrice}</span>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
