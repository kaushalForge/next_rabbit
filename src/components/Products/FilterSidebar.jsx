"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

const FilterSidebar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [filters, setFilters] = useState({
    category: [],
    gender: "",
    color: [],
    size: [],
    material: [],
    brand: [],
    minPrice: undefined,
    maxPrice: undefined,
  });

  const minPriceRef = useRef(null);
  const maxPriceRef = useRef(null);

  const categoryOptions = ["Top Wear", "Bottom Wear"];
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

  useEffect(() => {
    setFilters({
      category: searchParams.get("category")?.split(",").filter(Boolean) || [],
      gender: searchParams.get("gender") || "",
      color: searchParams.get("color")?.split(",").filter(Boolean) || [],
      size: searchParams.get("size")?.split(",").filter(Boolean) || [],
      brand: searchParams.get("brand")?.split(",").filter(Boolean) || [],
      material: searchParams.get("material")?.split(",").filter(Boolean) || [],
      minPrice: searchParams.get("minPrice")
        ? Number(searchParams.get("minPrice"))
        : 0,
      maxPrice: searchParams.get("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : 100,
    });
  }, [searchParams]);

  /* =====================================
     WRITE URL (triggers server refetch)
  ===================================== */
  const writeURL = (next) => {
    const params = new URLSearchParams();

    // Preserve existing search query
    const existingSearch = searchParams.get("search");
    if (existingSearch && next.search === undefined) {
      params.set("search", existingSearch);
    }

    Object.entries(next).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length) {
        params.set(key, value.join(","));
      } else if (value !== undefined && value !== "") {
        params.set(key, String(value));
      }
    });

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  /* =====================================
     FILTER HANDLERS
  ===================================== */
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

  /* =====================================
     PRICE HANDLERS
  ===================================== */
  const handleMinPrice = (value) => {
    const min = Math.min(value, filters.maxPrice ?? 100);
    writeURL({ ...filters, minPrice: min });
  };

  const handleMaxPrice = (value) => {
    const max = Math.max(value, filters.minPrice ?? 0);
    writeURL({ ...filters, maxPrice: max });
  };

  return (
    <div className="p-4 z-70 space-y-6 fixed top-0 left-0 h-full w-full sm:w-80 bg-white overflow-y-auto shadow-md sm:relative sm:top-auto sm:left-auto sm:h-auto sm:w-auto sm:shadow-none">
      <h3 className="text-xl font-medium">Filters</h3>

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

      {/* Brand */}
      <div>
        <p className="font-medium mb-2">Brand</p>
        {brandOptions.map((b) => (
          <label key={b} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.brand.includes(b)}
              onChange={() => toggleMulti("brand", b)}
            />
            {b}
          </label>
        ))}
      </div>

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

        <div className="relative h-6">
          {/* Min slider */}
          <input
            type="range"
            min={0}
            max={100}
            value={filters.minPrice ?? 0}
            onChange={(e) => handleMinPrice(Number(e.target.value))}
            className="absolute w-full pointer-events-none appearance-none h-1 bg-gray-300 rounded"
            style={{ zIndex: 2 }}
          />
          {/* Max slider */}
          <input
            type="range"
            min={0}
            max={100}
            value={filters.maxPrice ?? 100}
            onChange={(e) => handleMaxPrice(Number(e.target.value))}
            className="absolute w-full appearance-none h-1 bg-blue-500 rounded pointer-events-none"
            style={{ zIndex: 3 }}
          />
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span>${filters.minPrice ?? 0}</span>
          <span>${filters.maxPrice ?? 100}</span>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
