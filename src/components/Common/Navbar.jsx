"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiBars3BottomRight,
} from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import SearchBar from "./SearchBar";
import CartDrawer from "../Layout/CartDrawer";
import { useAuth } from "@/app/context/AuthContext";
import Image from "next/image";

const Navbar = () => {
  // States
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const [avatarDropdownOpen, setAvatarDropdownOpen] = useState(false);

  // Context & Redux
  const { currentUser, loading } = useAuth();
  const { items } = useSelector((state) => state.cart);

  const navDrawerRef = useRef(null);
  const avatarRef = useRef(null);

  const cartItemCount =
    items?.products?.reduce((total, product) => total + product.quantity, 0) ||
    0;

  const isLoggedIn = !!currentUser;
  const role = currentUser?.role;

  // Toggle functions
  const toggleCartDrawer = () => setDrawerOpen((prev) => !prev);
  const toggleNavDrawer = () => setNavDrawerOpen((prev) => !prev);
  const toggleAvatarDropdown = () => setAvatarDropdownOpen((prev) => !prev);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        navDrawerRef.current &&
        !navDrawerRef.current.contains(e.target) &&
        avatarRef.current &&
        !avatarRef.current.contains(e.target)
      ) {
        setNavDrawerOpen(false);
        setAvatarDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="sticky left-0 top-0 z-50 backdrop-blur-md shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 container p-4 mx-auto">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center justify-center w-40 h-2 md:w-52 md:h-4"
          >
            <Image
              src="/images/Logo.png"
              alt="Logo"
              width={250}
              height={200}
              quality={80}
              className="select-none"
              priority
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center justify-center space-x-4 text-sm font-semibold flex-1">
            <Link href="/collections/all?gender=Male">Men</Link>
            <Link href="/collections/all?gender=Female">Women</Link>
            <Link href="/collections/all?category=Top Wear">Top Wear</Link>
            <Link href="/collections/all?category=Bottom Wear">
              Bottom Wear
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
            <div className="relative" ref={avatarRef}>
              <button
                onClick={() => {
                  if (isLoggedIn) {
                    // navigate directly
                    window.location.href = "/profile";
                  } else {
                    toggleAvatarDropdown();
                  }
                }}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition"
              >
                <HiOutlineUser className="h-5 w-5 text-gray-700" />
              </button>

              {/* Dropdown for logged-out users */}
              {!isLoggedIn && avatarDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white border rounded shadow-lg flex flex-col z-50">
                  <Link
                    href="/login"
                    className="px-4 py-2 hover:bg-gray-100 text-sm"
                    onClick={() => setAvatarDropdownOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 hover:bg-gray-100 text-sm"
                    onClick={() => setAvatarDropdownOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Cart */}
            <button
              onClick={toggleCartDrawer}
              className="relative flex-shrink-0"
            >
              <HiOutlineShoppingBag className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 left-3 h-4 w-4 rounded-full bg-red-600 text-xs text-white flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Search */}
            <div className="flex-shrink-0">
              <SearchBar />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleNavDrawer}
              className="lg:hidden flex-shrink-0"
            >
              <HiBars3BottomRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Cart Drawer */}
      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

      {/* Mobile Nav */}
      <div
        ref={navDrawerRef}
        className={`lg:hidden fixed top-0 left-0 w-64 h-full bg-white shadow-lg transition-transform duration-300 z-50 ${
          navDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4 border-b">
          <button onClick={toggleNavDrawer}>
            <IoMdClose className="h-6 w-6 text-gray-700" />
          </button>
        </div>

        <div className="lg:hidden p-4 flex flex-col space-y-4 text-gray-800 font-medium">
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
        </div>
      </div>
    </>
  );
};

export default Navbar;
