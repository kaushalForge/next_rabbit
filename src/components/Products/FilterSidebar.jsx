"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { MdFilterAltOff } from "react-icons/md";
import { HiChevronDown } from "react-icons/hi2";

/* ── Collapsible Section ── */
const Section = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 pb-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-1.5 group"
      >
        <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-800 group-hover:text-black transition-colors duration-200">
          {title}
        </span>
        <HiChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
};

const FilterSidebar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const searchParamsKey = searchParams.toString();

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

    const nextFilters = {
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
    };

    setMainCategory((prev) => (prev !== mc ? mc : prev));

    setFilters((prev) => {
      if (JSON.stringify(prev) === JSON.stringify(nextFilters)) {
        return prev;
      }
      return nextFilters;
    });
  }, [searchParamsKey]);

  // ===== Write URL =====
  const writeURL = (next) => {
    const params = new URLSearchParams();

    const isAnyFilterSelected = Object.entries(next).some(([k, v]) => {
      return (
        (Array.isArray(v) && v.length > 0) ||
        (typeof v === "string" && v.trim() !== "") ||
        (k === "minPrice" && v !== 0) ||
        (k === "maxPrice" && v !== 100)
      );
    });

    let nextMainCategory = mainCategory;
    if (isAnyFilterSelected) {
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
      nextMainCategory = "default";
    }

    setMainCategory(nextMainCategory);
    if (nextMainCategory !== "default")
      params.set("mainCategory", nextMainCategory);

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
    writeURL({ ...filters, [key]: filters[key] === value ? "" : value });
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

  // ===== Active filter count =====
  const activeCount =
    filters.category.length +
    filters.color.length +
    filters.size.length +
    filters.material.length +
    filters.brand.length +
    filters.weight.length +
    filters.taste.length +
    filters.foodType.length +
    (filters.gender ? 1 : 0) +
    (filters.minPrice !== 0 ? 1 : 0) +
    (filters.maxPrice !== 100 ? 1 : 0);

  return (
    <div
      className="
      w-full bg-white border-r border-gray-100
      overflow-y-auto
      fixed top-0 left-0 h-full z-30
      sm:relative sm:h-auto sm:z-auto
      shadow-2xl sm:shadow-none
      transition-all duration-300 ease-in-out
    "
    >
      {/* ── Sticky Header ── */}
      <div className="sticky top-0 bg-white z-10 px-5 pt-6 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium uppercase tracking-[0.2em] text-gray-900">
              Filters
            </h3>
            {activeCount > 0 && (
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-900 text-white text-[10px] font-medium">
                {activeCount}
              </span>
            )}
          </div>
          <button
            type="button"
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
            className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500 hover:text-red-500 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-all duration-200"
          >
            <MdFilterAltOff className="w-3.5 h-3.5" />
            Clear all
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="px-5 py-4 space-y-4 pb-24">
        {/* Main Category */}
        <Section title="Main Category" defaultOpen={true}>
          <Select
            value={mainCategory || "default"}
            onValueChange={(value) => {
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
              setMainCategory(value);
              writeURL({
                ...resetFilters,
                mainCategory: value === "default" ? "" : value,
              });
            }}
          >
            <SelectTrigger className="w-full text-xs font-medium border border-gray-200 bg-gray-50 rounded-xl px-3 py-2.5 text-gray-900 hover:bg-white focus:ring-2 focus:ring-gray-900 transition-all">
              <SelectValue placeholder="Default" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="Fashion">Fashion</SelectItem>
              <SelectItem value="Food">Food</SelectItem>
            </SelectContent>
          </Select>
        </Section>

        {/* Category */}
        <Section title="Category">
          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => toggleMulti("category", c)}
                className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all duration-200
                  ${
                    filters.category.includes(c)
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-800 border-gray-300 hover:border-gray-700 hover:text-gray-900"
                  }`}
              >
                {c}
              </button>
            ))}
          </div>
        </Section>

        {/* ── Fashion Filters ── */}
        {(mainCategory === "Fashion" || mainCategory === "default") && (
          <>
            {/* Gender */}
            <Section title="Gender">
              <div className="flex gap-2">
                {genderOptions.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggleSingle("gender", g)}
                    className={`flex-1 text-[11px] font-medium py-2 rounded-xl border transition-all duration-200
                      ${
                        filters.gender === g
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-800 border-gray-300 hover:border-gray-700"
                      }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </Section>

            {/* Color */}
            <Section title="Color">
              <div className="flex flex-wrap gap-2.5">
                {colorOptions.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleMulti("color", c)}
                    title={c}
                    className={`w-7 h-7 rounded-full border-2 transition-all duration-200
                      ${
                        filters.color.includes(c)
                          ? "border-gray-900 scale-110 shadow-md"
                          : "border-gray-200 hover:border-gray-500"
                      }`}
                    style={{ backgroundColor: c.toLowerCase() }}
                  />
                ))}
              </div>
            </Section>

            {/* Size */}
            <Section title="Size">
              <div className="flex gap-2 flex-wrap">
                {sizeOptions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleMulti("size", s)}
                    className={`w-12 h-10 text-xs font-medium rounded-xl border transition-all duration-200
                      ${
                        filters.size.includes(s)
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-800 border-gray-300 hover:border-gray-700"
                      }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </Section>

            {/* Material */}
            <Section title="Material" defaultOpen={false}>
              <div className="flex flex-wrap gap-2">
                {materialOptions.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => toggleMulti("material", m)}
                    className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all duration-200
                      ${
                        filters.material.includes(m)
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-800 border-gray-300 hover:border-gray-700"
                      }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </Section>
          </>
        )}

        {/* ── Food Filters ── */}
        {(mainCategory === "Food" || mainCategory === "default") && (
          <>
            {/* Weight */}
            <Section title="Weight" defaultOpen={false}>
              <div className="flex flex-wrap gap-2">
                {weightOptions.map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => toggleMulti("weight", w)}
                    className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all duration-200
                      ${
                        filters.weight.includes(w)
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-800 border-gray-300 hover:border-gray-700"
                      }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </Section>

            {/* Taste */}
            <Section title="Taste" defaultOpen={false}>
              <div className="flex flex-wrap gap-2">
                {tasteOptions.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleMulti("taste", t)}
                    className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all duration-200
                      ${
                        filters.taste.includes(t)
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-800 border-gray-300 hover:border-gray-700"
                      }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Section>

            {/* Food Type */}
            <Section title="Food Type" defaultOpen={false}>
              <div className="flex flex-wrap gap-2">
                {foodTypeOptions.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => toggleMulti("foodType", f)}
                    className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all duration-200
                      ${
                        filters.foodType.includes(f)
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-800 border-gray-300 hover:border-gray-700"
                      }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </Section>
          </>
        )}

        {/* Price */}
        <Section title="Price Range">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-900">
                Rs.{filters.minPrice}
              </span>
              <span className="text-[10px] text-gray-400 font-medium">—</span>
              <span className="text-xs font-medium text-gray-900">
                Rs.{filters.maxPrice}
              </span>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-[10px] font-medium uppercase tracking-widest text-gray-600 mb-1">
                  Min
                </label>
                <input
                  ref={minPriceRef}
                  type="number"
                  min={0}
                  max={filters.maxPrice ?? 100}
                  value={filters.minPrice ?? 0}
                  onChange={(e) => handleMinPrice(Number(e.target.value))}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2 text-xs font-medium text-gray-900 outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                />
              </div>
              <div className="flex-1">
                <label className="block text-[10px] font-medium uppercase tracking-widest text-gray-600 mb-1">
                  Max
                </label>
                <input
                  ref={maxPriceRef}
                  type="number"
                  min={filters.minPrice ?? 0}
                  max={100}
                  value={filters.maxPrice ?? 100}
                  onChange={(e) => handleMaxPrice(Number(e.target.value))}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2 text-xs font-medium text-gray-900 outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
};

export default FilterSidebar;
