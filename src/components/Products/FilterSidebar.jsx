"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

const FilterSidebar = ({ onProductsUpdate }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [filters, setFilters] = useState({
    category: "",
    gender: "",
    color: [],
    size: [],
    material: [],
    brand: [],
    minPrice: undefined,
    maxPrice: undefined,
  });

  const categoryOptions = ["Top Wear", "Bottom Wear"];
  const genderOptions = ["Male", "Female"];
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

  /* =====================================
     URL → STATE
  ===================================== */
  useEffect(() => {
    const parsedFilters = {
      category: searchParams.get("category") || "",
      gender: searchParams.get("gender") || "",
      color: searchParams.get("color")?.split(",").filter(Boolean) || [],
      size: searchParams.get("size")?.split(",").filter(Boolean) || [],
      brand: searchParams.get("brand")?.split(",").filter(Boolean) || [],
      material: searchParams.get("material")?.split(",").filter(Boolean) || [],
      minPrice: searchParams.get("minPrice")
        ? Number(searchParams.get("minPrice"))
        : undefined,
      maxPrice: searchParams.get("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : undefined,
    };
    setFilters(parsedFilters);
  }, [searchParams]);

  /* =====================================
     Fetch Products whenever URL changes
  ===================================== */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = `/api/products/search?${searchParams.toString()}`;
        const res = await fetch(url);
        const data = await res.json();
        if (onProductsUpdate) onProductsUpdate(data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchProducts();
  }, [searchParams, onProductsUpdate]);

  /* =====================================
     URL WRITE (Preserve search param)
  ===================================== */
  const writeURL = (next) => {
    const params = new URLSearchParams();

    // Preserve existing search query if not overridden
    const existingSearch = searchParams.get("search");
    if (existingSearch && next.search === undefined) {
      params.set("search", existingSearch);
    }

    // Add all filter params
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

  const handlePrice = (max) => {
    writeURL(
      max === 100
        ? { ...filters, minPrice: undefined, maxPrice: undefined }
        : { ...filters, minPrice: 0, maxPrice: max },
    );
  };

  return (
    <div className="p-4 z-70 space-y-6 fixed top-0 left-0 h-full w-full sm:w-80 bg-white overflow-y-auto shadow-md sm:relative sm:top-auto sm:left-auto sm:h-auto sm:w-auto sm:shadow-none">

      {/* "fixed top-0 right-0 h-full w-3/4 sm:w-1/2 md:w-[30rem] bg-white shadow-lg transform transition-transform duration-300 flex flex-col z-70" */}
      <h3 className="text-xl font-medium">Filters</h3>

      {/* Category */}
      <div>
        <p className="font-medium mb-2">Category</p>
        {categoryOptions.map((c) => (
          <label key={c} className="flex items-center gap-2">
            <input
              type="radio"
              checked={filters.category === c}
              onClick={() => toggleSingle("category", c)}
              readOnly
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
        <input
          type="range"
          min={0}
          max={100}
          value={filters.maxPrice ?? 100}
          onChange={(e) => handlePrice(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-sm">
          <span>$0</span>
          <span>${filters.maxPrice ?? 100}</span>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
