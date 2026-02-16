"use client";
import React, { useState, useCallback } from "react";
import { RiDeleteBin3Line } from "react-icons/ri";
import { toast } from "sonner";
import { useCart } from "@/app/context/CartContext";
import { Loading, Spinner } from "../ui/spinner";

const CartContents = ({ cart }) => {
  const { removeCart, updateCart } = useCart();

  // 🔥 Track loading per item
  const [loadingItems, setLoadingItems] = useState({});

  // Create unique key per cart item
  const getItemKey = (product) =>
    `${product.productId}-${product.weight || ""}-${product.size || ""}-${product.color || ""}`;

  const setItemLoading = (key, value) => {
    setLoadingItems((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /* ================= UPDATE ================= */
  const handleUpdateCart = useCallback(
    async (product, delta) => {
      const itemKey = getItemKey(product);

      if (loadingItems[itemKey]) return; // 🚀 Prevent spam click

      try {
        const newQuantity = product.quantity + delta;

        if (newQuantity < 1) {
          toast.error("Quantity cannot be less than 1");
          return;
        }

        setItemLoading(itemKey, true);

        const payload = {
          productId: product.productId,
          quantity: newQuantity,
        };

        if (product.weight) payload.weight = product.weight;
        if (product.size) payload.size = product.size;
        if (product.color) payload.color = product.color;

        const { status, message } = await updateCart(payload);

        if (status === 200 || status === 201) {
          toast.success(message || "Cart updated");
        } else {
          toast.error(message || "Failed to update cart");
        }
      } catch (err) {
        console.error("handleUpdateCart error:", err);
        toast.error("Failed to update cart");
      } finally {
        setItemLoading(itemKey, false);
      }
    },
    [updateCart, loadingItems],
  );

  /* ================= REMOVE ================= */
  const handleRemoveFromCart = useCallback(
    async (product) => {
      const itemKey = getItemKey(product);

      if (loadingItems[itemKey]) return;

      try {
        setItemLoading(itemKey, true);

        const payload = { productId: product.productId };

        if (product.weight) payload.weight = product.weight;
        if (product.size) payload.size = product.size;
        if (product.color) payload.color = product.color;

        const { status, message } = await removeCart(payload);

        if (status === 200 || status === 201) {
          toast.success(message || "Item removed");
        } else {
          toast.error(message || "Failed to remove item");
        }
      } catch (err) {
        console.error("handleRemoveFromCart error:", err);
        toast.error("Failed to remove item");
      } finally {
        setItemLoading(itemKey, false);
      }
    },
    [removeCart, loadingItems],
  );

  return (
    <div className="space-y-4">
      {cart?.products?.map((product, index) => {
        const itemKey = getItemKey(product);
        const isLoading = loadingItems[itemKey];

        return (
          <div
            key={itemKey}
            className="flex items-start justify-between p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-200"
          >
            {/* Left */}
            <div className="flex items-start gap-4">
              <img
                src={product.image}
                alt={product.name}
                className="h-20 w-24 object-cover rounded-lg border border-slate-300"
              />

              <div className="space-y-1">
                <h3 className="text-base font-medium text-slate-800">
                  {product.name}
                </h3>

                {product?.mainCategory === "Fashion" ? (
                  <p className="text-sm text-slate-500">
                    Size: {product.size} · Color: {product.color}
                  </p>
                ) : (
                  <p className="text-sm text-slate-500">
                    Weight: {product.weight}
                  </p>
                )}

                {/* Quantity */}
                <div className="flex items-center gap-3 mt-2">
                  <button
                    disabled={isLoading}
                    onClick={() => handleUpdateCart(product, -1)}
                    className={`h-8 w-8 rounded-md border border-slate-300 transition
                      ${
                        isLoading
                          ? "opacity-50 cursor-not-allowed"
                          : "text-slate-600 hover:bg-slate-100"
                      }
                    `}
                  >
                    −
                  </button>

                  <span className="text-sm font-medium text-slate-700">
                    {isLoading ? (
                      <Loading className="h-2 w-2" />
                    ) : (
                      product.quantity
                    )}
                  </span>

                  <button
                    disabled={isLoading}
                    onClick={() => handleUpdateCart(product, 1)}
                    className={`h-8 w-8 rounded-md border border-slate-300 transition
                      ${
                        isLoading
                          ? "opacity-50 cursor-not-allowed"
                          : "text-slate-600 hover:bg-slate-100"
                      }
                    `}
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
                disabled={isLoading}
                onClick={() => handleRemoveFromCart(product)}
                className={`transition-colors
                  ${
                    isLoading
                      ? "opacity-50 cursor-not-allowed"
                      : "text-slate-400 hover:text-red-500"
                  }
                `}
              >
                <RiDeleteBin3Line className="h-5 w-5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CartContents;
