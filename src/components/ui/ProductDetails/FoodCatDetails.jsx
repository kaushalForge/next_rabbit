"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/context/AuthContext";
import { useCart } from "@/app/context/CartContext";
import { addToCartAction } from "@/actions/handleCart";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const FoodCatDetails = ({ productId, productDetail }) => {
  const { currentUser } = useAuth();
  const { refreshCart } = useCart();

  const foodVariants = productDetail?.food || [];
  const productFetchId = productId;

  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState("");

  const allWeights = useMemo(() => {
    // Flatten all weights from all variants and remove duplicates
    const weights = foodVariants.flatMap((v) => v.weight || []);
    return Array.from(new Set(weights));
  }, [foodVariants]);

  const matchedVariant = useMemo(() => {
    if (!selectedWeight) return null;
    return foodVariants.find((v) => (v.weight || []).includes(selectedWeight));
  }, [selectedWeight, foodVariants]);

  const finalPrice = Number(
    matchedVariant?.price ?? foodVariants?.[0]?.price ?? 0,
  );
  const finalOfferPrice = Number(
    matchedVariant?.offerPrice ?? foodVariants?.[0]?.offerPrice ?? 0,
  );

  const displayedVariant = useMemo(() => {
    if (selectedWeight) {
      return foodVariants.find((v) =>
        (v.weight || []).includes(selectedWeight),
      );
    }
    return foodVariants[0] || null;
  }, [selectedWeight, foodVariants]);

  const handleAddToCart = async () => {
    if (!currentUser) {
      toast.warning("You must login first!");
      return;
    }

    if (!selectedWeight) {
      toast.error("Please select weight");
      return;
    }

    try {
      const { status, message } = await addToCartAction({
        productId: productFetchId,
        quantity,
        price: finalPrice,
        offerPrice: finalOfferPrice,
        weight: selectedWeight,
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

  console.log(productDetail);

  return (
    <div className="relative md:w-1/2 space-y-6">
      <h1 className="text-3xl font-semibold">
        {productDetail?.name || <Skeleton className="h-8 w-40" />}
      </h1>

      <div className="flex flex-wrap gap-2">
        {productDetail?.tags?.map((tag, idx) => (
          <span
            key={idx}
            className="px-3 py-1 text-sm font-medium text-green-800 bg-green-200/50 rounded-full backdrop-blur-sm hover:bg-green-200/70 transition-colors cursor-pointer"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="h-10">
        {finalOfferPrice > 0 && finalOfferPrice < finalPrice && (
          <p className="line-through text-muted-foreground">Rs.{finalPrice}</p>
        )}
        <p className="text-lg tracking-tight text-[#ff4500]">
          {finalOfferPrice > 0 ? `Rs.${finalOfferPrice}` : `Rs.${finalPrice}`}
        </p>
      </div>

      {displayedVariant && (
        <div className="flex flex-col flex-wrap gap-1">
          <p className="font-medium mb-1">Details</p>
          {[
            { label: "Food Type", value: displayedVariant.foodType || "N/A" },
            { label: "Taste", value: displayedVariant.taste || "N/A" },
            {
              label: "Batch Number",
              value: displayedVariant.batchNumber || "N/A",
            },
            { label: "Stock", value: displayedVariant.stock ?? 0 },
          ].map((item, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-1 rounded-md"
            >
              <span className="text-sm font-medium text-gray-700">
                {item.label}:
              </span>
              <span className="text-sm font-semibold bg-[#ff4500]/10 px-2 py-1 rounded-lg text-[#ff4500]">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {allWeights.length > 0 && (
        <div>
          <p className="font-medium mb-2">Weight</p>
          <div className="flex items-center justify-start gap-2 flex-wrap">
            {allWeights.map((weight) => (
              <Button
                key={weight}
                variant={selectedWeight === weight ? "default" : "outline"}
                onClick={() =>
                  setSelectedWeight((prev) => (prev === weight ? "" : weight))
                }
                className="h-8 w-16 md:h-10 md:w-20"
              >
                {weight}
              </Button>
            ))}
          </div>
        </div>
      )}

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

      <p className="text-muted-foreground leading-relaxed">
        {productDetail?.description ? (
          productDetail.description
        ) : (
          <Skeleton className="h-20 w-full" />
        )}
      </p>

      <Button
        onClick={handleAddToCart}
        className="absolute w-full left-0 bottom-0"
        size="lg"
      >
        Add To Cart
      </Button>
    </div>
  );
};

export default FoodCatDetails;
