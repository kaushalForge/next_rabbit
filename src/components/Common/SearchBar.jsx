"use client";

import { useEffect, useRef, useState } from "react";
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2";
import { motion } from "framer-motion";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

const SearchBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const searchRef = useRef(null);

  // 🔄 Sync input with URL (?search=)
  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
  }, [searchParams]);

  const handleSearchToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    // Normalize input: trim and collapse spaces
    const normalizedSearch = searchTerm.trim().replace(/\s+/g, " ");

    // If input is empty, use "nothing"
    const finalSearch = normalizedSearch;

    // Update URL with search param
    router.push(`/collections/all?search=${encodeURIComponent(finalSearch)}`, {
      scroll: false,
    });

    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  // ✅ Close on route change
  useEffect(() => {
    if (isOpen) setIsOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div
      ref={searchRef}
      className={`flex items-center justify-center w-full transition-all duration-200 ${
        isOpen ? "absolute top-0 left-0 w-full bg-white h-full" : "w-auto"
      }`}
    >
      {isOpen ? (
        <form
          onSubmit={handleSearch}
          className="relative flex items-center justify-center w-full"
        >
          <div className="absolute left-4 flex items-center">
            <Link href="/" className="text-xl font-bold">
              <img
                src="/images/logo2.png"
                alt="Logo"
                className="h-32 w-32 object-cover select-none"
              />
            </Link>
          </div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-1/2"
          >
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-100 px-4 py-2 pl-2 pr-12 rounded-lg focus:outline-none w-full placeholder:text-gray-700"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              <HiMagnifyingGlass className="select-none h-5 w-5 text-gray-700" />
            </button>
          </motion.div>

          <button
            type="button"
            onClick={handleSearchToggle}
            className="absolute right-6 top-1/2 -translate-y-1/2"
          >
            <HiMiniXMark className="select-none h-5 w-5 text-gray-700" />
          </button>
        </form>
      ) : (
        <div onClick={handleSearchToggle} className="h-6 w-6 cursor-pointer">
          <HiMagnifyingGlass className="select-none h-5 w-5 text-gray-700" />
        </div>
      )}
    </div>
  );
};

export default SearchBar;
