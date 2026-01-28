"use client";

import { useState } from "react";
import { FaUpload, FaSave, FaEdit, FaTimes } from "react-icons/fa";

const MAX_IMAGES = 6;

const SectionTwo = ({ images, setImages, fileInputRef }) => {
  const [replaceIndex, setReplaceIndex] = useState(null);

  // Handle file input change (MULTIPLE SUPPORT)
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setImages((prev) => {
      let updated = [...prev];

      // 🔁 REPLACE MODE → only first selected image replaces
      if (replaceIndex !== null) {
        updated[replaceIndex] = files[0];
      }
      // ➕ ADD MODE → add multiple until MAX_IMAGES
      else {
        for (const file of files) {
          if (updated.length >= MAX_IMAGES) break;
          updated.push(file);
        }
      }

      return updated;
    });

    setReplaceIndex(null);
    e.target.value = ""; // allow reselect same files
  };

  // Open file input for adding new images
  const openAdd = () => {
    setReplaceIndex(null);
    fileInputRef.current.click();
  };

  // Open file input for replacing existing image
  const openReplace = (index) => {
    setReplaceIndex(index);
    fileInputRef.current.click();
  };

  // Remove image
  const handleRemove = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">
        Product Images ({images.length}/{MAX_IMAGES})
      </h3>

      {/* Image grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {images.map((file, i) => (
          <div
            key={i}
            className="group relative aspect-square rounded-xl overflow-hidden border"
          >
            <img
              src={URL.createObjectURL(file)}
              alt={`Product ${i}`}
              className="w-full h-full object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2 text-white text-sm font-medium">
              <button
                type="button"
                onClick={() => openReplace(i)}
                className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded hover:bg-white/40 transition"
              >
                <FaEdit /> Replace
              </button>

              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded hover:bg-white/40 transition"
              >
                <FaTimes /> Remove
              </button>
            </div>
          </div>
        ))}

        {/* Add button */}
        {images.length < MAX_IMAGES && (
          <button
            type="button"
            onClick={openAdd}
            className="aspect-square border-2 border-dashed rounded-xl flex items-center justify-center text-indigo-500 hover:bg-indigo-50 transition"
          >
            <FaUpload size={20} />
          </button>
        )}
      </div>

      {/* Hidden file input (MULTIPLE ENABLED) */}
      <input
        ref={fileInputRef}
        type="file"
        hidden
        multiple
        accept="image/*"
        onChange={handleFileSelect}
      />

      {/* Submit button */}
      <button
        type="submit"
        className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white py-4 rounded-xl font-semibold hover:bg-indigo-700 transition"
      >
        <FaSave /> Add Product
      </button>
    </div>
  );
};

export default SectionTwo;
