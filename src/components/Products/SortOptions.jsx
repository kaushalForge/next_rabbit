"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";

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
    options.find((o) => o.value === sortBy)?.label || "Default";

  return (
    <div className="mb-4 flex justify-end" ref={dropdownRef}>
      <div className="relative w-60">
        {/* Button */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="
            w-full
            bg-white
            border
            border-gray-300
            rounded-lg
            py-2
            px-4
            text-left
            flex
            justify-between
            items-center
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
          {selectedLabel}
          <svg
            className={`h-4 w-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Options */}
        {open && (
          <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`
                  cursor-pointer
                  px-4
                  py-2
                  hover:bg-gray-100
                  ${sortBy === option.value ? "bg-gray-100 font-semibold" : ""}
                  transition
                  duration-150
                  ease-in-out
                `}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SortOptions;
