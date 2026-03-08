"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";

/* ─────────────────────────────────────────
   Each card is its own component so
   useState is called at the top level
───────────────────────────────────────── */
const ProductCard = ({ product, idx }) => {
  const [loaded, setLoaded] = useState(false);

  const imageUrl = product?.images?.[0]?.url;
  const imageAlt = product?.images?.[0]?.altText || product?.name || "Product";

  // price lives directly on product (your API shape)
  const price = product?.price;
  const offerPrice = product?.offerPrice;
  const colors = product?.color || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: idx * 0.06 }}
      className="group h-auto w-auto flex flex-col rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <Link
        href={`/collections/product/${product?._id}`}
        className="h-full w-full"
      >
        <div className="relative w-full h-32 md:h-52 aspect-[3/2] md:aspect-[4/3] bg-gray-100 overflow-hidden">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            priority
            onLoad={() => setLoaded(true)}
            className={`object-cover object-top transition-transform duration-500 group-hover:scale-105 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          />
          {/* Star Rating Badge */}
          {product?.rating > 0 && (
            <span className="absolute top-3 left-2 z-20 inline-flex items-center gap-1 bg-black text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-md">
              <svg
                className="w-3 h-3 text-yellow-500 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {product.rating.toFixed(1)}
            </span>
          )}
        </div>
      </Link>

      <div className="px-4 py-1 mt-1 flex flex-col gap-1">
        <Link href={`/collections/product/${product?._id}`}>
          <h3 className="text-sm font-semibold text-gray-900 truncate hover:underline underline-offset-2">
            {product?.name}
          </h3>
        </Link>

        {/* price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {offerPrice ? (
              <>
                <span className="text-base font-bold text-gray-900">
                  Rs.{offerPrice}
                </span>
                <span className="text-xs text-gray-400 line-through">
                  Rs.{price}
                </span>
              </>
            ) : (
              <span className="text-base font-bold text-gray-900">
                Rs.{price ?? "—"}
              </span>
            )}
          </div>

          {/* colors */}
          {colors.length > 0 && (
            <div className="flex items-center gap-1">
              {colors.slice(0, 4).map((clr, i) => (
                <span
                  key={i}
                  title={clr}
                  className="h-4 w-4 rounded-full border border-gray-200 shadow-sm"
                  style={{ backgroundColor: clr }}
                />
              ))}
              {colors.length > 4 && (
                <span className="text-[10px] text-gray-400">
                  +{colors.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const GridUI1 = ({ products }) => {
  // Ensure products is always an array
  const productList = Array.isArray(products) ? products : [];

  // Return nothing if no products
  if (productList.length === 0) return null;

  return (
    <>
      <section className="mx-auto h-full w-full container px-2 py-4 md:px-4 md:py-10">
        <div className="grid h-full w-full gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {productList.map((product, idx) => (
            <ProductCard
              key={product?._id || idx}
              product={product}
              idx={idx}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default GridUI1;
