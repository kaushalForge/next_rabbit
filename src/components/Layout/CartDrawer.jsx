"use client";

import React, { useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import CartContents from "../Cart/CartContents";
import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";

const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
  const router = useRouter();
  const pathname = usePathname();

  const drawerRef = useRef(null);

  const { user, guestId } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);

  const userId = user ? user._id : null;

  // 🔹 Close on outside click
  useEffect(() => {
    if (!drawerOpen) return;

    const handleOutsideClick = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        toggleCartDrawer();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [drawerOpen, toggleCartDrawer]);

  // 🔹 Close drawer on route change
  useEffect(() => {
    if (drawerOpen) {
      toggleCartDrawer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-3/4 sm:w-1/2 md:w-[30rem] bg-white shadow-lg transform transition-transform duration-300 flex flex-col z-50 ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <button onClick={toggleCartDrawer}>
            <IoMdClose className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Cart Products */}
        <div className="cart-products flex-grow px-4 py-2 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Your Cart</h2>

          {items && items?.products?.length > 0 ? (
            <CartContents cart={items} userId={userId} guestId={guestId} />
          ) : (
            <p className="text-center">Your cart is empty!</p>
          )}
        </div>

        {/* Checkout Button */}
        <div className="p-4 bg-white sticky bottom-0">
          <button
            onClick={() => router.push("/checkout")}
            className="w-full p-2 rounded-lg font-semibold text-lg bg-black hover:bg-neutral-800 transition duration-300 text-white"
          >
            Checkout
          </button>
          <p className="text-sm tracking-tight text-gray-500 mt-2 text-center">
            Shipping, takes and discount codes calculated at checkout.
          </p>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
