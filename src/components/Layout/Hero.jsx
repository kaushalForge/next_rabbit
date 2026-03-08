"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
const Hero = () => {
  return (
    <>
      <section className="relative overflow-hidden h-100 md:h-150 lg:h-185">
        <Image
          src="/assets/hero-banner.jpg"
          alt="Rabbit"
          fill
          priority
          quality={100}
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-opacity-5 flex items-center justify-center">
          <div className="text-center p-6">
            <h1 className="hero-text-stroke text-6xl md:text-9xl font-bold tracking-wider uppercase text-teal-700/70">
              Pure
              <br />
              Style
            </h1>{" "}
            <p className="text-xs font-bold md:text-2xl mb-6 text-white whitespace-nowrap">
              Explore our vacation-ready outfits with fast worldwide shipping
            </p>{" "}
            <button className="hover:-translate-y-0.5 duration-150 ease-in-out cursor-pointer">
              <Link
                href="/collections/all"
                className="bg-white px-6 py-2 rounded-sm text-gray-950 text-lg font-bold"
              >
                Shop Now
              </Link>
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
