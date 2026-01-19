"use client";

import React from "react";
import Link from "next/link";

const FeaturedCollection = () => {
  return (
    <>
      <section className="py-16 px-8 lg:px-0 mt-20">
        <div className="container mx-auto flex lg:flex-row flex-col-reverse items-center bg-green-50 rounded-l-lg">
          {/* Left Side */}
          <div className="lg:w-1/2 p-8 text-center lg:text-left">
            <h2 className="text-lg text-gray-600 font-medium mb-4">
              Comfort and style
            </h2>
            <h2 className="text-4xl lg:text-5xl text-black font-bold mb-6">
              Apprel made for your everyday life
            </h2>
            <p className="text-sm text-gray-500 fond-light mb-6">
              Discover high-quality, comfortable clothing that effortlessly
              blends fashion and function. Design to make you look and feel
              great every dat.
            </p>
            <Link
              href="/collection/all"
              className="bg-black text-white px-6 py-3 text-center rounded-lg"
            >
              Shop Now
            </Link>
          </div>
          {/* Right Side */}
          <div className="w-full lg:w-1/2">
            <img
              src="/assets/featured.webp"
              alt="Featured Collection"
              className="w-full h-full object-cover rounded-r-lg"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default FeaturedCollection;
