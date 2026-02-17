"use client";

import { useState, useRef, useEffect } from "react";
import FilterSidebar from "@/components/Products/FilterSidebar";
import ProductGrid from "@/components/Common/ProductGrid";
import SortOptions from "@/components/Products/SortOptions";
import { FaFilter } from "react-icons/fa";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const CollectionPage = ({ products }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const sidebarRef = useRef(null);
  const category = searchParams.get("category")
    ? searchParams.get("category").split(",").join(", ")
    : "All";
  const toggleFilterSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle sorting
  const handleSort = (sortBy) => {
    const params = new URLSearchParams(searchParams);
    if (sortBy) params.set("sortBy", sortBy);
    else params.delete("sortBy");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      <div className="max-w-7xl lg:container mx-auto flex flex-col lg:flex-row">
        {/* Mobile Filter Button */}
        <button
          onClick={() => toggleFilterSidebar()}
          className="lg:hidden mt-4 ml-4 max-w-20 flex items-center justify-start rounded-lg transition-colors duration-200 hover:bg-black hover:text-white border p-1"
        >
          <FaFilter className="mr-1" />
          Filters
        </button>

        {/* Sidebar */}
        <div
          ref={sidebarRef}
          className={`fixed inset-0 backdrop-blur-sm bg-transparent left-0 transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0 z-50 w-3/4" : "-translate-x-full"}
          lg:static lg:translate-x-0`}
        >
          <FilterSidebar />
        </div>

        {/* Products */}
        <div className="grow">
          <div className="flex flex-row flex-wrap md:flex-nowrap items-center justify-between mb-4 p-4 gap-2">
            {/* Left side: heading + category */}
            <div className="flex items-center gap-2 shrink-0 min-w-0">
              <h2 className="text-lg md:text-xl lg:text-2xl font-semibold uppercase shrink-0">
                All Collection
              </h2>
              <p className="text-xs font-medium text-gray-900 truncate min-w-0">
                ({category})
              </p>
            </div>

            {/* Right side: sort options */}
            <div className="shrink-0">
              <SortOptions onSortChange={handleSort} />
            </div>
          </div>

          <ProductGrid products={products} />
        </div>
      </div>
    </>
  );
};

export default CollectionPage;
