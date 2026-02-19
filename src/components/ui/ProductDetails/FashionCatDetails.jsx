"use client";

import React, { useMemo, useCallback, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useCart } from "@/app/context/CartContext";
import { Button } from "@/components/ui/button";
import { addToCartAction } from "@/actions/handleCart";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const FashionCatDetails = ({ productId, productDetail }) => {
  const router = useRouter();

  const { refreshCart } = useCart();
  const fashionVariants = productDetail?.fashion || [];
  const productFetchId = productId;
  const { currentUser } = useAuth();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  /* ================== VARIANTS ================== */

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

  /* ================== ADD TO CART ================== */

  const handleAddToCart = async () => {
    // 🚫 prevent multiple clicks
    if (isAdding) return;

    if (!currentUser) {
      toast.warning("You must login first!");
      router.push("/login");
      return;
    }

    if (!selectedSize || !selectedColor) {
      toast.error("Please select size and color");
      return;
    }

    try {
      setIsAdding(true);
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
        console.log(message, "this is message");
        toast.success(message || "Added to cart!");
      } else {
        toast.error(message || "Failed to add to cart");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="relative md:w-1/2 space-y-6">
      <h1 className="hidden md:inline text-3xl font-semibold">
        {productDetail?.name}
      </h1>

      <div className="mt-0 md:mt-4 flex flex-wrap gap-2">
        {productDetail?.tags?.map((tag, idx) => (
          <span
            key={idx}
            className="px-3 py-1 text-sm font-medium text-green-800 bg-green-200/50 rounded-full backdrop-blur-sm hover:bg-green-200/70 transition-colors cursor-pointer"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* ================= PRICE ================= */}
      <div className="h-10">
        {finalOfferPrice > 0 && finalOfferPrice < finalPrice && (
          <p className="line-through text-muted-foreground">Rs.{finalPrice}</p>
        )}
        <p className="text-lg tracking-tight text-[#ff4500]">
          {finalOfferPrice > 0 ? `Rs.${finalOfferPrice}` : `Rs.${finalPrice}`}
        </p>
      </div>

      {/* ================= COLORS ================= */}
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

      {/* ================= SIZES ================= */}
      <div>
        <p className="font-medium mb-2">Size</p>
        <div className="flex items-center gap-2 flex-wrap">
          {allSizes.map((size) => (
            <Button
              key={size}
              variant={selectedSize === size ? "default" : "outline"}
              disabled={!isSizeValid(size)}
              onClick={() => setSelectedSize((p) => (p === size ? "" : size))}
              className="h-8 w-8 md:h-12 md:w-12 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      {/* ================= QUANTITY ================= */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
        >
          -
        </Button>
        <span className="text-lg w-8 text-center">{quantity}</span>
        <Button variant="outline" onClick={() => setQuantity((q) => q + 1)}>
          +
        </Button>
      </div>

      {/* ================= META DESCRIPTION ================= */}
      <p className="text-muted-foreground leading-relaxed">
        {productDetail?.metaDescription}
      </p>

      {/* ================= ADD TO CART ================= */}
      <Button
        onClick={handleAddToCart}
        disabled={isAdding}
        className="w-full flex items-center justify-center gap-2"
        size="lg"
      >
        {isAdding && <Loader2 className="h-5 w-5 animate-spin" />}
        {isAdding ? "Adding..." : "Add To Cart"}
      </Button>
    </div>
  );
};

export default FashionCatDetails;
