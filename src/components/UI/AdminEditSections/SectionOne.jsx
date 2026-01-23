"use client";

import { useRef, useState } from "react";
import { FaTimes, FaUpload } from "react-icons/fa";

const SectionOne = ({
  images = [], // Array of { url, altText, file }
  setImages,
  activeIndex,
  setActiveIndex,
  tags = "", // CSV string
  setTags, // setter from parent
}) => {
  const fileInputRef = useRef(null);
  const [tagInput, setTagInput] = useState("");
  console.log(images, "single page admin product");
  /* ---------------- TAG HELPERS (CSV MODE) ---------------- */
  const tagList = tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const addTag = (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    const value = tagInput.trim();
    if (!value || tagList.includes(value)) return;

    setTags([...tagList, value].join(", "));
    setTagInput("");
  };

  const removeTag = (index) => {
    const updated = tagList.filter((_, i) => i !== index).join(", ");
    setTags(updated);
  };

  /* ---------------- IMAGE HANDLER ---------------- */
  const handleImageUpload = (file) => {
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    const updated = [...images];
    updated[activeIndex] = {
      url: previewUrl,
      altText: "Product Image",
      file,
    };

    setImages(updated);
  };

  const activeImage = images[activeIndex];

  return (
    <section className="lg:col-span-1 bg-white border rounded-xl p-4 space-y-5">
      <h3 className="font-semibold text-lg">Product Images</h3>

      {/* ---------------- TAG INPUT ---------------- */}
      <div className="relative">
        <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600">
          Tags (press Enter)
        </label>
        <input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={addTag}
          placeholder="e.g. Polo"
          className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      {/* ---------------- TAG PREVIEW ---------------- */}
      {tagList.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tagList.map((tag, i) => (
            <span
              key={i}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm shadow-sm"
            >
              {tag}
              <FaTimes
                className="cursor-pointer text-xs hover:text-red-500"
                onClick={() => removeTag(i)}
              />
            </span>
          ))}
        </div>
      )}

      {/* ---------------- MAIN IMAGE ---------------- */}
      <div className="relative h-64 rounded-2xl bg-gray-200/50 p-3 overflow-hidden flex items-center justify-center">
        {activeImage?.url ? (
          <img
            src={activeImage.url}
            alt={activeImage.altText || "Product"}
            className="max-h-full max-w-full object-contain rounded-xl"
          />
        ) : (
          <span className="text-gray-500">No Image</span>
        )}

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/10 opacity-0 hover:opacity-100 transition flex flex-col items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="bg-white px-4 py-2 rounded-lg shadow hover:scale-105 transition"
          >
            Replace
          </button>

          {activeImage && (
            <button
              type="button"
              onClick={() => {
                const updated = images.filter((_, i) => i !== activeIndex);
                setImages(updated);
                setActiveIndex(0);
              }}
              className="bg-white text-red-500 px-4 py-2 rounded-lg shadow hover:scale-105 transition"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {/* ---------------- THUMBNAILS ---------------- */}
      <div className="flex gap-3">
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActiveIndex(i)}
            className={`w-16 h-16 border rounded-lg overflow-hidden ${
              activeIndex === i ? "ring-2 ring-indigo-500" : "opacity-70"
            }`}
          >
            <img
              src={img.url}
              alt={img.altText || `Preview ${i}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* ---------------- ADD IMAGE ---------------- */}
      <button
        type="button"
        disabled={images.length >= 6} // max 6
        onClick={() => {
          if (images.length < 6) {
            setImages([...images, { url: "", altText: "Product Image" }]);
            setActiveIndex(images.length);
          }
        }}
        className={`flex items-center gap-2 text-sm ${
          images.length >= 6
            ? "text-gray-400 cursor-not-allowed"
            : "text-indigo-600 hover:underline"
        }`}
      >
        <FaUpload />
        Add Another Image
      </button>

      <input
        ref={fileInputRef}
        type="file"
        name="images"
        hidden
        accept="image/*"
        onChange={(e) => handleImageUpload(e.target.files?.[0])}
      />
    </section>
  );
};

export default SectionOne;
