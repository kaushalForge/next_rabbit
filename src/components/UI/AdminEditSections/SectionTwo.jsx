"use client";

import { FaSave } from "react-icons/fa";

const SectionTwo = ({
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
  size,
  setSize,
  color,
  setColor,

  material,
  setMaterial,
  brand,
  setBrand,
  gender,
  setGender,
  category,
  setCategory,
  weight,
  setWeight,

  metaTitle,
  setMetaTitle,
  metaDescription,
  setMetaDescription,
  metaKeywords,
  setMetaKeywords,
  dimensions,
  setDimensions,
  isFeatured,
  setIsFeatured,
  isPublished,
  setIsPublished,
}) => {
  // Convert array to comma-separated string for input
  const metaKeywordsString = metaKeywords.join(", ");

  // Handler to convert input string to array
  const handleMetaKeywordsChange = (e) => {
    const value = e.target.value;
    const keywordsArray = value
      .split(",") // Split by comma
      .map((kw) => kw.trim()) // Trim whitespace
      .filter((kw) => kw); // Remove empty strings
    setMetaKeywords(keywordsArray);
  };

  return (
    <section className="lg:col-span-2 space-y-6">
      {/* Product Name */}
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

      {/* Description */}
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

      {/* Pricing & Stock */}
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

      {/* Size & Color */}
      <div className="grid md:grid-cols-2 gap-4">
        {[
          ["Size", size, setSize],
          ["Color", color, setColor],
        ].map(([label, value, setter]) => {
          const handleChange = (e) => {
            let input = e.target.value;
            let parts = input.split(",").map((v) => v.trim().toUpperCase());
            let formatted = parts.join(", ");
            setter(formatted);
          };

          return (
            <div key={label} className="relative">
              <label className="absolute -top-3 left-3 bg-gray-100 px-1 text-sm text-gray-600">
                {label}
              </label>
              <input
                value={value}
                onChange={handleChange} // ✅ works perfectly
                className="w-full border rounded-xl p-3"
                placeholder={label === "Color" ? "RED, ORANGE, BLUE" : ""}
              />
            </div>
          );
        })}
      </div>

      {/* Material, Brand */}
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

      {/* Gender, Category */}
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

      {/* Weight */}
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

      {/* Dimensions */}
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

      {/* SEO */}
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

      <div className="relative">
        <label className="absolute -top-3 left-3 bg-gray-100 px-1 text-sm text-gray-600">
          Meta Keywords
        </label>
        <input
          value={metaKeywordsString}
          onChange={handleMetaKeywordsChange}
          className="w-full border rounded-xl p-3"
          placeholder="e.g. cotton, summer, men"
        />
      </div>

      {/* Flags */}
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

      {/* Submit */}
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
