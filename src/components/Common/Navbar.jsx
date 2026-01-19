"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiBars3BottomRight,
} from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import { MdLogin } from "react-icons/md";
import { useSelector } from "react-redux";
import SearchBar from "./SearchBar";
import CartDrawer from "../Layout/CartDrawer";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { items } = useSelector((state) => state.cart);
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const userInfo = useSelector((state) => state.auth.user);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartItemCount =
    items?.products?.reduce((total, product) => total + product.quantity, 0) ||
    0;

  const toggleCartDrawer = () => setDrawerOpen((prev) => !prev);
  const toggleNavDrawer = () => setNavDrawerOpen((prev) => !prev);

  return (
    <>
      <nav className="sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center justify-between p-4 h-12 w-full">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold">
            <img
              src="/images/logo2.png"
              alt="Logo"
              className="h-32 w-32 object-cover select-none"
            />
          </Link>

          {/* Menu */}
          <div className="hidden md:flex items-center space-x-2 text-sm font-semibold">
            <Link href="/collections/all?gender=Male">Men</Link>
            <Link href="/collections/all?gender=Female">Women</Link>
            <Link href="/collections/all?category=Top Wear">Top Wear</Link>
            <Link href="/collections/all?category=Bottom Wear">
              Bottom Wear
            </Link>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            {mounted && (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="uppercase rounded-lg text-sm bg-black text-white px-2 py-1"
                  >
                    Admin
                  </Link>
                )}

                {!userInfo ? (
                  <Link
                    href="/login"
                    className="flex items-center gap-1 border-2 p-1 rounded-md"
                  >
                    <MdLogin className="h-6 w-6" />
                    <span className="text-sm whitespace-nowrap">Log In</span>
                  </Link>
                ) : (
                  <Link href="/profile">
                    <HiOutlineUser className="h-6 w-6" />
                  </Link>
                )}
              </>
            )}

            {/* Cart */}
            <button onClick={toggleCartDrawer} className="relative">
              <HiOutlineShoppingBag className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 left-3 h-4 w-4 rounded-full bg-red-600 text-xs text-white flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Search */}
            <SearchBar />

            <button onClick={toggleNavDrawer} className="lg:hidden">
              <HiBars3BottomRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

      {/* Mobile Nav */}
      <div
        className={`fixed top-0 left-0 w-3/4 h-full bg-white transition-transform duration-300 z-50 ${
          navDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={toggleNavDrawer}>
            <IoMdClose className="h-6 w-6" />
          </button>
        </div>

        <nav className="p-4 space-y-4">
          <Link href="/collections/all?gender=Male" onClick={toggleNavDrawer}>
            Men
          </Link>
          <Link href="/collections/all?gender=Female" onClick={toggleNavDrawer}>
            Women
          </Link>
          <Link
            href="/collections/all?category=Top Wear"
            onClick={toggleNavDrawer}
          >
            Top Wear
          </Link>
          <Link
            href="/collections/all?category=Bottom Wear"
            onClick={toggleNavDrawer}
          >
            Bottom Wear
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
