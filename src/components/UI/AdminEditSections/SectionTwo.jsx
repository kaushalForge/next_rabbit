"use client";

import { FaSave } from "react-icons/fa";

const SectionTwo = ({
  // PRODUCT CORE
  name,
  setName,
  description,
  setDescription,
  originalPrice,
  setOriginalPrice,
  price,
  setPrice,
  stock,
  setStock,

  // ARRAYS / CSV FIELDS
  size,
  setSize,
  color,
  setColor,
  material,
  setMaterial,
  brand,
  setBrand,

  // SELECT / TEXT
  gender,
  setGender,
  category,
  setCategory,
  weight,
  setWeight,

  // SEO META
  metaTitle,
  setMetaTitle,
  metaDescription,
  setMetaDescription,
  metaKeywords,
  setMetaKeywords,

  // DIMENSIONS
  dimensions,
  setDimensions,

  // FLAGS
  isFeatured,
  setIsFeatured,
  isPublished,
  setIsPublished,
}) => {
  // Helper function to handle CSV input
  const handleCsvChange = (label, value, setter) => {
    let parts = value
      .split(",")
      .map((v) => {
        v = v.trim();
        if (label === "Size" || label === "Color") return v.toUpperCase();
        return v;
      })
      .filter(Boolean);

    let formatted = parts.join(", ");
    if (value[value.length - 1] === ",") formatted += ", ";
    setter(formatted);
  };

  return (
    <section className="lg:col-span-2 space-y-6">
      {/* ---------------- PRODUCT NAME ---------------- */}
      <div className="relative">
        <label className="absolute -top-3 left-3 bg-gray-100 px-1 text-sm text-gray-600">
          Product Name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded-xl p-3"
        />
      </div>

      {/* ---------------- DESCRIPTION ---------------- */}
      <div className="relative">
        <label className="absolute -top-3 left-3 bg-gray-100 px-1 text-sm text-gray-600">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded-xl p-3 h-32"
        />
      </div>

      {/* ---------------- PRICING & STOCK ---------------- */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          ["Original Price", originalPrice, setOriginalPrice],
          ["Price", price, setPrice],
          ["Stock", stock, setStock],
        ].map(([label, value, setter]) => (
          <div key={label} className="relative">
            <label className="absolute -top-3 left-3 bg-gray-100 px-1 text-sm text-gray-600">
              {label}
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setter(e.target.value)}
              className="w-full border rounded-xl p-3"
            />
          </div>
        ))}
      </div>

      {/* ---------------- SIZE, COLOR, META KEYWORDS ---------------- */}
      <div className="grid md:grid-cols-2 gap-4">
        {[
          ["Size", size, setSize],
          ["Color", color, setColor],
          ["Meta Keywords", metaKeywords, setMetaKeywords],
        ].map(([label, value, setter]) => (
          <div key={label} className="relative">
            <label className="absolute -top-3 left-3 bg-gray-100 px-1 text-sm text-gray-600">
              {label}
            </label>
            <input
              value={value}
              onChange={(e) => handleCsvChange(label, e.target.value, setter)}
              className="w-full border rounded-xl p-3"
              placeholder={
                label === "Color"
                  ? "RED, ORANGE, BLUE"
                  : label === "Meta Keywords"
                  ? "Keywords"
                  : ""
              }
            />
          </div>
        ))}
      </div>

      {/* ---------------- MATERIAL, BRAND ---------------- */}
      <div className="grid md:grid-cols-2 gap-4">
        {[
          ["Material", material, setMaterial],
          ["Brand", brand, setBrand],
        ].map(([label, value, setter]) => (
          <div key={label} className="relative">
            <label className="absolute -top-3 left-3 bg-gray-100 px-1 text-sm text-gray-600">
              {label}
            </label>
            <input
              value={value}
              onChange={(e) => setter(e.target.value)}
              className="w-full border rounded-xl p-3"
            />
          </div>
        ))}
      </div>

      {/* ---------------- GENDER, CATEGORY ---------------- */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* GENDER SELECT */}
        <div className="relative">
          <label className="absolute -top-3 left-3 bg-gray-100 px-1 text-sm text-gray-600">
            Gender
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>

        {/* CATEGORY INPUT */}
        <div className="relative">
          <label className="absolute -top-3 left-3 bg-gray-100 px-1 text-sm text-gray-600">
            Category
          </label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="e.g. T-Shirts, Shoes"
          />
        </div>
      </div>

      {/* ---------------- WEIGHT ---------------- */}
      <div className="relative">
        <label className="absolute -top-3 left-3 bg-gray-100 px-1 text-sm text-gray-600">
          Weight
        </label>
        <input
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-full border rounded-xl p-3"
        />
      </div>

      {/* ---------------- DIMENSIONS ---------------- */}
      <div className="grid md:grid-cols-3 gap-4">
        {["length", "width", "height"].map((dim) => (
          <div key={dim} className="relative">
            <label className="absolute -top-3 left-3 bg-gray-100 px-1 text-sm text-gray-600">
              {dim.toUpperCase()}
            </label>
            <input
              type="number"
              value={dimensions[dim]}
              onChange={(e) =>
                setDimensions({ ...dimensions, [dim]: e.target.value })
              }
              className="w-full border rounded-xl p-3"
            />
          </div>
        ))}
      </div>

      {/* ---------------- META TITLE & DESCRIPTION ---------------- */}
      <div className="relative">
        <label className="absolute -top-3 left-3 bg-gray-100 px-1 text-sm text-gray-600">
          Meta Title
        </label>
        <input
          value={metaTitle}
          onChange={(e) => setMetaTitle(e.target.value)}
          className="w-full border rounded-xl p-3"
        />
      </div>

      <div className="relative">
        <label className="absolute -top-3 left-3 bg-gray-100 px-1 text-sm text-gray-600">
          Meta Description
        </label>
        <textarea
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
          className="w-full border rounded-xl p-3 h-24"
        />
      </div>

      {/* ---------------- FLAGS ---------------- */}
      <div className="flex gap-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
          />
          Featured
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
          Published
        </label>
      </div>

      {/* ---------------- SUBMIT BUTTON ---------------- */}
      <button
        type="submit"
        className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white py-4 rounded-xl font-semibold"
      >
        <FaSave />
        Update Product
      </button>
    </section>
  );
};

export default SectionTwo;
