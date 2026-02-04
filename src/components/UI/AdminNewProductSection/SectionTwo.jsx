"use client";

import Image from "next/image";
import { useState } from "react";
import { FaUpload, FaEdit, FaTimes } from "react-icons/fa";

const MAX_IMAGES = 6;

const SectionTwo = ({
  existingImages,
  setExistingImages,
  images,
  setImages,
  fileInputRef,
}) => {
  const [replaceIndex, setReplaceIndex] = useState(null);
  const [replaceExisting, setReplaceExisting] = useState(false);

  /* ================= SAFE FALLBACKS (KEY FIX) ================= */
  const safeExistingImages = existingImages || [];
  const safeSetExistingImages = setExistingImages || (() => {});

  /* ---------------- HANDLE FILE SELECT ---------------- */
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (replaceExisting && replaceIndex !== null) {
      // Replace existing image (keep object structure)
      safeSetExistingImages((prev) => {
        const updated = [...prev];
        updated[replaceIndex] = {
          url: URL.createObjectURL(files[0]),
          altText:
            updated[replaceIndex]?.altText || `Image ${replaceIndex + 1}`,
        };
        return updated;
      });
    } else if (!replaceExisting && replaceIndex !== null) {
      // Replace newly added image
      setImages((prev) => {
        const updated = [...prev];
        updated[replaceIndex] = files[0];
        return updated;
      });
    } else {
      // Add new images
      setImages((prev) => {
        const updated = [...prev];
        for (const file of files) {
          if (updated.length + safeExistingImages.length >= MAX_IMAGES) break;
          updated.push(file);
        }
        return updated;
      });
    }

    setReplaceIndex(null);
    setReplaceExisting(false);
    e.target.value = "";
  };

  /* ---------------- OPEN FILE INPUT ---------------- */
  const openAdd = () => {
    setReplaceIndex(null);
    setReplaceExisting(false);
    fileInputRef.current.click();
  };

  const openReplace = (index, isExisting = false) => {
    setReplaceIndex(index);
    setReplaceExisting(isExisting);
    fileInputRef.current.click();
  };

  /* ---------------- REMOVE IMAGE ---------------- */
  const handleRemoveExisting = (index) => {
    safeSetExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveNew = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
        {/* Existing Images */}
        {safeExistingImages.map((img, i) => (
          <div
            key={`existing-${i}`}
            className="group relative aspect-square rounded-lg overflow-hidden bg-muted"
          >
            <Image
              height={600}
              width={600}
              quality={75}
              src={img.url}
              alt={img.altText || `Product ${i + 1}`}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-3 text-white text-sm font-medium">
              <button
                type="button"
                onClick={() => openReplace(i, true)}
                className="px-3 py-1.5 rounded-md bg-white/20 hover:bg-white/40 transition flex items-center gap-2"
              >
                <FaEdit size={14} /> Replace
              </button>
              <button
                type="button"
                onClick={() => handleRemoveExisting(i)}
                className="px-3 py-1.5 rounded-md bg-white/20 hover:bg-white/40 transition flex items-center gap-2"
              >
                <FaTimes size={14} /> Remove
              </button>
            </div>
          </div>
        ))}

        {/* Newly Added Images */}
        {images.map((file, i) => (
          <div
            key={`new-${i}`}
            className="group relative aspect-square rounded-lg overflow-hidden bg-muted"
          >
            <img
              src={URL.createObjectURL(file)}
              alt={`New Image ${i + 1}`}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-3 text-white text-sm font-medium">
              <button
                type="button"
                onClick={() => openReplace(i, false)}
                className="px-3 py-1.5 rounded-md bg-white/20 hover:bg-white/40 transition flex items-center gap-2"
              >
                <FaEdit size={14} /> Replace
              </button>
              <button
                type="button"
                onClick={() => handleRemoveNew(i)}
                className="px-3 py-1.5 rounded-md bg-white/20 hover:bg-white/40 transition flex items-center gap-2"
              >
                <FaTimes size={14} /> Remove
              </button>
            </div>
          </div>
        ))}

        {/* Add Image Tile */}
        {safeExistingImages.length + images.length < MAX_IMAGES && (
          <button
            type="button"
            onClick={openAdd}
            className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/40 flex items-center justify-center hover:bg-muted transition"
          >
            <FaUpload className="text-muted-foreground" size={20} />
          </button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        hidden
        multiple
        accept="image/*"
        onChange={handleFileSelect}
      />
    </div>
  );
};

export default SectionTwo;
