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
import { MdLogin } from "react-icons/md";
import SearchBar from "./SearchBar";
import CartDrawer from "../Layout/CartDrawer";
import { useAuth } from "@/app/context/AuthContext";

const Navbar = () => {
  // ✅ State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // ✅ Get user from context
  const { currentUser, refreshCurrentUser, loading } = useAuth();

  const navDrawerRef = useRef(null);
  const { items } = useSelector((state) => state.cart);

  const cartItemCount =
    items?.products?.reduce((total, product) => total + product.quantity, 0) ||
    0;

  // ✅ Mounted flag
  useEffect(() => setMounted(true), []);

  // ✅ Close nav drawer when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navDrawerRef.current && !navDrawerRef.current.contains(e.target)) {
        setNavDrawerOpen(false);
      }
    };
    if (navDrawerOpen)
      document.addEventListener("mousedown", handleClickOutside);
    else document.removeEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [navDrawerOpen]);

  // ✅ Toggle functions
  const toggleCartDrawer = () => setDrawerOpen((prev) => !prev);
  const toggleNavDrawer = () => setNavDrawerOpen((prev) => !prev);

  // ✅ User info
  const isLoggedIn = !!currentUser;
  const role = currentUser?.role;

  return (
    <>
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/90 shadow-sm">
        <div className="flex items-center justify-between container p-4 h-12 w-full mx-auto">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold">
            <img
              src="/images/Logo.png"
              alt="Logo"
              className="h-32 w-32 object-cover select-none"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4 text-sm font-semibold">
            <Link href="/collections/all?gender=Male">Men</Link>
            <Link href="/collections/all?gender=Female">Women</Link>
            <Link href="/collections/all?category=Top Wear">Top Wear</Link>
            <Link href="/collections/all?category=Bottom Wear">
              Bottom Wear
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {mounted && !loading && (
              <>
                {/* Role-based Links */}
                {isLoggedIn && role === "admin" && (
                  <Link
                    href="/admin"
                    className="uppercase rounded-lg text-sm bg-black text-white px-2 py-1"
                  >
                    Admin
                  </Link>
                )}
                {isLoggedIn && role === "moderator" && (
                  <Link
                    href="/moderator"
                    className="uppercase rounded-lg text-sm bg-black text-white px-2 py-1"
                  >
                    Moderator
                  </Link>
                )}

                {/* Login / User */}
                {!isLoggedIn && (
                  <Link
                    href="/login"
                    className="flex items-center gap-1 border-2 p-1 rounded-md hover:bg-gray-50 transition"
                  >
                    <MdLogin className="h-6 w-6" />
                    <span className="text-sm whitespace-nowrap">Log In</span>
                  </Link>
                )}
                {isLoggedIn && (
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

            {/* Mobile menu button */}
            <button onClick={toggleNavDrawer} className="lg:hidden">
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
        className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg transition-transform duration-300 z-50 ${
          navDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4 border-b">
          <button onClick={toggleNavDrawer}>
            <IoMdClose className="h-6 w-6 text-gray-700" />
          </button>
        </div>

        <div className="p-4 flex flex-col space-y-4 text-gray-800 font-medium">
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
