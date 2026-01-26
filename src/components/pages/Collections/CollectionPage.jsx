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
      <div className="container mx-auto flex flex-col lg:flex-row">
        {/* Mobile Filter Button */}
        <button
          onClick={() => toggleFilterSidebar()}
          className="lg:hidden rounded-xl transition-colors duration-200 hover:bg-black hover:text-white border p-2 flex items-center justify-center mb-4"
        >
          <FaFilter className="mr-2" />
          Filters
        </button>

        {/* Sidebar */}
        <div
          ref={sidebarRef}
          className={`fixed inset-0 bg-black bg-opacity-0 left-0 z-50 w-64 bg-white transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:static lg:translate-x-0`}
        >
          <FilterSidebar />
        </div>

        {/* Products */}
        <div className="flex-grow">
          <div className="flex flex-col md:flex-row md:justify-between mb-4 items-center p-4">
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-2xl font-semibold uppercase">
                All Collection
              </h2>
              <p className="text-lg font-medium text-gray-900">
                ({category})
              </p>
            </div>
            <SortOptions onSortChange={handleSort} />
          </div>

          <ProductGrid products={products} />
        </div>
      </div>
    </>
  );
};

export default CollectionPage;
