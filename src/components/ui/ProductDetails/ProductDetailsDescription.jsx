"use client";

import React from "react";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Info, Globe, Weight, Tag, Sparkles, PackageCheck } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" },
  }),
};

const ProductDetailsDescription = ({ productDetail }) => {
  if (!productDetail) return null;

  const {
    description,
    countryOfOrigin,
    weight,
    bulletDescription = [],
    bulletKeyValueDescription = [],
    mainCategory,
    category,
    fashion = {},
  } = productDetail;

  const material = fashion?.material || [];

  return (
    <section className="mt-12 space-y-6">
      <Separator />

      {/* ================= CATEGORY BADGE ================= */}
      {mainCategory && (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="flex items-center gap-3"
        >
          <Tag className="w-5 h-5 text-[#ff4500]" />
          <span className="px-4 py-1.5 rounded-full bg-[#ff4500]/20 text-[#ff4500] text-sm font-medium">
            {mainCategory + " > " + category}
          </span>
        </motion.div>
      )}

      {/* ================= DESCRIPTION ================= */}
      {description && (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          className="bg-linear-to-br from-indigo-50 to-white border border-[#eaeaea] rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-[#ff4500]" />
            <h2 className="text-xl font-semibold text-gray-800">
              Product Description
            </h2>
          </div>

          <p className="text-gray-600 leading-relaxed text-[15px] whitespace-pre-line">
            {description}
          </p>
        </motion.div>
      )}

      {/* ================= MATERIAL (Fashion Only) ================= */}
      {material.length > 0 && (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          className="space-y-4"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <h2 className="text-xl font-semibold text-gray-800">Material</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {material.map((mat, i) => (
              <motion.span
                key={i}
                whileHover={{ scale: 1.05 }}
                className="px-4 py-1.5 text-sm rounded-full bg-gray-100 hover:bg-indigo-100 transition-colors duration-300 cursor-default"
              >
                {mat}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}

      {/* ================= COUNTRY & WEIGHT ================= */}
      {(countryOfOrigin || weight) && (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={3}
          className="bg-white border border-[#eaeaea] rounded-2xl p-6 shadow-sm space-y-4"
        >
          <div className="flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-[#ff4500]" />
            <h2 className="text-xl font-semibold text-gray-800">
              Product Information
            </h2>
          </div>

          <div className="space-y-3 text-gray-600 text-sm">
            {countryOfOrigin && (
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#ff4500]" />
                <span>
                  <span className="font-medium text-gray-800">
                    Country of Origin:
                  </span>{" "}
                  {countryOfOrigin}
                </span>
              </div>
            )}

            {weight && (
              <div className="flex items-center gap-2">
                <Weight className="w-4 h-4 text-[#ff4500]" />
                <span>
                  <span className="font-medium text-gray-800">Weight:</span>{" "}
                  {weight}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ================= BULLET HIGHLIGHTS ================= */}
      {bulletDescription.length > 0 && (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={4}
          className="space-y-4"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#ff4500]" />
            <h2 className="text-xl font-semibold text-gray-800">Highlights</h2>
          </div>

          <ul className="space-y-2">
            {bulletDescription.map((item, i) => (
              <motion.li
                key={i}
                whileHover={{ x: 4 }}
                className="flex cursor-pointer items-start gap-2 text-gray-600 text-sm"
              >
                <span className="mt-1 w-2 h-2 bg-[#000000] rounded-full"></span>
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* ================= SPECIFICATIONS ================= */}
      {bulletKeyValueDescription.length > 0 && (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={5}
          className="space-y-4"
        >
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-[#ff4500]" />
            <h2 className="text-xl font-semibold text-gray-800">
              Specifications
            </h2>
          </div>

          <div className="border border-[#eaeaea] rounded-2xl overflow-hidden shadow-sm">
            {bulletKeyValueDescription.map((item, i) => (
              <div
                key={i}
                className="flex justify-between px-6 py-3 text-sm border-[#eaeaea] border-b last:border-b-0 hover:bg-gray-100"
              >
                <span className="font-medium text-gray-700">{item.key}</span>
                <span className="text-gray-600">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default ProductDetailsDescription;
