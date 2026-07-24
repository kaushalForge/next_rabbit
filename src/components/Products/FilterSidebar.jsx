"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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

// ─────────────────────────────────────────────────────────────────────────────
// STATIC DATA — module-level, allocated once, never recreated on re-render
// ─────────────────────────────────────────────────────────────────────────────
const FASHION_OPTIONS = [
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
const FOOD_OPTIONS = [
  "Snacks",
  "Beverages",
  "Dairy & Eggs",
  "Fruits & Vegetables",
  "Grains & Pulses",
  "Confectionery",
  "Natural Sweeteners",
  "Health Foods",
];
const ALL_OPTIONS = [...FASHION_OPTIONS, ...FOOD_OPTIONS];
const GENDER_OPTIONS = ["Male", "Female", "Unisex"];
const COLOR_OPTIONS = [
  "Red",
  "Blue",
  "Black",
  "Green",
  "Yellow",
  "Gray",
  "White",
];
const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL"];
const MATERIAL_OPTIONS = ["Cotton", "Polyester", "Wool"];
const WEIGHT_OPTIONS = ["250gm", "500gm", "1kg", "2kg"];
const TASTE_OPTIONS = ["Sweet", "Salty", "Spicy"];
const FOOD_TYPE_OPTIONS = ["Veg", "Non-veg", "Vegan"];

// Sets for O(1) membership checks instead of Array.includes
const FASHION_SET = new Set(FASHION_OPTIONS);
const FOOD_SET = new Set(FOOD_OPTIONS);

const RESET_FILTERS = Object.freeze({
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

// ─────────────────────────────────────────────────────────────────────────────
// Pure helpers — no hooks, safe to call anywhere
// ─────────────────────────────────────────────────────────────────────────────

/** Parse URLSearchParams → filter state object */
const parseParams = (sp) => ({
  category: sp.get("category")?.split(",").filter(Boolean) ?? [],
  gender: sp.get("gender") ?? "",
  color: sp.get("color")?.split(",").filter(Boolean) ?? [],
  size: sp.get("size")?.split(",").filter(Boolean) ?? [],
  brand: sp.get("brand")?.split(",").filter(Boolean) ?? [],
  material: sp.get("material")?.split(",").filter(Boolean) ?? [],
  weight: sp.get("weight")?.split(",").filter(Boolean) ?? [],
  taste: sp.get("taste")?.split(",").filter(Boolean) ?? [],
  foodType: sp.get("foodType")?.split(",").filter(Boolean) ?? [],
  minPrice: Number(sp.get("minPrice") ?? 0),
  maxPrice: Number(sp.get("maxPrice") ?? 100),
});

/** Build query string from filters + mainCategory */
const buildQuery = (filters, mc) => {
  const p = new URLSearchParams();
  if (mc !== "default") p.set("mainCategory", mc);
  Object.entries(filters).forEach(([k, v]) => {
    if (Array.isArray(v) && v.length) p.set(k, v.join(","));
    else if (typeof v === "string" && v) p.set(k, v);
    else if (k === "minPrice" && v !== 0) p.set(k, String(v));
    else if (k === "maxPrice" && v !== 100) p.set(k, String(v));
  });
  return p.toString();
};

/** Auto-detect mainCategory from active filters when user is on "default" */
const inferMC = (filters, currentMC) => {
  const hasFilter = Object.entries(filters).some(
    ([k, v]) =>
      (Array.isArray(v) && v.length) ||
      (typeof v === "string" && v) ||
      (k === "minPrice" && v !== 0) ||
      (k === "maxPrice" && v !== 100),
  );
  if (!hasFilter) return "default";
  if (currentMC !== "default") return currentMC;
  if (
    filters.category.some((c) => FASHION_SET.has(c)) ||
    filters.gender ||
    filters.color.length ||
    filters.size.length ||
    filters.material.length
  )
    return "Fashion";
  if (
    filters.category.some((c) => FOOD_SET.has(c)) ||
    filters.weight.length ||
    filters.taste.length ||
    filters.foodType.length
  )
    return "Food";
  return "default";
};

// ─────────────────────────────────────────────────────────────────────────────
// Section — collapsible wrapper
// ─────────────────────────────────────────────────────────────────────────────
const Section = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 pb-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
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

// ─────────────────────────────────────────────────────────────────────────────
// FilterSidebar
// ─────────────────────────────────────────────────────────────────────────────
const FilterSidebar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  /**
   * skipSync = true  →  the next searchParams change was caused by US (router.replace)
   *                      so useEffect must skip it to prevent the infinite loop.
   * skipSync = false →  change came externally (back/forward navigation)
   *                      so useEffect should sync state from the URL.
   */
  const skipSync = useRef(false);

  // Lazy-init state directly from URL — zero extra renders on mount
  const [mainCategory, setMainCategory] = useState(
    () => searchParams.get("mainCategory") || "default",
  );
  const [filters, setFilters] = useState(() => parseParams(searchParams));

  // Price uses local state so every keystroke is instant;
  // the URL is only updated on blur (commitPrice)
  const [localMin, setLocalMin] = useState(() =>
    Number(searchParams.get("minPrice") ?? 0),
  );
  const [localMax, setLocalMax] = useState(() =>
    Number(searchParams.get("maxPrice") ?? 100),
  );

  // ── Sync FROM URL — only for external navigation (browser back / forward) ──
  useEffect(() => {
    if (skipSync.current) {
      skipSync.current = false; // we caused this → ignore it
      return;
    }
    const mc = searchParams.get("mainCategory") || "default";
    const next = parseParams(searchParams);
    setMainCategory(mc);
    setFilters(next);
    setLocalMin(next.minPrice);
    setLocalMax(next.maxPrice);
  }, [searchParams]);

  // ── Single source of truth: apply filters + push URL atomically ───────────
  const applyFilters = useCallback(
    (nextFilters, overrideMC) => {
      const nextMC = overrideMC ?? inferMC(nextFilters, mainCategory);
      const query = buildQuery(nextFilters, nextMC);
      const nextUrl = query ? `${pathname}?${query}` : pathname;
      const currUrl =
        pathname +
        (searchParams.toString() ? `?${searchParams.toString()}` : "");

      // Update React state immediately for zero-latency UI feedback
      setMainCategory(nextMC);
      setFilters(nextFilters);

      // Push URL only if it actually changed
      if (nextUrl !== currUrl) {
        skipSync.current = true; // suppress the useEffect
        router.replace(nextUrl, { scroll: false }); // replace = no history spam
      }
    },
    [mainCategory, pathname, router, searchParams],
  );

  // ── Handlers ──────────────────────────────────────────────────────────────
  const toggleSingle = useCallback(
    (key, value) =>
      applyFilters({ ...filters, [key]: filters[key] === value ? "" : value }),
    [filters, applyFilters],
  );

  const toggleMulti = useCallback(
    (key, value) => {
      const arr = filters[key];
      applyFilters({
        ...filters,
        [key]: arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      });
    },
    [filters, applyFilters],
  );

  // Price inputs: instant local state, commits URL only on blur
  const commitPrice = useCallback(() => {
    const min = Math.min(localMin, localMax);
    const max = Math.max(localMin, localMax);
    applyFilters({ ...filters, minPrice: min, maxPrice: max });
  }, [localMin, localMax, filters, applyFilters]);

  const handleClearAll = useCallback(() => {
    skipSync.current = true;
    setMainCategory("default");
    setFilters(RESET_FILTERS);
    setLocalMin(0);
    setLocalMax(100);
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  const handleMainCategoryChange = useCallback(
    (value) => applyFilters({ ...RESET_FILTERS }, value),
    [applyFilters],
  );

  // ── Derived (no useMemo needed — these are O(1) or tiny arrays) ───────────
  const categoryOptions =
    mainCategory === "Fashion"
      ? FASHION_OPTIONS
      : mainCategory === "Food"
        ? FOOD_OPTIONS
        : ALL_OPTIONS;

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

  const showFashion = mainCategory === "Fashion" || mainCategory === "default";
  const showFood = mainCategory === "Food" || mainCategory === "default";

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="w-full bg-white border-r border-gray-100 overflow-y-auto">
      {/* Sticky Header */}
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
            onClick={handleClearAll}
            className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500 hover:text-red-500 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-all duration-200"
          >
            <MdFilterAltOff className="w-3.5 h-3.5" />
            Clear all
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-4 space-y-4 pb-24">
        {/* Main Category */}
        <Section title="Main Category">
          <Select value={mainCategory} onValueChange={handleMainCategoryChange}>
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
                className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all duration-200 ${
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

        {/* Fashion filters */}
        {showFashion && (
          <>
            <Section title="Gender">
              <div className="flex gap-2">
                {GENDER_OPTIONS.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggleSingle("gender", g)}
                    className={`flex-1 text-[11px] font-medium py-2 rounded-xl border transition-all duration-200 ${
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

            <Section title="Color">
              <div className="flex flex-wrap gap-2.5">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleMulti("color", c)}
                    title={c}
                    className={`w-7 h-7 rounded-full border-2 transition-all duration-200 ${
                      filters.color.includes(c)
                        ? "border-gray-900 scale-110 shadow-md"
                        : "border-gray-200 hover:border-gray-500"
                    }`}
                    style={{ backgroundColor: c.toLowerCase() }}
                  />
                ))}
              </div>
            </Section>

            <Section title="Size">
              <div className="flex gap-2 flex-wrap">
                {SIZE_OPTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleMulti("size", s)}
                    className={`w-12 h-10 text-xs font-medium rounded-xl border transition-all duration-200 ${
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

            <Section title="Material" defaultOpen={false}>
              <div className="flex flex-wrap gap-2">
                {MATERIAL_OPTIONS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => toggleMulti("material", m)}
                    className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all duration-200 ${
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

        {/* Food filters */}
        {showFood && (
          <>
            <Section title="Weight" defaultOpen={false}>
              <div className="flex flex-wrap gap-2">
                {WEIGHT_OPTIONS.map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => toggleMulti("weight", w)}
                    className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all duration-200 ${
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

            <Section title="Taste" defaultOpen={false}>
              <div className="flex flex-wrap gap-2">
                {TASTE_OPTIONS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleMulti("taste", t)}
                    className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all duration-200 ${
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

            <Section title="Food Type" defaultOpen={false}>
              <div className="flex flex-wrap gap-2">
                {FOOD_TYPE_OPTIONS.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => toggleMulti("foodType", f)}
                    className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all duration-200 ${
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

        {/* Price Range */}
        <Section title="Price Range">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-900">
                Rs.{localMin}
              </span>
              <span className="text-[10px] text-gray-400 font-medium">—</span>
              <span className="text-xs font-medium text-gray-900">
                Rs.{localMax}
              </span>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-[10px] font-medium uppercase tracking-widest text-gray-600 mb-1">
                  Min
                </label>
                <input
                  type="number"
                  min={0}
                  max={localMax}
                  value={localMin}
                  onChange={(e) => setLocalMin(Number(e.target.value))}
                  onBlur={commitPrice}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2 text-xs font-medium text-gray-900 outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                />
              </div>
              <div className="flex-1">
                <label className="block text-[10px] font-medium uppercase tracking-widest text-gray-600 mb-1">
                  Max
                </label>
                <input
                  type="number"
                  min={localMin}
                  max={100}
                  value={localMax}
                  onChange={(e) => setLocalMax(Number(e.target.value))}
                  onBlur={commitPrice}
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
