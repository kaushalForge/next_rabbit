"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { HiArrowDown } from "react-icons/hi";

const options = [
  { label: "Sort", value: "" },
  { label: "Price: Low to High", value: "priceAsc" },
  { label: "Price: High to Low", value: "priceDesc" },
  { label: "Popularity", value: "popularity" },
  { label: "Newest", value: "newest" },
];

const SortOptions = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [sortBy, setSortBy] = useState("");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Sync with URL
  useEffect(() => {
    setSortBy(searchParams.get("sortBy") || "");
  }, [searchParams]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value) => {
    setSortBy(value);
    setOpen(false);

    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("sortBy", value);
    else params.delete("sortBy");

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const selectedLabel =
    options.find((o) => o.value === sortBy)?.label || "Sort";

  return (
    <div
      className="flex justify-end w-full md:w-auto relative"
      ref={dropdownRef}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="
          w-12 md:w-60
          bg-white
          border
          border-gray-300
          rounded-lg
          py-2 px-3 md:px-4
          flex justify-between items-center
          shadow-sm
          hover:border-gray-400
          focus:outline-none
          focus:ring-2
          focus:ring-gray-200
          transition
          duration-150
          ease-in-out
        "
      >
        {/* Small screens: icon only */}
        <span className="md:hidden flex items-center justify-center w-full">
          <HiArrowDown className="h-5 w-5 text-gray-600" />
        </span>

        {/* md+ screens: text */}
        <span className="hidden md:inline truncate">{selectedLabel}</span>

        {/* Arrow icon on all screens */}
        <HiArrowDown
          className={`h-4 w-4 text-gray-400 transition-transform ml-2 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <ul className="absolute right-0 w-60 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto z-50">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`
                cursor-pointer
                px-4 py-2
                hover:bg-gray-100
                ${sortBy === option.value ? "bg-gray-100 font-semibold" : ""}
                transition duration-150 ease-in-out
              `}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SortOptions;
