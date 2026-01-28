"use client";

import { useState, useEffect } from "react";
import { FaTimes, FaUpload, FaEdit } from "react-icons/fa";

const MAX_IMAGES = 6;

const SectionOne = ({
  images,
  setImages,
  existingImages,
  setExistingImages,
  fileInputRef,
  tags,
  setTags,
}) => {
  const [replaceTarget, setReplaceTarget] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    if (!selectedFiles.length || !replaceTarget) return;

    if (replaceTarget.type === "add") {
      const remaining = MAX_IMAGES - (images.length + existingImages.length);
      setImages((prev) => [...prev, ...selectedFiles.slice(0, remaining)]);
    }

    if (replaceTarget.type === "existing") {
      setExistingImages((prev) => {
        const updated = [...prev];
        selectedFiles.forEach((file, i) => {
          if (replaceTarget.index + i < updated.length) {
            updated[replaceTarget.index + i] = {
              url: URL.createObjectURL(file),
              altText: updated[replaceTarget.index + i]?.altText || "Product",
            };
          }
        });
        return updated;
      });
    }

    if (replaceTarget.type === "new") {
      setImages((prev) => {
        const updated = [...prev];
        selectedFiles.forEach((file, i) => {
          if (replaceTarget.index + i < updated.length) {
            updated[replaceTarget.index + i] = file;
          }
        });
        return updated;
      });
    }

    setReplaceTarget(null);
    setSelectedFiles([]);
  }, [selectedFiles, replaceTarget]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setSelectedFiles(files);
    e.target.value = "";
  };

  const openAdd = () => {
    if (existingImages.length + images.length >= MAX_IMAGES) return;
    setReplaceTarget({ type: "add" });
    fileInputRef.current.click();
  };

  const openReplaceExisting = (index) => {
    setReplaceTarget({ type: "existing", index });
    fileInputRef.current.click();
  };

  const openReplaceNew = (index) => {
    setReplaceTarget({ type: "new", index });
    fileInputRef.current.click();
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const tagList = tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const [tagInput, setTagInput] = useState("");

  const addTag = (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const value = tagInput.trim();
    if (!value || tagList.includes(value)) return;
    setTags([...tagList, value].join(","));
    setTagInput("");
  };

  const removeTag = (index) => {
    setTags(tagList.filter((_, i) => i !== index).join(", "));
  };

  const totalImages = existingImages.length + images.length;

  return (
    <section className="bg-white border rounded-xl p-2 space-y-5">
      <h3 className="font-semibold text-lg">
        Product Images ({totalImages}/{MAX_IMAGES})
      </h3>

      <div className="relative">
        <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600">
          Tags (↵ to Add)
        </label>
        <input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={addTag}
          placeholder="Hot, Sale"
          className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      {tagList.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tagList.map((tag, i) => (
            <span
              key={i}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm"
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

      <div className="grid grid-cols-2 gap-4">
        {existingImages.map((img, i) => (
          <div
            key={`existing-${i}`}
            className="group relative w-full aspect-square rounded-full overflow-hidden border bg-white"
          >
            <img
              src={img.url}
              alt={img.altText || "Product"}
              className="w-full h-full object-cover object-center rounded-full transition-transform duration-400 group-hover:scale-105"
            />
            <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2 text-white text-sm">
              <button
                type="button"
                onClick={() => openReplaceExisting(i)}
                className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded"
              >
                <FaEdit /> Replace
              </button>
              <button
                type="button"
                onClick={() => removeExistingImage(i)}
                className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded"
              >
                <FaTimes /> Remove
              </button>
            </div>
          </div>
        ))}

        {images.map((file, i) => (
          <div
            key={`new-${i}`}
            className="group relative w-full aspect-square rounded-full overflow-hidden border bg-white"
          >
            <img
              src={URL.createObjectURL(file)}
              alt={`New ${i}`}
              className="w-full h-full object-cover object-center rounded-full transition-transform duration-200 group-hover:scale-105"
            />
            <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2 text-white text-sm">
              <button
                type="button"
                onClick={() => openReplaceNew(i)}
                className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded"
              >
                <FaEdit /> Replace
              </button>
              <button
                type="button"
                onClick={() => removeNewImage(i)}
                className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded"
              >
                <FaTimes /> Remove
              </button>
            </div>
          </div>
        ))}

        {totalImages < MAX_IMAGES && (
          <button
            type="button"
            onClick={openAdd}
            className="w-full aspect-square border-2 border-dashed rounded-full flex items-center justify-center text-indigo-500 hover:bg-indigo-50 transition"
          >
            <FaUpload size={22} />
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        hidden
        name="images"
        accept="image/*"
        onChange={handleFileSelect}
      />
    </section>
  );
};

export default SectionOne;
