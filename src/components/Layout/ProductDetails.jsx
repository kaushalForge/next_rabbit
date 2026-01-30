"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductByFilters } from "../redux/slices/productSlice";
import { addToCart } from "../redux/slices/cartSlice";
import { IoPricetags } from "react-icons/io5";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

const ProductDetails = ({ productId, productDetail }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user, guestId } = useSelector((state) => state.auth);

  /* ================= State ================= */
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [activeImage, setActiveImage] = useState(null);
  const [mainImageLoading, setMainImageLoading] = useState(true);
  const [thumbLoading, setThumbLoading] = useState({});

  const productFetchId = productId || id;

  /* ================= Data Loading ================= */
  const isDataLoading =
    !productDetail || Object.keys(productDetail).length === 0;

  /* ================= Product Type ================= */
  const mainCategory = productDetail?.mainCategory || "";
  const isFashion = mainCategory === "Fashion";
  const isFood = mainCategory === "Food";

  /* ================= Product Arrays ================= */
  const images = productDetail?.images || [];
  const tags = productDetail?.tags || [];
  const bulletDescription = productDetail?.bulletDescription || [];
  const bulletKeyValueDescription =
    productDetail?.bulletKeyValueDescription || [];

  // Fashion-specific nested fields
  const fashionSizes = productDetail?.fashion?.size || [];
  const fashionColors = productDetail?.fashion?.color || [];
  const fashionMaterials = productDetail?.fashion?.material || [];
  const fashionDimensions = productDetail?.fashion?.dimensions || {};

  /* ================= Fetch Product ================= */
  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductByFilters(productFetchId));
    }
  }, [dispatch, productFetchId]);

  /* ================= Set Default Main Image ================= */
  useEffect(() => {
    if (!isDataLoading && images.length > 0) {
      setActiveImage(images[0]);
      setMainImageLoading(true);
    }
  }, [isDataLoading, images]);

  /* ================= Add To Cart ================= */
  const handleAddToCart = () => {
    if (isFashion && (!selectedColor || !selectedSize)) {
      toast.error("Please select size and color!");
      return;
    }

    dispatch(
      addToCart({
        productId: productFetchId,
        quantity,
        size: selectedSize || null,
        color: selectedColor || null,
        guestId,
        userId: user?._id,
      }),
    )
      .unwrap()
      .then(() => toast.success("Product added to cart"))
      .catch(() => toast.error("Failed to add product"));
  };

  /* ================= Render ================= */
  return (
    <section className="p-6">
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* ================ Thumbnails (Desktop) ================ */}
          <div className="hidden md:flex flex-col gap-4">
            {isDataLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-20 rounded-lg" />
                ))
              : images.map((img, i) => (
                  <div
                    key={i}
                    className="relative h-24 w-20 rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => {
                      setActiveImage(img);
                      setMainImageLoading(true);
                    }}
                  >
                    {thumbLoading[i] && (
                      <Skeleton className="absolute inset-0 z-10" />
                    )}
                    <Image
                      width={800}
                      height={800}
                      quality={90}
                      src={img.url}
                      alt={img.altText || productDetail.name || "Product"}
                      className={`h-full w-full rounded-lg border-2 ${
                        activeImage?.url === img.url
                          ? "border-[#ff4500]"
                          : "border-stone-300"
                      }`}
                      onLoadStart={() =>
                        setThumbLoading((prev) => ({ ...prev, [i]: true }))
                      }
                      onLoadingComplete={() =>
                        setThumbLoading((prev) => ({ ...prev, [i]: false }))
                      }
                      onLoad={() =>
                        setThumbLoading((prev) => ({ ...prev, [i]: false }))
                      }
                    />
                  </div>
                ))}
          </div>

          {/* ================ Main Image ================ */}
          <div className="md:w-1/2">
            <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden bg-muted">
              {(isDataLoading || mainImageLoading) && (
                <Skeleton className="absolute inset-0 z-10 rounded-lg" />
              )}
              {activeImage?.url && (
                <Image
                  fill
                  priority
                  sizes="(max-width:768px) 100vw, 50vw"
                  quality={90}
                  src={activeImage.url}
                  alt={productDetail?.name || "Product"}
                  className="object-cover rounded-lg"
                  onLoadingComplete={() => setMainImageLoading(false)}
                />
              )}
            </div>

            {/* ================ Thumbnails (Mobile) ================ */}
            <div className="flex md:hidden gap-4 mt-4 overflow-x-auto">
              {isDataLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton
                      key={i}
                      className="h-20 w-20 rounded-lg shrink-0"
                    />
                  ))
                : images.map((img, i) => (
                    <div
                      key={i}
                      className="relative h-24 w-20 rounded-lg overflow-hidden shrink-0 cursor-pointer"
                      onClick={() => {
                        setActiveImage(img);
                        setMainImageLoading(true);
                      }}
                    >
                      {thumbLoading[i] && (
                        <Skeleton className="absolute inset-0 z-10" />
                      )}
                      <Image
                        width={800}
                        height={800}
                        quality={90}
                        src={img.url}
                        alt={img.altText || productDetail.name || "Product"}
                        className={`object-cover h-full w-full rounded-lg border-2 ${
                          activeImage?.url === img.url
                            ? "border-[#ff4500]"
                            : "border-stone-300"
                        }`}
                        onLoadStart={() =>
                          setThumbLoading((prev) => ({ ...prev, [i]: true }))
                        }
                        onLoadingComplete={() =>
                          setThumbLoading((prev) => ({ ...prev, [i]: false }))
                        }
                      />
                    </div>
                  ))}
            </div>
          </div>

          {/* ================ Right Side ================= */}
          <div className="md:w-1/2 md:ml-10 space-y-4">
            {/* Title */}
            {isDataLoading ? (
              <Skeleton className="h-8 w-3/4" />
            ) : (
              <h1 className="text-3xl font-semibold">{productDetail.name}</h1>
            )}

            {/* Brand */}
            {!isDataLoading && productDetail.brand && (
              <p className="text-gray-500">Brand: {productDetail.brand}</p>
            )}

            {/* Price */}
            {isDataLoading ? (
              <Skeleton className="h-6 w-32" />
            ) : (
              <div>
                {productDetail.price && productDetail.offerPrice && (
                  <p className="line-through text-gray-500">
                    ${productDetail.price}
                  </p>
                )}
                <p className="text-xl font-bold">
                  ${productDetail.offerPrice || productDetail.price}
                </p>
              </div>
            )}

            {/* Description */}
            {isDataLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ) : (
              <p className="text-gray-700">{productDetail.description}</p>
            )}

            {/* Tags */}
            {!isDataLoading && tags.length > 0 && (
              <div className="flex items-center justify-start gap-2 flex-wrap mt-2">
                <p className="font-medium">
                  <IoPricetags />
                </p>

                {tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 border rounded bg-gray-100 text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Fashion-specific fields */}
            {isFashion && (
              <>
                {/* Colors */}
                {fashionColors.length > 0 && (
                  <div className="mt-2">
                    <p className="font-medium">Color:</p>
                    <div className="flex gap-2 mt-1">
                      {fashionColors.map((color, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedColor(color)}
                          className={`h-8 w-8 rounded-full border ${
                            selectedColor === color ? "ring-2 ring-black" : ""
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Sizes */}
                {fashionSizes.length > 0 && (
                  <div className="mt-2">
                    <p className="font-medium">Size:</p>
                    <div className="flex gap-2 mt-1">
                      {fashionSizes.map((size, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedSize(size)}
                          className={`h-8 w-8 border rounded ${
                            selectedSize === size ? "bg-black text-white" : ""
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Materials */}
                {fashionMaterials.length > 0 && (
                  <div className="mt-2">
                    <p className="font-medium">Material:</p>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {fashionMaterials.map((mat, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 border rounded bg-gray-100 text-sm"
                        >
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dimensions */}
                {Object.keys(fashionDimensions).length > 0 && (
                  <div className="mt-2">
                    <p className="font-medium">Dimensions:</p>
                    <div className="flex gap-4 flex-wrap text-gray-700 mt-1">
                      {Object.entries(fashionDimensions).map(([key, val]) => (
                        <span
                          key={key}
                          className="px-2 py-1 border rounded bg-gray-50 text-sm"
                        >
                          {key}: {val}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Bullet Description */}
            {bulletDescription.length > 0 && (
              <ul className="list-disc pl-5 mt-2 text-gray-700">
                {bulletDescription.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}

            {/* Bullet Key-Value Description */}
            {bulletKeyValueDescription.length > 0 && (
              <div className="mt-2 border-t pt-2">
                {bulletKeyValueDescription.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between border-b py-1 text-gray-700"
                  >
                    <span className="font-medium">{item.key}</span>
                    <span>{item.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity Selector */}
            {isDataLoading ? (
              <Skeleton className="h-10 w-32 mt-2" />
            ) : (
              <div className="flex items-center gap-4 mt-2">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="border px-3 py-1 rounded"
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="border px-3 py-1 rounded"
                >
                  +
                </button>
              </div>
            )}

            {/* Add To Cart Button */}
            {isDataLoading ? (
              <Skeleton className="h-10 w-full mt-2" />
            ) : (
              <button
                onClick={handleAddToCart}
                className="w-full bg-black text-white py-2 rounded mt-4 hover:bg-[#ff4500] transition"
              >
                Add To Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
