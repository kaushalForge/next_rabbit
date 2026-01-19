"use client";

import React from "react";
import Link from "next/link";
const Hero = () => {
  return (
    <>
      <section className="relative overflow-hidden">
        <img
          className="w-full h-[400px] md:h-[600px] lg:h-[750px] object-cover"
          src="/assets/rabbit-hero.webp"
          alt="Rabbit"
        />
        <div className="absolute inset-0 bg-opacity-5 flex items-center justify-center">
          <div className="text-center text-white p-6">
            <h1 className="text-4xl md:text-9xl font-bold tracking-tighter uppercase">
              Vacation
              <br />
              Ready
            </h1>
            <p className="text-sm tracking-tighte md:text-lg mb-6">
              Explore our vacation-ready outfits with fast worldwide shipping.
            </p>
            <Link
              href="/collections/all"
              className="bg-white px-6 py-2 rounded-sm text-gray-950 text-lg"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
