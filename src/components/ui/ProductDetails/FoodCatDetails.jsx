"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/context/AuthContext";
import { useCart } from "@/app/context/CartContext";
import { addToCartAction } from "@/actions/handleCart";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const FoodCatDetails = ({ productId, productDetail }) => {
  const { currentUser } = useAuth();
  const { refreshCart } = useCart();
  const router = useRouter();

  const foodVariants = productDetail?.food || [];
  const productFetchId = productId;

  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const allWeights = useMemo(() => {
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

  const currentStock = displayedVariant?.stock ?? 0;

  /* ================== ADD TO CART ================== */

  const handleAddToCart = async () => {
    if (isAdding) return;

    if (!currentUser) {
      toast.warning("You must login first!");
      router.push("/login");
      return;
    }

    if (!selectedWeight) {
      toast.error("Please select weight");
      return;
    }

    if (currentStock === 0) {
      toast.warning("No stock available!", { richColors: true });
      return;
    }

    if (quantity > currentStock) {
      toast.error(`Only ${currentStock} items available`);
      return;
    }

    try {
      setIsAdding(true);

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

      {/* ================= PRODUCT DETAILS ================= */}
      {displayedVariant && (
        <div className="mt-4">
          <p className="text-sm font-semibold text-gray-800 mb-2">
            Product Details
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {[
              ["Food Type", displayedVariant.foodType],
              ["Taste", displayedVariant.taste],
              ["Batch", displayedVariant.batchNumber],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-xs"
              >
                <span className="text-gray-500">{label}:</span>
                <span className="font-semibold text-gray-900">
                  {value ?? "N/A"}
                </span>
              </div>
            ))}

            {selectedWeight && (
              <div
                className={`px-3 py-1.5 rounded-full text-xs border backdrop-blur-sm ${
                  currentStock > 0
                    ? "bg-green-500/20 border-green-400 text-green-600"
                    : "bg-red-500/20 border-red-400 text-red-600"
                }`}
              >
                {currentStock > 0 ? "In Stock" : "Out of Stock"}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= WEIGHT ================= */}
      {allWeights.length > 0 && (
        <div>
          <p className="font-medium mb-2">Weight</p>
          <div className="flex items-center gap-2 flex-wrap">
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

export default FoodCatDetails;
