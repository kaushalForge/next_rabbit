"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import SectionOne from "@/components/ui/AdminResuables/SectionOne";
import SectionTwo from "@/components/ui/AdminResuables/SectionTwo";
import { createProductAction } from "@/actions/adminProducts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Descriptions from "@/components/ui/AdminResuables/Descriptions";
import Fashion from "@/components/ui/AdminResuables/Fashion";
import Food from "@/components/ui/AdminResuables/Food";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

/* ---------------- HELPERS ---------------- */
const toArray = (value) =>
  typeof value === "string"
    ? value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean)
    : Array.isArray(value)
      ? value
      : [];

const logDev = (...args) => {
  if (process.env.NODE_ENV === "development") console.log(...args);
};

const AddNewProduct = () => {
  const [loading, setLoading] = useState(false);

  /* ---------------- BASIC ---------------- */
  const [name, setName] = useState("");
  const [countryOfOrigin, setCountryOfOrigin] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [rating, setRating] = useState(0);
  const [weight, setWeight] = useState("");
  const [material, setMaterial] = useState("");

  /* ---------------- SELECTS ---------------- */
  const [mainCategory, setMainCategory] = useState("");

  /* ---------------- FLAGS ---------------- */
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [isOnSale, setIsOnSale] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  /* ---------------- ARRAYS ---------------- */
  const [fashion, setFashion] = useState([]);
  const [food, setFood] = useState([]);
  const [tags, setTags] = useState([]);

  /* ---------------- IMAGES ---------------- */
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  /* ---------------- DESCRIPTION ---------------- */
  const [description, setDescription] = useState("");
  const [bulletDescription, setBulletDescription] = useState([""]);
  const [bulletKeyValueDescription, setBulletKeyValueDescription] = useState([
    { key: "", value: "" },
  ]);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!window.confirm("Are you sure you want to create this product?")) {
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("mainCategory", mainCategory);
      formData.append("category", category);
      formData.append("rating", String(rating));
      formData.append("countryOfOrigin", countryOfOrigin);
      formData.append("metaTitle", metaTitle);
      formData.append("brand", brand);
      formData.append("weight", weight);
      formData.append("material", material);
      formData.append("metaDescription", metaDescription);
      formData.append("isFeatured", String(isFeatured));
      formData.append("isNewArrival", String(isNewArrival));
      formData.append("isBestSeller", String(isBestSeller));
      formData.append("isTrending", String(isTrending));
      formData.append("isOnSale", String(isOnSale));
      formData.append("isPublished", String(isPublished));

      // Tags
      toArray(tags).forEach((t) => formData.append("tags[]", t));

      // Bullet description
      bulletDescription.forEach((b) =>
        formData.append("bulletDescription[]", b),
      );
      bulletKeyValueDescription.forEach((b) =>
        formData.append("bulletKeyValueDescription[]", JSON.stringify(b)),
      );

      // Fashion
      if (mainCategory === "fashion") {
        fashion.forEach((v) => {
          formData.append(
            "fashion[]",
            JSON.stringify({
              color: v.color || [],
              size: v.size || [],
              price: Number(v.price) || 0, // converted to number
              offerPrice: Number(v.offerPrice) || 0, // converted to number
              stock: Number(v.stock) || 0,
              sku: v.sku || "",
              gender: v.gender || "",
            }),
          );
        });
      }

      // Food
      if (mainCategory === "food") {
        food.forEach((f) => {
          formData.append(
            "food[]",
            JSON.stringify({
              sku: f.sku || "",
              foodType: f.foodType || "",
              weight: f.weight || [],
              taste: f.taste || "",
              price: Number(f.price) || 0, // converted to number
              offerPrice: Number(f.offerPrice) || 0, // converted to number
              batchNumber: f.batchNumber || "",
              stock: Number(f.stock) || 0,
            }),
          );
        });
      }
      // Images (new files)
      images.forEach(
        (file) => file instanceof File && formData.append("images", file),
      );

      // Log FormData (dev)
      // logDev("FormData Entries:");

      // Call API
      const { status, message } = await createProductAction(formData);

      if (status === 200 || status === 201) {
        toast.success(message || "Product created successfully!");

        // optionally reset form here
      } else {
        toast.error(message || "Failed to create product");
      }
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-muted/40">
      {/* FULL SCREEN LOADING OVERLAY */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
          <Spinner className="w-14 h-14 text-primary" />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="container mx-auto px-6 py-10 pb-32 space-y-10"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold tracking-tight">
            Create New Product
          </h1>
          <Badge variant="secondary">Admin Panel</Badge>
        </div>
        <Separator />
        {/* TOP CONTROL CARD */}
        <Card>
          <CardHeader>
            <CardTitle>Main Controls</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3">
              <Select value={mainCategory} onValueChange={setMainCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Main Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fashion">Fashion</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <Checkbox
                  checked={isFeatured}
                  onCheckedChange={setIsFeatured}
                />
                Featured
              </label>
              <label className="flex items-center gap-2">
                <Checkbox
                  checked={isNewArrival}
                  onCheckedChange={setIsNewArrival}
                />
                New Arrival
              </label>
              <label className="flex items-center gap-2">
                <Checkbox
                  checked={isBestSeller}
                  onCheckedChange={setIsBestSeller}
                />
                Best Seller
              </label>
              <label className="flex items-center gap-2">
                <Checkbox
                  checked={isTrending}
                  onCheckedChange={setIsTrending}
                />
                Trending
              </label>
              <label className="flex items-center gap-2">
                <Checkbox checked={isOnSale} onCheckedChange={setIsOnSale} />
                On Sale
              </label>
              <label className="flex items-center gap-2">
                <Checkbox
                  checked={isPublished}
                  onCheckedChange={setIsPublished}
                />
                Published
              </label>
            </div>
          </CardContent>
        </Card>
        {/* CATEGORY DEPENDENT CARDS */}
        {mainCategory && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Product Info</CardTitle>
              </CardHeader>
              <CardContent>
                <SectionOne
                  {...{
                    name,
                    setName,
                    countryOfOrigin,
                    setCountryOfOrigin,
                    category,
                    setCategory,
                    weight,
                    setWeight,
                    rating,
                    setRating,
                    tags,
                    brand,
                    setBrand,
                    setTags,
                    material,
                    setMaterial,
                  }}
                />
              </CardContent>
            </Card>

            {mainCategory === "fashion" && (
              <Card>
                <CardContent>
                  <Fashion fashion={fashion} setFashion={setFashion} />
                </CardContent>
              </Card>
            )}

            {mainCategory === "food" && (
              <Card>
                <CardContent>
                  <Food food={food} setFood={setFood} />
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent>
                <Descriptions
                  description={description}
                  setDescription={setDescription}
                  bulletDescription={bulletDescription}
                  setBulletDescription={setBulletDescription}
                  bulletKeyValueDescription={bulletKeyValueDescription}
                  setBulletKeyValueDescription={setBulletKeyValueDescription}
                  metaTitle={metaTitle}
                  setMetaTitle={setMetaTitle}
                  metaDescription={metaDescription}
                  setMetaDescription={setMetaDescription}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
              </CardHeader>
              <CardContent>
                <SectionTwo
                  images={images}
                  setImages={setImages}
                  fileInputRef={fileInputRef}
                />
              </CardContent>
            </Card>
          </>
        )}
        {/* SUBMIT BUTTON */}
        <div className="sticky left-0 bottom-0 z-40 w-full border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="relative max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="hidden md:flex items-center gap-3 relative h-10">
              <div className="absolute inset-0 w-40 rounded-full bg-gradient-to-r from-primary/20 via-indigo-400/20 to-purple-400/20 blur-xl animate-pulse" />
              <div className="flex gap-2 relative">
                <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                <span className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="h-2 w-2 rounded-full bg-purple-400 animate-bounce" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                Review details before publishing
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-11 px-8 rounded-md bg-primary text-primary-foreground font-medium shadow-sm hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Product..." : "Create Product"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddNewProduct;
