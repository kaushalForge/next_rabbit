"use client";

import { useState, useRef, useEffect } from "react";
import FilterSidebar from "@/components/Products/FilterSidebar";
import ProductGrid from "@/components/Common/ProductGrid";
import SortOptions from "@/components/Products/SortOptions";
import { FaFilter } from "react-icons/fa";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import {
  LuSlidersHorizontal,
  LuLayoutGrid,
  LuPalette,
  LuRuler,
  LuTag,
} from "react-icons/lu";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { MdFilterAltOff } from "react-icons/md";

const ICONS = [
  { icon: <LuSlidersHorizontal className="w-4 h-4" />, label: "Filters" },
  { icon: <LuLayoutGrid className="w-4 h-4" />, label: "Category" },
  { icon: <LuPalette className="w-4 h-4" />, label: "Color" },
  { icon: <LuRuler className="w-4 h-4" />, label: "Size" },
  { icon: <LuTag className="w-4 h-4" />, label: "Price" },
];

const CollectionPage = ({ products }) => {
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const sidebarRef = useRef(null);

  const category = searchParams.get("category")
    ? searchParams.get("category").split(",").join(", ")
    : "All";

  const searchParamsString = searchParams.toString();

  useEffect(() => {
    // ponytail: loading state for URL changes — setState intentional
    /* eslint-disable react-hooks/set-state-in-effect */
    setLoading(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [searchParamsString]);

  useEffect(() => {
    if (products) {
      // ponytail: loading state for products — setState intentional
      /* eslint-disable react-hooks/set-state-in-effect */
      setLoading(false);
      /* eslint-enable react-hooks/set-state-in-effect */
    }
  }, [products]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target))
        setIsSidebarOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  const handleSort = (sortBy) => {
    const params = new URLSearchParams(searchParams);
    if (sortBy) params.set("sortBy", sortBy);
    else params.delete("sortBy");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      {/* Loading Spinner */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
          <Spinner className="w-14 h-14 text-primary" />
        </div>
      )}

      {/* Mobile backdrop */}
      <div
        onClick={() => setIsSidebarOpen(false)}
        className={`
          fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden
          transition-opacity duration-300
          ${isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      />

      {/* Root layout */}
      <div className="w-full container mx-auto flex flex-col lg:flex-row items-start">
        {/* Mobile filter button */}
        <button
          onClick={() => setIsSidebarOpen((p) => !p)}
          className="lg:hidden mt-4 ml-4 self-start flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-200"
        >
          <FaFilter className="w-3 h-3" />
          Filters
        </button>

        {/* Mobile slide-in sidebar */}
        <div
          ref={sidebarRef}
          className={`
            fixed top-0 left-0 h-screen w-3/4 max-w-xs z-50
            transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:hidden
          `}
        >
          <FilterSidebar />
        </div>

        <div
          className={`
            hidden lg:block shrink-0 sticky top-0
            border-r border-gray-100 bg-white
            transition-all duration-300 ease-in-out overflow-hidden
            ${isDesktopSidebarOpen ? "w-72" : "w-12"}
          `}
        >
          {/* ── Full sidebar ── */}
          {isDesktopSidebarOpen && (
            <div className="w-72">
              <FilterSidebar />
            </div>
          )}

          {/* ── Icon strip (collapsed) ── */}
          {!isDesktopSidebarOpen && (
            <div className="flex flex-col items-center w-12 pt-6 pb-4 gap-1">
              <button
                onClick={() => setIsDesktopSidebarOpen(true)}
                title="Show filters"
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-900 hover:text-white transition-all duration-200 mb-3"
              >
                <HiChevronRight className="w-4 h-4" />
              </button>

              <div className="w-5 h-px bg-gray-200 mb-2 shrink-0" />

              {ICONS.map(({ icon, label }) => (
                <button
                  key={label}
                  onClick={() => setIsDesktopSidebarOpen(true)}
                  title={label}
                  className="group relative w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
                >
                  {icon}
                  <span className="pointer-events-none absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-xs font-bold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-150 z-50">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product area */}
        <div className="relative flex-1 min-w-0 w-full">
          <button
            onClick={() => setIsDesktopSidebarOpen(false)}
            title="Hide filters"
            className={`${!isDesktopSidebarOpen ? "hidden" : "hidden lg:flex"} absolute top-5 -left-3.5 w-7 h-7 rounded-full bg-white border border-gray-200 shadow-sm items-center justify-center text-gray-500 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-200`}
          >
            <HiChevronLeft className="w-3.5 h-3.5" />
          </button>
          {/* Toolbar */}
          <div className="flex flex-row flex-wrap md:flex-nowrap items-center justify-between p-4 mb-4 gap-2 border-b border-gray-100">
            <div className="flex items-center gap-2 shrink-0 min-w-0">
              <h2 className="text-lg md:text-xl lg:text-2xl font-semibold uppercase shrink-0">
                All Collection
              </h2>
              <p className="text-xs font-medium text-gray-500 truncate min-w-0">
                ({category})
              </p>
            </div>
            <div className="shrink-0">
              <SortOptions onSortChange={handleSort} />
            </div>
          </div>

          {/* Grid / Empty */}
          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="flex flex-col items-center justify-center w-full py-24 px-6 text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg
                    className="w-9 h-9 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="m21 21-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0Z"
                    />
                  </svg>
                </div>
                <span className="absolute inset-0 rounded-full bg-gray-200 opacity-40 animate-ping" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-widest text-gray-900 mb-2">
                No Products Found
              </h3>
              <p className="text-sm text-gray-500 font-medium max-w-xs leading-relaxed">
                We couldn&apos;t find anything matching your filters. Try adjusting
                or clearing them.
              </p>
              <button
                type="button"
                onClick={() => router.push(pathname, { scroll: false })}
                className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gray-900 text-white text-xs font-bold tracking-wide hover:bg-gray-700 transition-all duration-200"
              >
                <MdFilterAltOff className="w-3.5 h-3.5" />
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CollectionPage;
