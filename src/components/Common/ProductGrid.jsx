"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const ProductGrid = ({ products }) => {
  const safeProducts = Array.isArray(products)
    ? products
    : Array.isArray(products?.products)
      ? products.products
      : [];
  const TAG_COLORS = [
    "text-orange-700 bg-orange-500/20 border-orange-200",
    "text-blue-700 bg-blue-500/20 border-blue-200",
    "text-emerald-700 bg-emerald-500/20 border-emerald-200",
    "text-violet-700 bg-violet-500/20 border-violet-200",
    "text-red-700 bg-red-500/20 border-red-200",
  ];
  const searchParams = useSearchParams();
  const category = searchParams.get("category")
    ? searchParams.get("category").split(",").join(", ")
    : "All";

  return (
    <section className="border-t border-l border-[#f1f1f1] rounded-ss-2xl py-8 antialiased p-12">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mb-6">
          {/* Top bar */}
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
              {category}
            </h2>
          </div>
        </div>
        {products?.length === 0 ? (
          <p className="mt-8 text-left text-gray-500">No products found.</p>
        ) : (
          <div className="mb-4 grid gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-4">
            {/* 1number */}

            {products.map((product, index) => (
              <div
                key={product._id}
                className="rounded-lg border border-gray-200 bg-gray-100/40 p-6 shadow-sm"
              >
                <div className="h-56 w-full">
                  <Link href={`/collections/product/${product?._id}`}>
                    <img
                      className="mx-auto w-full object-cover h-full rounded-xl"
                      src={
                        product?.images?.length
                          ? product.images[
                              Math.floor(Math.random() * product.images.length)
                            ].url
                          : "/placeholder.png"
                      }
                      alt={
                        product?.images?.length
                          ? product.images[
                              Math.floor(Math.random() * product.images.length)
                            ].altText
                          : "No image"
                      }
                    />
                  </Link>
                </div>

                <div className="pt-6">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <span className="me-2 rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800">
                      {" "}
                      Up to 35% off{" "}
                    </span>

                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        data-tooltip-target="tooltip-quick-look"
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                      >
                        <span className="sr-only"> Quick look </span>
                        <svg
                          className="h-5 w-5"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            stroke-width="2"
                            d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
                          />
                          <path
                            stroke="currentColor"
                            stroke-width="2"
                            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                          />
                        </svg>
                      </button>
                      <div
                        id="tooltip-quick-look"
                        role="tooltip"
                        className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300"
                        data-popper-placement="top"
                      >
                        Quick look
                        <div
                          className="tooltip-arrow"
                          data-popper-arrow=""
                        ></div>
                      </div>

                      <button
                        type="button"
                        data-tooltip-target="tooltip-add-to-favorites"
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                      >
                        <span className="sr-only"> Add to Favorites </span>
                        <svg
                          className="h-5 w-5"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 6C6.5 1 1 8 5.8 13l6.2 7 6.2-7C23 8 17.5 1 12 6Z"
                          />
                        </svg>
                      </button>
                      <div
                        id="tooltip-add-to-favorites"
                        role="tooltip"
                        className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300"
                        data-popper-placement="top"
                      >
                        Add to favorites
                        <div
                          className="tooltip-arrow"
                          data-popper-arrow=""
                        ></div>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/collections/product/${product?._id}`}
                    className="text-lg font-semibold leading-tight text-gray-900 hover:underline"
                  >
                    {product?.name}
                  </Link>

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

                  <ul className="mt-2 flex items-center gap-4">
                    <li className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-gray-500"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
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
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-width="2"
                          d="M8 7V6c0-.6.4-1 1-1h11c.6 0 1 .4 1 1v7c0 .6-.4 1-1 1h-1M3 18v-7c0-.6.4-1 1-1h11c.6 0 1 .4 1 1v7c0 .6-.4 1-1 1H4a1 1 0 0 1-1-1Zm8-3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
                        />
                      </svg>
                      <p className="text-sm font-medium text-gray-500">
                        Best Price
                      </p>
                    </li>
                  </ul>

                  <div className="mt-4 flex items-center justify-between gap-4">
                    {/* Price */}
                    <div className="text-xl font-semibold leading-tight text-gray-900">
                      {product?.offerPrice ? (
                        <span className="flex flex-col">
                          <span className="line-through text-sm font-medium text-gray-400">
                            Rs.{product?.price}
                          </span>
                          <span className="text-[#ff4500]">
                            Rs.{product?.offerPrice}
                          </span>
                        </span>
                      ) : (
                        <span>Rs.{product?.price}</span>
                      )}
                    </div>

                    {/* Tags */}

                    <div className="flex flex-wrap gap-2 justify-end">
                      {product?.tags
                        ?.slice()
                        .sort(() => 0.5 - Math.random())
                        .slice(0, 2)
                        .map((tag, index) => (
                          <span
                            key={index}
                            className={`px-2.5 py-1 text-xs font-medium rounded-md ${TAG_COLORS[index % TAG_COLORS.length]}`}
                          >
                            {tag}
                          </span>
                        ))}
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
