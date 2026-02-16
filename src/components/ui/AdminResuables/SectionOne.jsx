"use client";

import { Input } from "../input";
import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";

/* =====================================================
 * SAFE HELPERS
 * ===================================================== */
const safeString = (v) => (typeof v === "string" ? v : "");
const safeArray = (v) => (Array.isArray(v) ? v : []);

const SectionOne = (props) => {
  const {
    name,
    setName,
    countryOfOrigin,
    setCountryOfOrigin,
    mainCategory,
    category,
    setCategory,
    weight,
    setWeight,
    rating,
    setRating,
    tags,
    brand,
    setBrand,
    setTags,
    material,
    setMaterial,
  } = props;

  const CATEGORY_OPTIONS =
    mainCategory === "fashion" || mainCategory === "Fashion"
      ? [
          "Top Wear",
          "Bottom Wear",
          "Shoes",
          "Innerwear",
          "Jackets & Coats",
          "Ethnic Wear",
          "Sportswear",
          "Accessories",
          "Bags & Wallets",
          "Hats & Caps",
        ]
      : [
          "Snacks",
          "Beverages",
          "Dairy & Eggs",
          "Fruits & Vegetables",
          "Grains & Pulses",
          "Confectionery",
          "Natural Sweeteners",
          "Health Foods",
        ];

  const isPredefined = CATEGORY_OPTIONS.includes(category);

  /* ================= TAG STATE ================= */
  const [tagInput, setTagInput] = useState("");
  const tagList = useMemo(() => safeArray(tags), [tags]);

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const value = tagInput.trim();
      if (!tagList.includes(value)) {
        setTags([...tagList, value]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tag) => {
    setTags(tagList.filter((t) => t !== tag));
  };

  /* ================= CATEGORY LOGIC =================
     Only ONE can control the value
  ===================================================== */

  return (
    <section className="lg:col-span-2 space-y-8">
      {/* ================= BASIC INFO ================= */}
      <div className="grid md:grid-cols-2 gap-4">
        <Input
          label="Product Name"
          placeholder="Product Name"
          value={safeString(name)}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          label="Brand"
          placeholder="Brand"
          value={safeString(brand)}
          onChange={(e) => setBrand(e.target.value)}
        />

        {/* ============ CATEGORY (MATCHED HEIGHT) ============ */}
        <div className="flex gap-2">
          <Select
            value={isPredefined ? category : ""}
            onValueChange={(value) => setCategory(value)}
          >
            <SelectTrigger className="h-10 w-1/2 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            label="Custom Category"
            placeholder="Custom Category"
            value={!isPredefined ? safeString(category) : ""}
            onChange={(e) => setCategory(e.target.value)}
            className="w-1/2"
          />
        </div>

        <Input
          label="Weight"
          placeholder="Weight"
          value={safeString(weight)}
          onChange={(e) => setWeight(e.target.value)}
        />

        <Input
          label="Country of Origin"
          placeholder="Nepal"
          value={safeString(countryOfOrigin)}
          onChange={(e) => setCountryOfOrigin(e.target.value)}
        />
        <Input
          label="Rating"
          type="number"
          min={0}
          max={5}
          step={1}
          placeholder="Rating (0 - 5)"
          value={rating ?? ""}
          onChange={(e) => {
            const val = e.target.value;

            // Empty input → reset
            if (val === "") {
              setRating("");
              return;
            }

            // Parse integer
            const num = parseInt(val, 10);

            // Valid integer between 0 and 5 → set it
            if (!isNaN(num) && num >= 0 && num <= 5) {
              setRating(num);
            } else {
              // Invalid → clear
              setRating("");
            }
          }}
        />
      </div>

      {/* ================= MATERIAL (STRING) ================= */}
      <Input
        label="Material"
        placeholder="Cotton"
        value={safeString(material)}
        onChange={(e) => setMaterial(e.target.value)}
      />

      {/* ================= TAGS (ARRAY) ================= */}
      <div className="space-y-3">
        <Input
          label="Tags"
          placeholder="Type tag and press Enter"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
        />

        <div className="flex flex-wrap gap-2">
          {tagList.map((tag, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full
bg-linear-to-br from-red-400/30 via-rose-300/20 to-red-500/30
backdrop-blur-md border border-red-300/40
shadow-[0_4px_14px_rgba(239,68,68,0.28)]
text-red-900 text-xs font-semibold tracking-wide"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-xs text-red-900/70"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionOne;
