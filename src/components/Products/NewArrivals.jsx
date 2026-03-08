"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";

const NewArrivals = ({ newArrivals }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  let isDown = false;
  let startX;
  let scrollLeft;

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollButtons);
    updateScrollButtons();
    return () => el.removeEventListener("scroll", updateScrollButtons);
  }, [newArrivals]);

  const scrollBy = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  const onMouseDown = (e) => {
    isDown = true;
    setIsDragging(false);
    startX = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft = scrollRef.current.scrollLeft;
  };

  const onMouseLeave = () => {
    isDown = false;
  };
  const onMouseUp = () => {
    isDown = false;
  };

  const onMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    setIsDragging(true);
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <>
      {newArrivals?.length > 0 && (
        <section className="mb-12 px-4 lg:px-8">
          {/* Header */}
          <div className="container mx-auto mb-8 px-4">
            <div className="flex flex-col items-center gap-4">
              {/* Text — centered */}
              <div className="flex flex-col items-center text-center w-full">
                <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-2 font-medium">
                  Just Dropped
                </p>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
                  New Arrivals
                </h2>
                <p className="text-gray-500 mt-2 text-sm md:text-base max-w-2xl">
                  Discover the latest styles, freshly added to keep your
                  wardrobe on the cutting edge of fashion.
                </p>
              </div>

              {/* Arrows — shown on all screen sizes, centered on mobile */}
              <div className="flex items-center justify-end w-full gap-2">
                <button
                  onClick={() => scrollBy(-1)}
                  disabled={!canScrollLeft}
                  className="w-10 h-10 md:w-11 md:h-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-900 hover:text-white hover:border-gray-900 disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200"
                  aria-label="Scroll left"
                >
                  ←
                </button>
                <button
                  onClick={() => scrollBy(1)}
                  disabled={!canScrollRight}
                  className="w-10 h-10 md:w-11 md:h-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-900 hover:text-white hover:border-gray-900 disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200"
                  aria-label="Scroll right"
                >
                  →
                </button>
              </div>
            </div>
          </div>

          {/* Scroll Container */}
          <div className="relative container mx-auto">
            <div
              ref={scrollRef}
              className={`hide-scrollbar overflow-x-scroll flex gap-4 md:gap-6 pb-4 snap-x snap-mandatory
                ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
              onMouseDown={onMouseDown}
              onMouseLeave={onMouseLeave}
              onMouseUp={onMouseUp}
              onMouseMove={onMouseMove}
            >
              {newArrivals.map((product, index) => (
                <div
                  key={product._id}
                  className="snap-start shrink-0 w-[78vw] sm:w-[45vw] lg:w-[30%] relative select-none group"
                >
                  {/* Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-white text-gray-900 text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                      New
                    </span>
                  </div>

                  {/* Image */}
                  <div className="relative overflow-hidden rounded-2xl">
                    <img
                      src={product.images?.[0]?.url}
                      alt={product.images?.[0]?.altText || product.name}
                      className="w-full h-105 md:h-125 object-cover pointer-events-none transition-transform duration-500 group-hover:scale-105"
                      draggable={false}
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent rounded-2xl" />

                    {/* Product Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                      <Link
                        href={`/collections/product/${product._id}`}
                        className={`block pointer-events-auto ${isDragging ? "pointer-events-none" : ""}`}
                      >
                        <h4 className="text-white font-semibold text-base md:text-lg leading-tight mb-1 truncate">
                          {product.name}
                        </h4>
                        <div className="flex items-center justify-between">
                          <p className="text-white/80 text-sm font-medium">
                            Rs.{product?.fashion[0]?.offerPrice}
                          </p>
                          <span className="text-[11px] text-white/70 bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full transition-all duration-200 group-hover:bg-white group-hover:text-gray-900">
                            View →
                          </span>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default NewArrivals;
