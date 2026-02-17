"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { MdFilterAltOff } from "react-icons/md";

const FilterSidebar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // ===== Main Category =====
  const [mainCategory, setMainCategory] = useState("default");

  // ===== Filters =====
  const [filters, setFilters] = useState({
    category: [],
    gender: "",
    color: [],
    size: [],
    material: [],
    brand: [],
    weight: [],
    taste: [],
    foodType: [],
    minPrice: 0,
    maxPrice: 100,
  });

  const minPriceRef = useRef(null);
  const maxPriceRef = useRef(null);

  // ===== Options =====
  const fashionOptions = [
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
  ];
  const foodOptions = [
    "Snacks",
    "Beverages",
    "Dairy & Eggs",
    "Fruits & Vegetables",
    "Grains & Pulses",
    "Confectionery",
    "Natural Sweeteners",
    "Health Foods",
  ];
  const genderOptions = ["Male", "Female", "Unisex"];
  const colorOptions = [
    "Red",
    "Blue",
    "Black",
    "Green",
    "Yellow",
    "Gray",
    "White",
  ];
  const sizeOptions = ["XS", "S", "M", "L", "XL"];
  const brandOptions = ["Urban Threads", "Modern Fit"];
  const materialOptions = ["Cotton", "Polyester", "Wool"];
  const weightOptions = ["250gm", "500gm", "1kg", "2kg"];
  const tasteOptions = ["Sweet", "Salty", "Spicy"];
  const foodTypeOptions = ["Veg", "Non-veg", "Vegan"];

  // ===== Load URL params into filters =====
  useEffect(() => {
    const mc = searchParams.get("mainCategory") || "default";
    setMainCategory(mc);

    setFilters({
      category: searchParams.get("category")?.split(",").filter(Boolean) || [],
      gender: searchParams.get("gender") || "",
      color: searchParams.get("color")?.split(",").filter(Boolean) || [],
      size: searchParams.get("size")?.split(",").filter(Boolean) || [],
      brand: searchParams.get("brand")?.split(",").filter(Boolean) || [],
      material: searchParams.get("material")?.split(",").filter(Boolean) || [],
      weight: searchParams.get("weight")?.split(",").filter(Boolean) || [],
      taste: searchParams.get("taste")?.split(",").filter(Boolean) || [],
      foodType: searchParams.get("foodType")?.split(",").filter(Boolean) || [],
      minPrice: searchParams.get("minPrice")
        ? Number(searchParams.get("minPrice"))
        : 0,
      maxPrice: searchParams.get("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : 100,
    });
  }, [searchParams]);

  // ===== Write URL =====
  const writeURL = (next) => {
    const params = new URLSearchParams();

    // Check if any filter is selected
    const isAnyFilterSelected = Object.entries(next).some(([k, v]) => {
      return (
        (Array.isArray(v) && v.length > 0) ||
        (typeof v === "string" && v.trim() !== "") ||
        (k === "minPrice" && v !== 0) ||
        (k === "maxPrice" && v !== 100)
      );
    });

    // Auto-set mainCategory based on selected filters
    let nextMainCategory = mainCategory;

    if (isAnyFilterSelected) {
      // Only set mainCategory if it's default and a filter is selected
      if (mainCategory === "default") {
        if (
          next.category?.some((c) => fashionOptions.includes(c)) ||
          next.gender ||
          next.color?.length > 0 ||
          next.size?.length > 0 ||
          next.material?.length > 0
        ) {
          nextMainCategory = "Fashion";
        } else if (
          next.category?.some((c) => foodOptions.includes(c)) ||
          next.weight?.length > 0 ||
          next.taste?.length > 0 ||
          next.foodType?.length > 0
        ) {
          nextMainCategory = "Food";
        }
      }
    } else {
      // If no filters selected, reset mainCategory to default
      nextMainCategory = "default";
    }

    setMainCategory(nextMainCategory);

    if (nextMainCategory !== "default")
      params.set("mainCategory", nextMainCategory);

    // Set URL params for all filters
    Object.entries(next).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        params.set(key, value.join(","));
      } else if (typeof value === "string" && value.trim() !== "") {
        params.set(key, value);
      } else if (
        (key === "minPrice" && value !== 0) ||
        (key === "maxPrice" && value !== 100)
      ) {
        params.set(key, value);
      }
    });

    router.push(
      params.toString() ? `${pathname}?${params.toString()}` : pathname,
      { scroll: false },
    );

    setFilters(next);
  };

  // ===== Generic toggle handlers =====
  const toggleSingle = (key, value) => {
    writeURL({
      ...filters,
      [key]: filters[key] === value ? "" : value,
    });
  };

  const toggleMulti = (key, value) => {
    const exists = filters[key].includes(value);
    writeURL({
      ...filters,
      [key]: exists
        ? filters[key].filter((v) => v !== value)
        : [...filters[key], value],
    });
  };

  // ===== Price handlers =====
  const handleMinPrice = (value) => {
    const min = Math.min(value, filters.maxPrice ?? 100);
    writeURL({ ...filters, minPrice: min });
  };

  const handleMaxPrice = (value) => {
    const max = Math.max(value, filters.minPrice ?? 0);
    writeURL({ ...filters, maxPrice: max });
  };

  // ===== Determine current categoryOptions dynamically =====
  const categoryOptions =
    mainCategory === "Fashion"
      ? fashionOptions
      : mainCategory === "Food"
        ? foodOptions
        : [...fashionOptions, ...foodOptions];

  return (
    <div className="p-4 z-30 border-r border-[#eaeaea] space-y-6 fixed top-0 left-0 h-full w-full bg-white overflow-y-auto shadow-md sm:relative sm:top-auto sm:left-auto sm:h-auto sm:w-auto sm:shadow-none">
      <h3 className="text-xl font-medium">Filters</h3>

      {/* Main Category */}
      <div>
        <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
          <p className="font-medium mb-2">Main Category</p>
          <button
            onClick={() => {
              setMainCategory("default");

              const resetFilters = {
                category: [],
                gender: "",
                color: [],
                size: [],
                material: [],
                brand: [],
                weight: [],
                taste: [],
                foodType: [],
                minPrice: 0,
                maxPrice: 100,
              };
              setFilters(resetFilters);
              router.push(`${pathname}`, { scroll: false });
            }}
            className="p-2 rounded-lg border hover:bg-[#ff4500] hover:text-white transition-colors duration-200"
          >
            <MdFilterAltOff />
          </button>
        </div>
        <Select
          value={mainCategory || "default"}
          onValueChange={(value) => {
            setMainCategory(value);
            writeURL({
              ...filters,
              mainCategory: value === "default" ? "" : value,
            });
          }}
        >
          <SelectTrigger className="w-full border rounded px-2 py-1">
            <SelectValue placeholder="Default" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="Fashion">Fashion</SelectItem>
            <SelectItem value="Food">Food</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Category */}
      <div>
        <p className="font-medium mb-2">Category</p>
        {categoryOptions.map((c) => (
          <label key={c} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.category.includes(c)}
              onChange={() => toggleMulti("category", c)}
            />
            {c}
          </label>
        ))}
      </div>

      {/* Dynamic filters for both categories */}
      {(mainCategory === "Fashion" || mainCategory === "default") && (
        <>
          {/* Gender */}
          <div>
            <p className="font-medium mb-2">Gender</p>
            {genderOptions.map((g) => (
              <label key={g} className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={filters.gender === g}
                  onClick={() => toggleSingle("gender", g)}
                  readOnly
                />
                {g}
              </label>
            ))}
          </div>

          {/* Color */}
          <div>
            <p className="font-medium mb-2">Color</p>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((c) => (
                <button
                  key={c}
                  onClick={() => toggleMulti("color", c)}
                  className={`w-8 h-8 rounded-full border ${
                    filters.color.includes(c) ? "ring-2 ring-blue-500" : ""
                  }`}
                  style={{ backgroundColor: c.toLowerCase() }}
                />
              ))}
            </div>
          </div>

          {/* Size */}
          <div>
            <p className="font-medium mb-2">Size</p>
            {sizeOptions.map((s) => (
              <label key={s} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.size.includes(s)}
                  onChange={() => toggleMulti("size", s)}
                />
                {s}
              </label>
            ))}
          </div>

          {/* Material */}
          <div>
            <p className="font-medium mb-2">Material</p>
            {materialOptions.map((m) => (
              <label key={m} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.material.includes(m)}
                  onChange={() => toggleMulti("material", m)}
                />
                {m}
              </label>
            ))}
          </div>
        </>
      )}

      {(mainCategory === "Food" || mainCategory === "default") && (
        <>
          {/* Weight */}
          <div>
            <p className="font-medium mb-2">Weight</p>
            {weightOptions.map((w) => (
              <label key={w} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.weight.includes(w)}
                  onChange={() => toggleMulti("weight", w)}
                />
                {w}
              </label>
            ))}
          </div>

          {/* Taste */}
          <div>
            <p className="font-medium mb-2">Taste</p>
            {tasteOptions.map((t) => (
              <label key={t} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.taste.includes(t)}
                  onChange={() => toggleMulti("taste", t)}
                />
                {t}
              </label>
            ))}
          </div>

          {/* Food Type */}
          <div>
            <p className="font-medium mb-2">Food Type</p>
            {foodTypeOptions.map((f) => (
              <label key={f} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.foodType.includes(f)}
                  onChange={() => toggleMulti("foodType", f)}
                />
                {f}
              </label>
            ))}
          </div>
        </>
      )}

      {/* Price */}
      <div>
        <p className="font-medium mb-2">Price</p>
        <div className="flex gap-2 mb-2">
          <input
            ref={minPriceRef}
            type="number"
            min={0}
            max={filters.maxPrice ?? 100}
            value={filters.minPrice ?? 0}
            onChange={(e) => handleMinPrice(Number(e.target.value))}
            className="w-1/2 border rounded px-2 py-1"
          />
          <input
            ref={maxPriceRef}
            type="number"
            min={filters.minPrice ?? 0}
            max={100}
            value={filters.maxPrice ?? 100}
            onChange={(e) => handleMaxPrice(Number(e.target.value))}
            className="w-1/2 border rounded px-2 py-1"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
