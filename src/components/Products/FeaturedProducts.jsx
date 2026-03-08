"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const ProductCard = ({ product }) => {
  const [loaded, setLoaded] = useState(false);

  const imageUrl = product?.images?.[0]?.url;
  const imageAlt = product?.images?.[0]?.altText || product?.name || "Product";
  const price = product?.fashion[0]?.price;
  const offerPrice = product?.fashion[0]?.offerPrice;

  return (
    <Link href={`/collections/product/${product?._id}`} className="group">
      <div className="relative aspect-7/8 w-full overflow-hidden rounded-xl bg-gray-100">
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-gray-200 rounded-xl" />
        )}
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          unoptimized
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`object-cover group-hover:opacity-75 transition-all duration-300
            ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      </div>

      <h3 className="mt-3 text-sm text-gray-700 truncate">{product?.name}</h3>

      <div className="mt-1 flex items-center gap-2">
        {offerPrice ? (
          <>
            <span className="text-base font-semibold text-gray-900">
              Rs.{offerPrice}
            </span>
            <span className="text-sm text-gray-400 line-through">
              Rs.{price}
            </span>
          </>
        ) : (
          <span className="text-base font-semibold text-gray-900">
            Rs.{price}
          </span>
        )}
      </div>
    </Link>
  );
};

export default function FeaturedProducts({ products = [] }) {
  if (!products?.length) return null;

  return (
    <div className="mx-auto container px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-center flex-col w-full">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-2 font-medium">
          Hand Picked
        </p>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
          Featured Products
        </h2>
        <p className="text-gray-500 mt-2 text-sm md:text-base max-w-2xl">
          Curated pieces chosen for their quality, style, and value — the best
          of what Rabbit has to offer.
        </p>
      </div>
      <div className="mt-6">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product?._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
