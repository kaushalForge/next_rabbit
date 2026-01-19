"use client";
import React from "react";
import { RiDeleteBin3Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import {
  removeFromCart,
  updateCartItemQuantity,
} from "../redux/slices/cartSlice";
import { toast } from "sonner";

const CartContents = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (productId, delta, quantity, size, color) => {
    const newQuantity = quantity + delta;
    if (newQuantity < 1) return;

    dispatch(
      updateCartItemQuantity({
        productId,
        quantity: newQuantity,
        guestId,
        userId,
        size,
        color,
      }),
    );
  };

  const handleRemoveFromCart = (productId, size, color) => {
    dispatch(removeFromCart({ productId, guestId, userId, size, color })).then(
      () => toast.success("Removed from cart"),
    );
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
                    handleAddToCart(
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
                    handleAddToCart(
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
              $ {product.price.toLocaleString()}
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
