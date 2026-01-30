"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";

const ProductGrid = ({ products = [] }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <section className="border-[#f1f1f1] rounded-ss-2xl">
      <div className="mx-auto max-w-screen-xl px-4">
        {Array.isArray(products) && products.length > 0 && (
          <div className="mb-4 grid gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-4">
            {/* 1number */}

            {products.map((product, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 bg-gray-100/40 p-6 shadow-sm"
              >
                <div className="h-56 w-full relative overflow-hidden rounded-xl">
                  {!loaded && (
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#eaf2ff] via-[#fff1e6] to-[#eaf2ff]"
                      initial={{ backgroundPosition: "0% 50%" }}
                      animate={{ backgroundPosition: "200% 50%" }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      style={{
                        backgroundSize: "200% 200%",
                      }}
                    />
                  )}

                  <Link href={`/collections/product/${product?._id}`}>
                    <div className="relative w-full aspect-square md:aspect-[3/4] overflow-hidden">
                      <Image
                        src={product?.images?.[0]?.url}
                        alt={
                          product?.images?.[0]?.altText ||
                          product?.name ||
                          "Product Image"
                        }
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        quality={75}
                        loading="lazy"
                        onLoad={() => setLoaded(true)}
                        className={`object-cover object-top transition-opacity duration-300 ${
                          loaded ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    </div>
                  </Link>
                </div>

                <div className="pt-6 space-y-2">
                  <button className="h-12 w-full">
                    <Link
                      href={`/collections/product/${product?._id}`}
                      className="text-lg font-semibold leading-tight text-gray-900 hover:underline"
                    >
                      {product?.name}
                    </Link>
                  </button>
                  <p className="pt-2 h-20 text-sm leading-relaxed text-gray-600 font-medium text-left tracking-normal">
                    {(() => {
                      const text = product?.description || "";
                      const limit = 70;
                      return text.length > limit
                        ? text.slice(0, limit).trim() + "…"
                        : text;
                    })()}
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.round(product?.rating || 0)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
                        </svg>
                      ))}
                    </div>

                    <p className="text-sm font-medium text-gray-900">
                      {(product?.rating || 0).toFixed(1)}
                    </p>

                    {product?.reviewCount && (
                      <p className="text-sm font-medium text-gray-500">
                        ({product.reviewCount})
                      </p>
                    )}
                  </div>
                  <ul className="mt-2 flex items-center justify-between gap-2">
                    <li className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-gray-500"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 7h6l2 4m-8-4v8m0-8V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v9h2m8 0H9m4 0h2m4 0h2v-4m0 0h-5m3.5 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-10 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
                        />
                      </svg>

                      <p className="text-sm font-medium text-gray-500">
                        Fast Delivery
                      </p>
                    </li>

                    <li className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-gray-500"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeWidth="2"
                          d="M8 7V6c0-.6.4-1 1-1h11c.6 0 1 .4 1 1v7c0 .6-.4 1-1 1h-1M3 18v-7c0-.6.4-1 1-1h11c.6 0 1 .4 1 1v7c0 .6-.4 1-1 1H4a1 1 0 0 1-1-1Zm8-3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
                        />
                      </svg>

                      <p className="text-sm font-medium text-gray-500">
                        Best Price
                      </p>
                    </li>
                  </ul>

                  <div className="mt-4 space-y-4">
                    {/* Price + Colors */}
                    <div className="flex items-center justify-between">
                      {/* Price */}
                      <div className="text-xl font-semibold text-gray-900">
                        {product?.offerPrice ? (
                          <div className="flex items-center gap-2 flex-row">
                            <span className="text-sm line-through text-red-400">
                              Rs.{product?.price}
                            </span>
                            <span>Rs.{product?.offerPrice}</span>
                          </div>
                        ) : (
                          <span>Rs.{product?.price}</span>
                        )}
                      </div>

                      {/* Colors */}
                      <div className="flex items-center gap-2">
                        {product?.color?.map((clr, index) => (
                          <span
                            key={index}
                            className="h-5 w-5 rounded-full border border-gray-300 cursor-pointer"
                            style={{ backgroundColor: clr }}
                            title={clr}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-3">
                      {/* Add to Cart (no action) */}
                      <button
                        type="button"
                        className="flex-1 rounded-md border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                      >
                        Add to Cart
                      </button>

                      {/* Buy Now */}
                      <Link
                        href={`/collections/product/${product?._id}`}
                        className="flex-1 rounded-md bg-blue-600 py-2 text-center text-sm font-medium text-white hover:bg-blue-700 transition"
                      >
                        Buy Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="w-full text-center">
          <button
            type="button"
            className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100"
          >
            Show more
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
