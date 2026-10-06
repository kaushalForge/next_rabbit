"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
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
import { useCart } from "@/app/context/CartContext";


const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const [avatarDropdownOpen, setAvatarDropdownOpen] = useState(false);

  const { cartQuantity } = useCart();
  const { currentUser } = useAuth();

  const navDrawerRef = useRef(null);
  const avatarRef = useRef(null);

  const isLoggedIn = !!currentUser;

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
        <div className="flex items-center justify-between container p-4 mx-auto">
          {/* Logo */}
          <Link href="/" className="shrink-0 ml-8 -mt-3">
            <div className="flex items-center">
              <Image
                src="/images/nepstyle.png"
                alt="Logo"
                width={160}
                height={56}
                className="object-contain h-14 w-auto"
                priority
              />
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center justify-center space-x-4 text-sm font-semibold">
            <Link
              href="/?mainCategory=Fashion&gender=Male"
              prefetch={true}
            >
              Men
            </Link>
            <Link
              href="/?mainCategory=Fashion&gender=Female"
              prefetch={true}
            >
              Women
            </Link>
            <Link
              href="/?mainCategory=Fashion&category=Top+Wear"
              prefetch={true}
            >
              Top Wear
            </Link>
            <Link
              href="/?mainCategory=Fashion&category=Bottom+Wear"
              prefetch={true}
            >
              Bottom Wear
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2 md:space-x-4 shrink-0">
            {/* Avatar */}
            <div className="relative" ref={avatarRef}>
              <Link
                href="/profile"
                prefetch
                className="relative flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 bg-gray-200 hover:bg-gray-300 transition overflow-hidden"
              >
                {currentUser?.avatar ? (
                  <Image
                    src={currentUser.avatar}
                    alt={currentUser?.name || "User Avatar"}
                    fill
                    priority
                    referrerPolicy="no-referrer"
                    className="rounded-full object-cover"
                  />
                ) : (
                  <Image
                    src="/images/Avatar.png"
                    alt="Default Avatar"
                    fill
                    priority
                    className="rounded-full object-cover opacity-70"
                  />
                )}
              </Link>

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
            <button onClick={toggleCartDrawer} className="relative shrink-0">
              <HiOutlineShoppingBag className="h-6 w-6" />
              {cartQuantity > 0 && (
                <span className="absolute top-0 left-3 h-4 w-4 rounded-full bg-red-600 text-xs text-white flex items-center justify-center">
                  {cartQuantity}
                </span>
              )}
            </button>

            {/* Search */}
            <div className="shrink-0">
              <SearchBar />
            </div>

            {/* Mobile Menu Button */}
            <button onClick={toggleNavDrawer} className="lg:hidden shrink-0">
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
        <div className="flex justify-end p-4 border-b border-[#eaeaea]">
          <div className="flex items-center w-full justify-between gap-1">
            <div className="flex items-center justify-center gap-0.5">
              <HiBars3BottomRight className="shrink-0" />
              <h3>Menu</h3>
            </div>
            <button onClick={toggleNavDrawer}>
              <IoMdClose className="h-6 w-6 text-gray-700" />
            </button>
          </div>
        </div>

        <div className="p-4 flex flex-col space-y-4 text-gray-800 font-medium">
          <Link href="/?gender=Male" onClick={toggleNavDrawer}>
            Men
          </Link>
          <Link href="/?gender=Female" onClick={toggleNavDrawer}>
            Women
          </Link>
          <Link
            href="/?category=Top Wear"
            onClick={toggleNavDrawer}
          >
            Top Wear
          </Link>
          <Link
            href="/?category=Bottom Wear"
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
