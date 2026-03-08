"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { HiArrowRight } from "react-icons/hi2";
import { HiOutlineShoppingBag } from "react-icons/hi2";

const ProductCard = ({ product, index }) => {
  const [loaded, setLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const imageUrl = product?.images?.[0]?.url;
  const imageAlt = product?.images?.[0]?.altText || product?.name || "Product";
  const isFashion = product?.mainCategory === "Fashion";
  const price = isFashion
    ? product?.fashion?.[0]?.price
    : product?.food?.[0]?.price;
  const offer = isFashion
    ? product?.fashion?.[0]?.offerPrice
    : product?.food?.[0]?.offerPrice;
  const discount =
    price && offer ? Math.round(((price - offer) / price) * 100) : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group flex flex-col"
    >
      {/* ── Image ── */}
      <Link href={`/collections/product/${product?._id}`} className="block">
        <div className="relative w-full aspect-2/3 bg-gray-100 overflow-hidden rounded-2xl">
          {/* Shimmer */}
          {!loaded && (
            <div
              className="absolute inset-0 z-10"
              style={{
                background:
                  "linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)",
                backgroundSize: "200% 100%",
                animation: "pgShimmer 1.3s infinite linear",
              }}
            />
          )}

          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            unoptimized
            loading="lazy"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            quality={85}
            onLoad={() => setLoaded(true)}
            className={`
              object-cover object-top rounded-2xl
              transition-transform duration-700 ease-in-out
              ${loaded ? "opacity-100" : "opacity-0"}
              ${hovered ? "scale-[1.06]" : "scale-100"}
            `}
          />

          {/* Hover overlay */}
          <div
            className={`absolute inset-0 bg-black rounded-2xl transition-opacity duration-300 ${hovered ? "opacity-10" : "opacity-0"}`}
          />

          {/* Discount badge */}
          {discount && (
            <div className="absolute top-2.5 left-2.5 z-20">
              <span className="bg-black text-white text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full">
                -{discount}%
              </span>
            </div>
          )}

          {/* Rating badge */}
          {product?.rating > 0 && (
            <div className="absolute top-2.5 right-2.5 z-20">
              <span className="flex items-center gap-0.5 bg-white/90 backdrop-blur-sm text-gray-800 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                <svg
                  className="w-2.5 h-2.5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {product.rating.toFixed(1)}
              </span>
            </div>
          )}

          {/* Quick view on hover — desktop only */}
          <div
            className={`
            hidden md:flex absolute bottom-0 left-0 right-0 px-3 pb-3 z-20
            transition-all duration-300
            ${hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
          `}
          >
            <div className="w-full text-center bg-white/90 backdrop-blur-md text-gray-900 text-[11px] font-bold tracking-widest uppercase py-2.5 rounded-xl shadow">
              Quick View
            </div>
          </div>
        </div>
      </Link>

      {/* ── Info ── */}
      <div className="pt-2.5 px-0.5">
        {/* Name */}
        <Link href={`/collections/product/${product?._id}`}>
          <h3 className="text-[12px] md:text-[13px] font-semibold text-gray-900 truncate leading-snug hover:underline underline-offset-2 mb-1.5">
            {product?.name}
          </h3>
        </Link>

        {/* Price + swatches row */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="text-[12px] md:text-sm font-bold text-gray-900">
            {offer ? (
              <span className="flex items-center gap-1">
                <span className="text-[10px] text-gray-400 line-through font-normal">
                  Rs.{price}
                </span>
                <span>Rs.{offer}</span>
              </span>
            ) : (
              <span>Rs.{price ?? "—"}</span>
            )}
          </div>

          {product?.color?.length > 0 && (
            <div className="flex items-center gap-0.5">
              {product.color.slice(0, 3).map((clr, i) => (
                <span
                  key={i}
                  className="h-3 w-3 rounded-full border border-gray-200"
                  style={{ backgroundColor: clr }}
                  title={clr}
                />
              ))}
              {product.color.length > 3 && (
                <span className="text-[9px] text-gray-400 ml-0.5">
                  +{product.color.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Buy Now button ── */}
        <Link
          href={`/collections/product/${product?._id}`}
          className="group/btn flex items-center justify-between w-full
            bg-gray-900 hover:bg-gray-700
            text-white rounded-xl
            px-3 py-2.5
            transition-all duration-200"
        >
          <span className="flex items-center gap-1.5 text-[11px] md:text-xs font-bold tracking-wide">
            <HiOutlineShoppingBag className="w-3.5 h-3.5 shrink-0" />
            Buy Now
          </span>
          <HiArrowRight className="w-3.5 h-3.5 shrink-0 opacity-60 group-hover/btn:translate-x-0.5 group-hover/btn:opacity-100 transition-all duration-200" />
        </Link>
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────
   ProductGrid
───────────────────────────────────────── */
const ProductGrid = ({ products = [] }) => {
  if (!Array.isArray(products) || products.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes pgShimmer {
          0%   { background-position: -200% 0 }
          100% { background-position:  200% 0 }
        }
      `}</style>

      <section className="w-full">
        <div className="mx-auto max-w-7xl px-3 sm:px-4">
          {/*
            Mobile  : 2 cols, gap-4 (increased from gap-2)
            Tablet  : 3 cols, gap-4
            Desktop : 4 cols, gap-5
            XL      : 5 cols, gap-5
          */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5 xl:grid-cols-5 mb-10">
            {products.map((product, index) => (
              <ProductCard
                key={product?._id || index}
                product={product}
                index={index}
              />
            ))}
          </div>

          {/* Show More */}
          <div className="w-full text-center pb-10">
            <button
              type="button"
              className="group inline-flex items-center gap-2 px-8 py-2.5 rounded-full border border-gray-900 text-sm font-semibold text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-200"
            >
              Show More
              <HiArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductGrid;
