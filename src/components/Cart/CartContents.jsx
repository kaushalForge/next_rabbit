"use client";
import React from "react";
import { RiDeleteBin3Line } from "react-icons/ri";
import { toast } from "sonner";
import { useCart } from "@/app/context/CartContext";

const CartContents = ({ cart }) => {
  const { removeCart, updateCart } = useCart();

  const handleUpdateCart = async (
    productId,
    delta,
    currentQuantity,
    size,
    color,
  ) => {
    try {
      const newQuantity = currentQuantity + delta;

      if (newQuantity < 1) {
        toast.error("Quantity cannot be less than 1");
        return;
      }

      const { status, message } = await updateCart({
        productId,
        quantity: newQuantity,
        size,
        color,
      });

      if (status === 200 || status === 201) {
        toast.success(message || "Cart updated");
      } else {
        toast.error(message || "Failed to update cart");
      }
    } catch (err) {
      console.error("handleUpdateCart error:", err);
      toast.error("Failed to update cart");
    }
  };

  const handleRemoveFromCart = async (productId, size, color) => {
    try {
      const { status, message } = await removeCart({
        productId,
        size,
        color,
      });

      if (status === 200 || status === 201) {
        toast.success(message || "Item removed");
      } else {
        toast.error(response?.message || "Failed to remove item");
      }
    } catch (err) {
      console.error("handleRemoveFromCart error:", err);
      toast.error("Failed to remove item");
    }
  };

  return (
    <div className="space-y-4">
      {cart?.products?.map((product, index) => (
        <div
          key={index}
          className="flex items-start justify-between p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-200"
        >
          {/* Left */}
          <div className="flex items-start gap-4">
            <img
              src={product.image}
              alt={product.name}
              className="h-20 w-24 object-cover rounded-lg border border-slate-300 transiton-all"
              onLoad={(e) => e.target.classList.remove("blur-md")}
            />

            <div className="space-y-1">
              <h3 className="text-base font-medium text-slate-800">
                {product.name}
              </h3>

              <p className="text-sm text-slate-500">
                Size: {product.size} · Color: {product.color}
              </p>

              {/* Quantity */}
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() =>
                    handleUpdateCart(
                      product.productId,
                      -1,
                      product.quantity,
                      product.size,
                      product.color,
                    )
                  }
                  className="h-8 w-8 rounded-md border border-slate-300 text-slate-600 hover:bg-slate-100 transition"
                >
                  −
                </button>

                <span className="text-sm font-medium text-slate-700">
                  {product.quantity}
                </span>

                <button
                  onClick={() =>
                    handleUpdateCart(
                      product.productId,
                      1,
                      product.quantity,
                      product.size,
                      product.color,
                    )
                  }
                  className="h-8 w-8 rounded-md border border-slate-300 text-slate-600 hover:bg-slate-100 transition"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-col items-end gap-3">
            <p className="text-sm font-semibold text-slate-700">
              Rs.{product.offerPrice}
            </p>

            <button
              onClick={() =>
                handleRemoveFromCart(
                  product.productId,
                  product.size,
                  product.color,
                )
              }
              className="text-slate-400 hover:text-red-500 transition-colors"
            >
              <RiDeleteBin3Line className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartContents;
