"use client";

import { FaSave } from "react-icons/fa";
import EditDescriptions from "../AdminNewProductSection/HelpersUI/EditDescriptions";

const SectionTwo = ({
  // PRODUCT CORE
  name,
  setName,
  brand,
  setBrand,
  price,
  setPrice,
  offerPrice,
  setOfferPrice,
  stock,
  setStock,

  // ARRAYS / CSV FIELDS
  size,
  setSize,
  color,
  setColor,
  material,
  setMaterial,

  // SELECT / TEXT
  gender,
  setGender,
  category,
  setCategory,
  weight,
  setWeight,
  mainCategory,
  setMainCategory,
  rating,
  setRating,
  countryOfOrigin,
  setCountryOfOrigin,

  // DESCRIPTIONS
  description,
  setDescription,
  bulletDescription,
  setBulletDescription,
  bulletKeyValueDescription,
  setBulletKeyValueDescription,

  // SEO META
  metaTitle,
  setMetaTitle,
  metaDescription,
  setMetaDescription,

  // DIMENSIONS
  dimensions,
  setDimensions,

  // FLAGS
  isFeatured,
  setIsFeatured,
  isPublished,
  setIsPublished,
}) => {
  const csvFormatter = (label, value) => {
    let parts = value
      .split(",")
      .map((v) => {
        v = v.trim();
        if (label === "Size" || label === "Color") return v.toUpperCase();
        return v;
      })
      .filter(Boolean);

    let formatted = parts.join(", ");
    if (value.endsWith(",")) formatted += ", ";
    return formatted;
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

      {/* ---------------- DESCRIPTIONS ---------------- */}
      <EditDescriptions
        description={description}
        setDescription={setDescription}
        bulletDescription={bulletDescription}
        setBulletDescription={setBulletDescription}
        bulletKeyValueDescription={bulletKeyValueDescription}
        setBulletKeyValueDescription={setBulletKeyValueDescription}
      />

      {/* ---------------- BRAND, OFFER PRICE, PRICE, STOCK ---------------- */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          ["Brand", brand, setBrand],
          ["Offer Price", offerPrice, setOfferPrice],
          ["Price", price, setPrice],
          ["Stock", stock, setStock],
        ].map(([label, value, setter]) => (
          <div key={label} className="relative">
            <label className="absolute -top-3 left-3 bg-gray-100 px-1 text-sm text-gray-600">
              {label}
            </label>
            <input
              type={label === "Stock" ? "number" : "text"}
              value={value}
              onChange={(e) => setter(e.target.value)}
              className="w-full border rounded-xl p-3"
            />
          </div>
        ))}
      </div>

      {/* ---------------- CSV FIELDS ---------------- */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          ["Size", size, setSize],
          ["Color", color, setColor],
          ["Material", material, setMaterial],
        ].map(([label, value, setter]) => (
          <div key={label} className="relative">
            <label className="absolute -top-3 left-3 bg-gray-100 px-1 text-sm text-gray-600">
              {label}
            </label>
            <input
              value={value}
              onChange={(e) => setter(csvFormatter(label, e.target.value))}
              className="w-full border rounded-xl p-3"
            />
          </div>
        ))}
      </div>

      {/* ---------------- GENDER, CATEGORY, MAIN CATEGORY, RATING, COUNTRY ---------------- */}
      <div className="grid md:grid-cols-5 gap-4">
        {/* Gender */}
        <div className="relative">
          <label className="absolute -top-3 left-3 bg-gray-100 px-1 text-sm text-gray-600">
            Gender
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full border rounded-xl p-3"
          >
            <option value="">Select gender</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
            <option value="Kids">Kids</option>
            <option value="Girls">Girls</option>
            <option value="Boys">Boys</option>
          </select>
        </div>

        {/* Category */}
        <div className="relative">
          <label className="absolute -top-3 left-3 bg-gray-100 px-1 text-sm text-gray-600">
            Category
          </label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded-xl p-3"
          />
        </div>

        {/* Main Category */}
        <div className="relative">
          <label className="absolute -top-3 left-3 bg-gray-100 px-1 text-sm text-gray-600">
            Main Category
          </label>
          <select
            value={mainCategory}
            onChange={(e) => setMainCategory(e.target.value)}
            className="w-full border rounded-xl p-3"
          >
            <option value="">Select</option>
            <option value="Fashion">Fashion</option>
            <option value="Food">Food</option>
          </select>
        </div>

        {/* Rating */}
        <div className="relative">
          <label className="absolute -top-3 left-3 bg-gray-100 px-1 text-sm text-gray-600">
            Rating
          </label>
          <input
            type="number"
            min={0}
            max={5}
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full border rounded-xl p-3"
          />
        </div>

        {/* Country of Origin */}
        <div className="relative">
          <label className="absolute -top-3 left-3 bg-gray-100 px-1 text-sm text-gray-600">
            Country of Origin
          </label>
          <input
            value={countryOfOrigin}
            onChange={(e) => setCountryOfOrigin(e.target.value)}
            className="w-full border rounded-xl p-3"
          />
        </div>
      </div>

      {/* ---------------- WEIGHT, DIMENSIONS ---------------- */}
      <div className="grid md:grid-cols-4 gap-4">
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

        {["length", "width", "height"].map((dim) => (
          <div key={dim} className="relative">
            <label className="absolute -top-3 left-3 bg-gray-100 px-1 text-sm text-gray-600">
              {dim.toUpperCase()}
            </label>
            <input
              value={dimensions[dim]}
              onChange={(e) =>
                setDimensions({ ...dimensions, [dim]: e.target.value })
              }
              className="w-full border rounded-xl p-3"
            />
          </div>
        ))}
      </div>

      {/* ---------------- META ---------------- */}
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
        <FaSave /> Update Product
      </button>
    </section>
  );
};

export default SectionTwo;
