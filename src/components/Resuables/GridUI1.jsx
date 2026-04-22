"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { color, motion } from "framer-motion";

/* ─────────────────────────────────────────
   Each card is its own component so
   useState is called at the top level
───────────────────────────────────────── */
const ProductCard = ({ product, idx }) => {
  const [loaded, setLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const imageUrl = product?.images?.[0]?.url;
  const imageAlt = product?.images?.[0]?.altText || product?.name || "Product";

  // price lives directly on product (your API shape)
  const price = product?.price;
  const offerPrice = product?.offerPrice;
  const colors = product?.color || [];

  // Card animation variants
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        delay: idx * 0.05,
        ease: [0.25, 0.1, 0.25, 1], // Custom easing for smoother motion
      },
    },
    hover: {
      y: -4,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 20,
        mass: 1,
      },
    },
  };

  // Image zoom variant
  const imageVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.1, transition: { duration: 0.4, ease: "easeOut" } },
  };

  // Badge animation
  const badgeVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { delay: idx * 0.05 + 0.1, duration: 0.3 },
    },
  };

  // Price animation
  const priceVariants = {
    rest: { scale: 1 },
    hover: {
      scale: 1.05,
      x: 100,
      transition: {
        duration: 0.2,
        type: "spring",
        damping: 20,
        stiffness: 200,
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group h-auto w-auto flex flex-col rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
    >
      <Link
        href={`/collections/product/${product?._id}`}
        scroll={true}
        className="h-full w-full"
      >
        <div className="relative w-full h-32 md:h-52 aspect-3/2 md:aspect-4/3 bg-linear-to-br from-gray-50 to-gray-100 overflow-hidden">
          <motion.div
            variants={imageVariants}
            initial="rest"
            animate={isHovered ? "hover" : "rest"}
            className="w-full h-full"
          >
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              priority={idx < 4}
              onLoad={() => setLoaded(true)}
              className={`object-cover object-top transition-all duration-700 ${
                loaded ? "opacity-100" : "opacity-0"
              }`}
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </motion.div>

          {/* Skeleton loader */}
          {!loaded && (
            <motion.div
              className="absolute inset-0 bg-linear-to-r from-gray-100 via-gray-200 to-gray-100"
              animate={{ x: ["0%", "100%", "0%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          )}

          {/* Star Rating Badge */}
          {product?.rating > 0 && (
            <motion.span
              variants={badgeVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.5 }}
              className="absolute top-3 left-2 z-20 inline-flex items-center gap-1 bg-black/80 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-lg border border-white/20"
            >
              <svg
                className="w-3 h-3 text-yellow-400 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {product.rating.toFixed(1)}
            </motion.span>
          )}

          {/* New Arrival Badge */}
          {product?.isNewArrival && (
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 + 0.15 }}
              className="absolute top-3 right-2 z-20 bg-linear-to-r from-purple-600 to-pink-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg"
            >
              NEW
            </motion.span>
          )}

          {/* Hover overlay with quick view */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: isHovered ? 1 : 0.8,
                opacity: isHovered ? 1 : 0,
              }}
              transition={{ duration: 0.2, delay: 0.05 }}
              className="inline-block bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-semibold shadow-xl 
hover:bg-gray-900 hover:text-white 
transition-colors duration-300 ease-in-out"
            >
              <motion.div>Quick View →</motion.div>
            </motion.div>
          </motion.div>
        </div>
      </Link>

      <motion.div
        className="px-4 py-1 mt-1 flex flex-col gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: idx * 0.05 + 0.2 }}
      >
        <Link href={`/collections/product/${product?._id}`}>
          <motion.h3
            className="text-sm font-semibold text-gray-900 truncate hover:text-gray-600 transition-colors duration-200"
            whileHover={{ x: 3 }}
          >
            {product?.name}
          </motion.h3>
        </Link>

        {/* price */}
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2"
            variants={priceVariants}
            animate={isHovered ? "hover" : "rest"}
          >
            {offerPrice ? (
              <>
                <motion.span
                  className="text-base font-bold"
                  initial={{ color: "#000000" }}
                  animate={{ color: isHovered ? "#FF4500" : "#00b400" }}
                  transition={{ duration: 0.2 }}
                >
                  Rs.{offerPrice}
                </motion.span>
                <span className="text-xs text-gray-400 line-through">
                  Rs.{price}
                </span>
              </>
            ) : (
              <span className="text-base font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Rs.{price ?? "—"}
              </span>
            )}
          </motion.div>

          {/* colors */}
          {colors.length > 0 && (
            <motion.div
              className="flex items-center gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.05 + 0.25 }}
            >
              {colors.slice(0, 4).map((clr, i) => (
                <motion.span
                  key={i}
                  title={clr}
                  whileHover={{ scale: 1.2, y: -2 }}
                  className="h-4 w-4 rounded-full border border-gray-200 shadow-sm cursor-pointer"
                  style={{ backgroundColor: clr }}
                />
              ))}
              {colors.length > 4 && (
                <span className="text-[10px] text-gray-400 font-medium">
                  +{colors.length - 4}
                </span>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const GridUI1 = ({ products }) => {
  const productList = Array.isArray(products) ? products : [];

  if (productList.length === 0) return null;

  // Container animation for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mx-auto h-full w-full container px-2 py-4 md:px-4 md:py-10"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid h-full w-full gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {productList.map((product, idx) => (
          <ProductCard key={product?._id || idx} product={product} idx={idx} />
        ))}
      </motion.div>
    </motion.section>
  );
};

export default GridUI1;
