"use client";

import { useState, useEffect } from "react";
import { FaTimes, FaUpload, FaEdit } from "react-icons/fa";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const MAX_IMAGES = 6;

// Sortable Image Item
const SortableImage = ({ id, src, alt, onReplace, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group relative w-full aspect-square rounded-full overflow-hidden border bg-white"
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover object-center rounded-full transition-transform duration-200 group-hover:scale-105"
      />
      <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2 text-white text-sm">
        <button
          type="button"
          onClick={onReplace}
          className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded"
        >
          <FaEdit /> Replace
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded"
        >
          <FaTimes /> Remove
        </button>
      </div>
    </div>
  );
};

const SectionOne = ({
  images = [],
  setImages,
  existingImages = [],
  setExistingImages,
  fileInputRef,
  tags = "",
  setTags,
}) => {
  const [replaceTarget, setReplaceTarget] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const sensors = useSensors(useSensor(PointerSensor));

  // Ensure existingImages and images are arrays
  const safeExistingImages = Array.isArray(existingImages)
    ? existingImages
    : [];
  const safeImages = Array.isArray(images) ? images : [];

  // Combine existing + new images into a single array for drag-and-drop
  const allImages = [
    ...safeExistingImages.map((img, i) => ({
      id: `existing-${i}`,
      type: "existing",
      file: img,
    })),
    ...safeImages.map((file, i) => ({ id: `new-${i}`, type: "new", file })),
  ];

  const totalImages = allImages.length;

  // Handle drag end
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = allImages.findIndex((img) => img.id === active.id);
    const newIndex = allImages.findIndex((img) => img.id === over.id);

    if (oldIndex < 0 || newIndex < 0) return;

    const combined = [...allImages];
    const moved = combined.splice(oldIndex, 1)[0];
    combined.splice(newIndex, 0, moved);

    // Split back into existing and new images
    const newExisting = combined
      .filter((i) => i.type === "existing")
      .map((i) => i.file);
    const newNew = combined.filter((i) => i.type === "new").map((i) => i.file);

    setExistingImages(newExisting);
    setImages(newNew);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setSelectedFiles(files);
    e.target.value = "";
  };

  const openAdd = () => {
    if (totalImages >= MAX_IMAGES) return;
    setReplaceTarget({ type: "add" });
    fileInputRef.current.click();
  };

  const handleTagAdd = (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const value = tagInput.trim();
    if (!value) return;

    const currentTags = Array.isArray(tags)
      ? tags
      : typeof tags === "string"
        ? tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];

    if (currentTags.includes(value)) return;

    setTags([...currentTags, value].join(", "));
    setTagInput("");
  };

  const handleTagRemove = (index) => {
    const currentTags = Array.isArray(tags)
      ? tags
      : typeof tags === "string"
        ? tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];

    setTags(currentTags.filter((_, i) => i !== index).join(", "));
  };

  const tagList = Array.isArray(tags)
    ? tags
    : typeof tags === "string"
      ? tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

  useEffect(() => {
    if (!selectedFiles.length || !replaceTarget) return;

    if (replaceTarget.type === "add") {
      const remaining =
        MAX_IMAGES - (safeImages.length + safeExistingImages.length);
      setImages((prev) => [...prev, ...selectedFiles.slice(0, remaining)]);
    }

    setReplaceTarget(null);
    setSelectedFiles([]);
  }, [selectedFiles, replaceTarget]);

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
          onKeyDown={handleTagAdd}
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
                onClick={() => handleTagRemove(i)}
              />
            </span>
          ))}
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={allImages.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid grid-cols-2 gap-4">
            {allImages.map((img, i) => (
              <SortableImage
                key={img.id}
                id={img.id}
                src={
                  img.type === "existing"
                    ? img.file?.url || ""
                    : URL.createObjectURL(img.file)
                }
                alt={img.file?.altText || `Image ${i}`}
                onReplace={() => alert("Replace logic here")}
                onRemove={() => {
                  if (img.type === "existing")
                    setExistingImages((prev) =>
                      prev.filter((_, idx) => idx !== i),
                    );
                  else setImages((prev) => prev.filter((_, idx) => idx !== i));
                }}
              />
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
        </SortableContext>
      </DndContext>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        hidden
        accept="image/*"
        onChange={handleFileSelect}
      />
    </section>
  );
};

export default SectionOne;
