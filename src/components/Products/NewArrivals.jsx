"use client";

import { useRef } from "react";
import Link from "next/link";

const NewArrivals = ({ newArrivals }) => {
  const scrollRef = useRef(null);

  let isDown = false;
  let startX;
  let scrollLeft;

  const onMouseDown = (e) => {
    isDown = true;
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
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.2; // scroll speed
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <>
      {newArrivals?.length > 0 && (
        <section className="px-4 lg:px-6">
          <div className="container mx-auto text-center mb-10 relative">
            <h2 className="text-3xl font-bold mb-4">Explore New Arrivals</h2>
            <p className="text-lg text-gray-600 mb-8">
              Discover the latest styles straight off the runway, freshly added
              to keep your wardrobe on the cutting edge of fashion.
            </p>
          </div>

          {/* Drag Scroll Container */}
          <div
            ref={scrollRef}
            className="hide-scrollbar container mx-auto overflow-x-scroll flex space-x-6 relative mb-12 cursor-grab active:cursor-grabbing"
            onMouseDown={onMouseDown}
            onMouseLeave={onMouseLeave}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
          >
            {newArrivals.map((product) => (
              <div
                key={product._id}
                className="min-w-[100%] sm:min-w-[50%] lg:min-w-[30%] relative select-none"
              >
                <img
                  src={product.images?.[0]?.url}
                  alt={product.images?.[0]?.altText || product.name}
                  className="w-full h-[500px] object-cover rounded-lg pointer-events-none"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-opacity-50 backdrop-blur-md text-white p-4 rounded-b-lg">
                  <Link
                    href={`/collections/product/${product._id}`}
                    className="block pointer-events-auto"
                  >
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="mt-1">{product.price}</p>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default NewArrivals;
