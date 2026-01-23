"use client";

import React, { useState } from "react";

const SectionOne = ({
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
  tags,
  setTags,
  isFeatured,
  setIsFeatured,
  isPublished,
  setIsPublished,
}) => {
  const [tagInput, setTagInput] = useState("");

  const addTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <section className="space-y-6">
      {/* Name */}
      <div className="relative">
        <label className="absolute -top-3 left-3 bg-gray-100 px-1 text-sm text-gray-600">
          Product Name *
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Enter product name"
        />
      </div>

      {/* Description */}
      <div className="relative">
        <label className="absolute -top-3 left-3 bg-gray-100 px-1 text-sm text-gray-600">
          Description *
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded-xl p-3 h-28 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Enter product description"
        />
      </div>

      {/* Pricing & Stock */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          ["Original Price *", originalPrice, setOriginalPrice],
          ["Price *", price, setPrice],
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
              className="w-full border rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder={label}
            />
          </div>
        ))}
      </div>

      {/* Size & Color */}
      <div className="grid md:grid-cols-2 gap-4">
        {[
          ["Size", size, setSize],
          ["Color", color, setColor],
        ].map(([label, value, setter]) => (
          <div key={label} className="relative">
            <label className="absolute -top-3 left-3 bg-gray-100 px-1 text-sm text-gray-600">
              {label}
            </label>
            <input
              value={value}
              onChange={(e) => setter(e.target.value)}
              className="w-full border rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder={label}
            />
          </div>
        ))}
      </div>

      {/* Material & Brand */}
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
              className="w-full border rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder={label}
            />
          </div>
        ))}
      </div>

      {/* Gender & Category */}
      <div className="grid md:grid-cols-2 gap-4">
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
          className="w-full border rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Enter weight"
        />
      </div>

      {/* Tags */}
      <div className="relative">
        <label className="absolute -top-3 left-3 bg-gray-100 px-1 text-sm text-gray-600">
          Tags (press Enter)
        </label>
        <input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={addTag}
          className="w-full border rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Add a tag"
        />
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1 text-sm rounded-full bg-indigo-50 text-indigo-700 cursor-pointer"
              onClick={() => removeTag(tag)}
              title="Click to remove"
            >
              {tag} ×
            </span>
          ))}
        </div>
      )}

      {/* Flags */}
      <div className="flex gap-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="accent-indigo-600"
          />
          Featured
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="accent-indigo-600"
          />
          Published
        </label>
      </div>
    </section>
  );
};

export default SectionOne;
