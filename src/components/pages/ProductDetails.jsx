"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductByFilters } from "../redux/slices/productSlice";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { addToCartAction, fetchCartAction } from "@/actions/handleCart";
import { useAuth } from "@/app/context/AuthContext";
import { useCart } from "@/app/context/CartContext";
import ProductDescription from "@/components/ui/ProductDetails/ProductDetailsDescription";

const ProductDetails = ({ productId, productDetail }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentUser } = useAuth();
  const { addCart, refreshCart } = useCart();

  const productFetchId = productId || id;
  const images = productDetail?.images || [];
  const fashionVariants = productDetail?.fashion || [];

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [activeImage, setActiveImage] = useState(images[0] || null);
  const [mainImageLoading, setMainImageLoading] = useState(true);

  /* =========================
        Fetch product
  ========================= */
  useEffect(() => {
    if (productFetchId) dispatch(fetchProductByFilters(productFetchId));
  }, [dispatch, productFetchId]);

  /* =========================
        Set main image
  ========================= */
  useEffect(() => {
    if (images.length) {
      setActiveImage(images[0]);
      setMainImageLoading(true);
    }
  }, [images]);

  /* =========================
        Memoized colors & sizes
  ========================= */
  const allColors = useMemo(
    () => [...new Set(fashionVariants.flatMap((v) => v.color))],
    [fashionVariants],
  );

  const allSizes = useMemo(
    () => [...new Set(fashionVariants.flatMap((v) => v.size))],
    [fashionVariants],
  );

  const isColorValid = useCallback(
    (color) =>
      !selectedSize ||
      fashionVariants.some(
        (v) => v.color.includes(color) && v.size.includes(selectedSize),
      ),
    [fashionVariants, selectedSize],
  );

  const isSizeValid = useCallback(
    (size) =>
      !selectedColor ||
      fashionVariants.some(
        (v) => v.size.includes(size) && v.color.includes(selectedColor),
      ),
    [fashionVariants, selectedColor],
  );

  const matchedVariant = useMemo(() => {
    if (!selectedColor || !selectedSize) return null;
    return fashionVariants.find(
      (v) => v.color.includes(selectedColor) && v.size.includes(selectedSize),
    );
  }, [selectedColor, selectedSize, fashionVariants]);

  const finalPrice = Number(
    matchedVariant?.price ?? fashionVariants?.[0]?.price ?? 0,
  );
  const finalOfferPrice = Number(
    matchedVariant?.offerPrice ?? fashionVariants?.[0]?.offerPrice ?? 0,
  );

  /* =========================
        Add to cart handler
  ========================= */
  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select size and color");
      return;
    }

    try {
      const { status, message } = await addToCartAction({
        productId: productFetchId,
        quantity,
        price: finalPrice,
        offerPrice: finalOfferPrice,
        size: selectedSize,
        color: selectedColor,
      });

      if (status === 200 || status === 201) {
        await refreshCart();
        toast.success(message || "Added to cart!");
      } else {
        toast.error(message || "Failed to add to cart");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <section className="p-6">
      <div className="container mx-auto p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Thumbnails */}
          <div className="hidden md:flex flex-col gap-4">
            {images.map((img, i) => (
              <div
                key={i}
                onClick={() => {
                  setActiveImage(img);
                  setMainImageLoading(true);
                }}
                className={`relative h-24 w-20 rounded-lg overflow-hidden cursor-pointer border-2 ${
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

          {/* Main Image */}
          <div className="md:w-1/2">
            <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden bg-muted">
              {(mainImageLoading || !activeImage) && (
                <Skeleton className="absolute inset-0 z-10" />
              )}
              {activeImage?.url && (
                <Image
                  fill
                  src={activeImage.url}
                  alt="product"
                  className="object-cover"
                  onLoadingComplete={() => setMainImageLoading(false)}
                />
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-3xl font-semibold">{productDetail?.name}</h1>

            {/* Price */}
            <div className="h-10">
              {finalOfferPrice > 0 && finalOfferPrice < finalPrice && (
                <p className="line-through text-muted-foreground">
                  Rs.{finalPrice}
                </p>
              )}
              <p className="text-lg tracking-tight text-[#ff4500]">
                {finalOfferPrice > 0
                  ? `Rs.${finalOfferPrice}`
                  : `Rs.${finalPrice}`}
              </p>
            </div>

            {/* Colors */}
            <div>
              <p className="font-medium mb-2">Color</p>
              <div className="flex gap-3">
                {allColors.map((color) => (
                  <button
                    key={color}
                    disabled={!isColorValid(color)}
                    onClick={() =>
                      setSelectedColor((p) => (p === color ? "" : color))
                    }
                    className={`h-10 w-10 rounded-full border transition ${
                      selectedColor === color ? "ring-2 ring-black" : ""
                    } disabled:opacity-30 disabled:cursor-not-allowed`}
                    style={{ backgroundColor: color.toLowerCase() }}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <p className="font-medium mb-2">Size</p>
              <div className="flex items-center justify-start gap-2 flex-wrap">
                {allSizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    disabled={!isSizeValid(size)}
                    onClick={() =>
                      setSelectedSize((p) => (p === size ? "" : size))
                    }
                    className="h-8 w-8 md:h-12 md:w-12 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                -
              </Button>
              <span className="text-lg w-8 text-center">{quantity}</span>
              <Button
                variant="outline"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </Button>
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">
              {productDetail?.description}
            </p>

            <Button onClick={handleAddToCart} className="w-full" size="lg">
              Add To Cart
            </Button>
          </div>
        </div>

        {/* Full product description */}
        <ProductDescription productDetail={productDetail} />
      </div>
    </section>
  );
};

export default ProductDetails;
