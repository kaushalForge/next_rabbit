"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

const GenderCollectionSection = () => {
  return (
    <>
      <section className="py-8 px-0 md:py-12">
        <div className="container mx-auto flex flex-row gap-6 md:gap-8">
          {/* Womens Collection */}
          <div className="relative flex-1">
            <div className="relative w-full h-120 md:h-175">
              <Image
                src="/assets/womensCollection.jpg"
                alt="Women's Collection"
                fill
                quality={100}
                className="object-cover object-top"
                sizes="(max-width: 768px) 50vw, 50vw"
                priority
              />
            </div>
            <div className="absolute bottom-2 left-2 md:bottom-8 md:left-8 bg-white/70 bg-opacity-90 p-4">
              <h2 className="text-xl tracking-tighter whitespace-nowrap font-bold text-gray-900 mb-3">
                Women's Collection
              </h2>
              <Link
                href="/collections/all?mainCategory=Fashion&gender=Female"
                className="text-gray-900 underline"
              >
                Shop Now
              </Link>
            </div>
          </div>

          {/* Mens Collection */}
          <div className="relative flex-1">
            <div className="relative w-full h-120 md:h-175">
              <Image
                src="/assets/mensCollection.jpg"
                alt="Men's Collection"
                fill
                quality={100}
                className="object-cover object-top"
                sizes="(max-width: 768px) 50vw, 50vw"
                priority
              />
            </div>
            <div className="absolute bottom-2 left-2 md:bottom-8 md:left-8 bg-white/70 bg-opacity-90 p-4">
              <h2 className="text-xl tracking-tighter whitespace-nowrap font-bold text-gray-900 mb-3">
                Men's Collection
              </h2>
              <Link
                href="/collections/all?mainCategory=Fashion&gender=Male"
                className="text-gray-900 underline"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default GenderCollectionSection;
