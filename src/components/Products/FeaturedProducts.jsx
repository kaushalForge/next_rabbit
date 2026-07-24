"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ---------------- PRODUCT CARD ---------------- */
const ProductCard = ({ product, index }) => {
  const [loaded, setLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const imageUrl = product?.images?.[0]?.url;
  const imageAlt = product?.images?.[0]?.altText || product?.name || "Product";

  const price = product?.fashion?.[0]?.price;
  const offerPrice = product?.fashion?.[0]?.offerPrice;

  useEffect(() => {
    if (loaded && product?.images?.[1]?.url) {
      const nextImage = new window.Image();
      nextImage.src = product.images[1].url;
    }
  }, [loaded, product]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
    >
      <Link
        href={`/collections/product/${product?.slug || product?._id}`}
        scroll={true}
        className="group block"
      >
        <div
          className="relative aspect-7/8 w-full overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Skeleton */}
          {!loaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}

          {/* Image */}
          <motion.div
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.4 }}
            className="relative w-full h-full"
          >
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              quality={85}
              loading={index < 4 ? "eager" : "lazy"}
              priority={index < 2}
              onLoad={() => setLoaded(true)}
              className={`object-cover transition-all duration-700 ${
                loaded ? "opacity-100" : "opacity-0 scale-105"
              }`}
            />
          </motion.div>

          {/* Overlay */}
          <div
            className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-200 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="bg-white px-4 py-2 rounded-full text-sm font-medium">
              Quick View
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="mt-3 space-y-1">
          <h3 className="text-sm truncate font-medium">{product?.name}</h3>

          <div className="flex gap-2 flex-wrap">
            {offerPrice ? (
              <>
                <span className="font-semibold text-gray-900">
                  Rs.{offerPrice.toLocaleString()}
                </span>
                <span className="line-through text-gray-400 text-sm">
                  Rs.{price.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="font-semibold text-gray-900">
                Rs.{price?.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

/* ---------------- MAIN COMPONENT ---------------- */
export default function FeaturedProducts({ products = [] }) {
  useEffect(() => {
    gsap.to(".featuredProducts", {
      ease: "elaseIn",
      scrollTrigger: {
        trigger: ".featuredProducts",
        start: "top top",
        end: "+=800",
        // markers: true,
        scrub: 0.6,
        // pin: true,
      },
    });
  }, []);

  if (!products.length) return null;

  return (
    <section className="featuredProducts mx-auto container px-4 py-10 lg:py-16">
      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-xs tracking-[0.3em] text-gray-400 uppercase">
          Hand Picked
        </p>
        <h2 className="text-3xl md:text-5xl font-bold">Featured Products</h2>
        <p className="text-gray-500 mt-2 max-w-xl mx-auto">
          Curated pieces chosen for quality, style, and value.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 xl:grid-cols-4">
        {products.map((product, idx) => (
          <ProductCard key={product?._id} product={product} index={idx} />
        ))}
      </div>
    </section>
  );
}
