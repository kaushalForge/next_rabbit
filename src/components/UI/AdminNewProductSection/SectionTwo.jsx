"use client";

import { useState, useEffect } from "react";
import { FaUpload, FaSave, FaEdit, FaTimes } from "react-icons/fa";

const MAX_IMAGES = 6;

const SectionTwo = ({ images, setImages, fileInputRef }) => {
  const [replaceIndex, setReplaceIndex] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (!selectedFile) return;
    setImages((prev) => {
      const updated = [...prev];

      if (replaceIndex !== null) {
        updated[replaceIndex] = selectedFile;
      } else if (prev.length < MAX_IMAGES) {
        updated.push(selectedFile);
      }

      return updated;
    });

    setReplaceIndex(null);
    setSelectedFile(null);
  }, [selectedFile, replaceIndex, setImages]);

  // Handle file input change
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    e.target.value = ""; // allow reselecting same file
  };

  // Open file input for adding new image
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

            {/* Overlay with Replace + Remove */}
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

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        hidden
        name="images"
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
