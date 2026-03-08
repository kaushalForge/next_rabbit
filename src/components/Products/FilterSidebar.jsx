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
import { HiChevronDown } from "react-icons/hi2";

/* ── Collapsible section ── */
const Section = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 pb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-1 group"
      >
        <span className="text-xs font-black uppercase tracking-[0.15em] text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
          {title}
        </span>
        <HiChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
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

  const [mainCategory, setMainCategory] = useState("default");
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

  const writeURL = (next) => {
    const params = new URLSearchParams();
    const isAnyFilterSelected = Object.entries(next).some(
      ([k, v]) =>
        (Array.isArray(v) && v.length > 0) ||
        (typeof v === "string" && v.trim() !== "") ||
        (k === "minPrice" && v !== 0) ||
        (k === "maxPrice" && v !== 100),
    );

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
      if (Array.isArray(value) && value.length > 0)
        params.set(key, value.join(","));
      else if (typeof value === "string" && value.trim() !== "")
        params.set(key, value);
      else if (
        (key === "minPrice" && value !== 0) ||
        (key === "maxPrice" && value !== 0)
      )
        params.set(key, value);
    });

    router.push(
      params.toString() ? `${pathname}?${params.toString()}` : pathname,
      { scroll: false },
    );
    setFilters(next);
  };

  const toggleSingle = (key, value) =>
    writeURL({ ...filters, [key]: filters[key] === value ? "" : value });
  const toggleMulti = (key, value) => {
    const exists = filters[key].includes(value);
    writeURL({
      ...filters,
      [key]: exists
        ? filters[key].filter((v) => v !== value)
        : [...filters[key], value],
    });
  };
  const handleMinPrice = (value) => writeURL({ ...filters, minPrice: value });
  const handleMaxPrice = (value) => writeURL({ ...filters, maxPrice: value });

  const categoryOptions =
    mainCategory === "Fashion"
      ? fashionOptions
      : mainCategory === "Food"
        ? foodOptions
        : [...fashionOptions, ...foodOptions];

  /* active filter count */
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
      w-full bg-white
      border-r border-gray-100
      overflow-y-auto
      fixed top-0 left-0 h-full z-30
      sm:relative sm:h-auto sm:z-auto
      shadow-xl sm:shadow-none
      transition-all duration-300
    "
    >
      {/* ── Header ── */}
      <div className="sticky top-0 bg-white z-10 px-5 pt-6 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h3 className="text-base font-black uppercase tracking-[0.2em] text-gray-900">
              Filters
            </h3>
            {activeCount > 0 && (
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-900 text-white text-[10px] font-black">
                {activeCount}
              </span>
            )}
          </div>

          <button
            onClick={() => {
              setMainCategory("default");
              const reset = {
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
              setFilters(reset);
              router.push(pathname, { scroll: false });
            }}
            className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 hover:text-red-500 transition-colors duration-200 px-2.5 py-1.5 rounded-lg hover:bg-red-50"
          >
            <MdFilterAltOff className="w-3.5 h-3.5" />
            Clear all
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="px-5 py-4 space-y-4">
        {/* Main Category */}
        <Section title="Category" defaultOpen={true}>
          <Select
            value={mainCategory || "default"}
            onValueChange={(value) => {
              const reset = {
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
                ...reset,
                mainCategory: value === "default" ? "" : value,
              });
            }}
          >
            <SelectTrigger className="w-full text-xs font-semibold border border-gray-200 bg-gray-50 rounded-xl px-3 py-2.5 hover:bg-white transition-colors focus:ring-2 focus:ring-gray-900">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">All Categories</SelectItem>
              <SelectItem value="Fashion">Fashion</SelectItem>
              <SelectItem value="Food">Food</SelectItem>
            </SelectContent>
          </Select>
        </Section>

        {/* Sub Category */}
        <Section title="Sub Category">
          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((c) => (
              <button
                key={c}
                onClick={() => toggleMulti("category", c)}
                className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all duration-200
                  ${
                    filters.category.includes(c)
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-800 border-gray-300 hover:border-gray-600"
                  }`}
              >
                {c}
              </button>
            ))}
          </div>
        </Section>

        {(mainCategory === "Fashion" || mainCategory === "default") && (
          <>
            {/* Gender */}
            <Section title="Gender">
              <div className="flex gap-2">
                {genderOptions.map((g) => (
                  <button
                    key={g}
                    onClick={() => toggleSingle("gender", g)}
                    className={`flex-1 text-[11px] font-bold py-2 rounded-xl border transition-all duration-200
                      ${
                        filters.gender === g
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-800 border-gray-300 hover:border-gray-600"
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
                    onClick={() => toggleMulti("color", c)}
                    title={c}
                    className={`w-7 h-7 rounded-full border-2 transition-all duration-200
                      ${
                        filters.color.includes(c)
                          ? "border-gray-900 scale-110 shadow-md"
                          : "border-transparent hover:border-gray-400"
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
                    onClick={() => toggleMulti("size", s)}
                    className={`w-12 h-10 text-xs font-bold rounded-xl border transition-all duration-200
                      ${
                        filters.size.includes(s)
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-800 border-gray-300 hover:border-gray-600"
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
                    onClick={() => toggleMulti("material", m)}
                    className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all duration-200
                      ${
                        filters.material.includes(m)
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-800 border-gray-300 hover:border-gray-600"
                      }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </Section>
          </>
        )}

        {(mainCategory === "Food" || mainCategory === "default") && (
          <>
            {/* Weight */}
            <Section title="Weight" defaultOpen={false}>
              <div className="flex flex-wrap gap-2">
                {weightOptions.map((w) => (
                  <button
                    key={w}
                    onClick={() => toggleMulti("weight", w)}
                    className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all duration-200
                      ${
                        filters.weight.includes(w)
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-800 border-gray-300 hover:border-gray-600"
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
                    onClick={() => toggleMulti("taste", t)}
                    className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all duration-200
                      ${
                        filters.taste.includes(t)
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-800 border-gray-300 hover:border-gray-600"
                      }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Section>

            {/* Food Type */}
            <Section title="Food Type" defaultOpen={false}>
              <div className="flex gap-2 flex-wrap">
                {foodTypeOptions.map((f) => (
                  <button
                    key={f}
                    onClick={() => toggleMulti("foodType", f)}
                    className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all duration-200
                      ${
                        filters.foodType.includes(f)
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-800 border-gray-300 hover:border-gray-600"
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
              <span className="text-xs font-black text-gray-900">
                Rs.{filters.minPrice}
              </span>
              <span className="text-[10px] text-gray-500 font-bold">to</span>
              <span className="text-xs font-black text-gray-900">
                Rs.{filters.maxPrice}
              </span>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-[10px] text-gray-600 font-black uppercase tracking-wider mb-1 block">
                  Min
                </label>
                <input
                  ref={minPriceRef}
                  type="number"
                  min={0}
                  value={filters.minPrice ?? 0}
                  onChange={(e) => handleMinPrice(Number(e.target.value))}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2 text-xs font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                />
              </div>
              <div className="flex-1">
                <label className="text-[10px] text-gray-600 font-black uppercase tracking-wider mb-1 block">
                  Max
                </label>
                <input
                  ref={maxPriceRef}
                  type="number"
                  min={filters.minPrice ?? 0}
                  value={filters.maxPrice ?? 0}
                  onChange={(e) => handleMaxPrice(Number(e.target.value))}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2 text-xs font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
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
