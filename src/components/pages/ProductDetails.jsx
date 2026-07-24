"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import ProductDescription from "@/components/ui/ProductDetails/ProductDetailsDescription";
import FoodCatDetails from "../ui/ProductDetails/FoodCatDetails";
import FashionCatDetails from "../ui/ProductDetails/FashionCatDetails";

const ProductDetails = ({ productId, productDetail }) => {
  const { id } = useParams();
  const productFetchId = productId || id;
  const images = useMemo(() => productDetail?.images || [], [productDetail?.images]);
  const [activeImage, setActiveImage] = useState(images[0] || null);
  const [mainImageLoading, setMainImageLoading] = useState(true);

  useEffect(() => {
    if (images.length) {
      // ponytail: reset active image on product change — setState intentional
      /* eslint-disable react-hooks/set-state-in-effect */
      setActiveImage(images[0]);
      setMainImageLoading(true);
      /* eslint-enable react-hooks/set-state-in-effect */
    }
  }, [images]);

  return (
    <section className="">
      <div className="max-w-7xl md:container mx-auto p-4 md:px-6 lg:px-12">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="hidden md:flex flex-col gap-4">
            {images.map((img, i) => (
              <div
                key={i}
                onClick={() => {
                  if (activeImage?.url !== img.url) {
                    setActiveImage(img);
                    setMainImageLoading(true);
                  }
                }}
                className={`relative h-24 w-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-colors ${
                  activeImage?.url === img.url
                    ? "border-black"
                    : "border-gray-300"
                }`}
              >
                <Image
                  src={img.url}
                  alt="thumb"
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <div className="md:w-1/2 flex flex-col gap-4">
            <h1 className="text-2xl font-semibold md:hidden">
              {productDetail?.name}
            </h1>

            <div className="relative w-full aspect-3/4 rounded-lg overflow-hidden bg-muted">
              {(mainImageLoading || !activeImage) && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse z-10" />
              )}

              {activeImage?.url && (
                <Image
                  fill
                  src={activeImage.url}
                  alt="product"
                  className={`object-cover transition-opacity duration-300 ${
                    mainImageLoading ? "opacity-0" : "opacity-100"
                  }`}
                  onLoadingComplete={() => setMainImageLoading(false)}
                />
              )}
            </div>

            <div className="flex md:hidden gap-4 overflow-x-auto py-2">
              {images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => {
                    if (activeImage?.url !== img.url) {
                      setActiveImage(img);
                      setMainImageLoading(true);
                    }
                  }}
                  className={`relative shrink-0 h-20 w-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-colors ${
                    activeImage?.url === img.url
                      ? "border-black"
                      : "border-gray-300"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt="thumb"
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {productDetail?.mainCategory === "Food" && (
            <FoodCatDetails
              productId={productFetchId}
              productDetail={productDetail}
            />
          )}
          {productDetail?.mainCategory === "Fashion" && (
            <FashionCatDetails
              productId={productFetchId}
              productDetail={productDetail}
            />
          )}
        </div>

        <ProductDescription productDetail={productDetail} />
      </div>
    </section>
  );
};

export default ProductDetails;
