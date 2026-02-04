"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import SectionOne from "../UI/AdminNewProductSection/SectionOne";
import SectionTwo from "../UI/AdminNewProductSection/SectionTwo";
import { updateProductAction } from "@/actions/adminProducts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Descriptions from "../UI/AdminNewProductSection/ResuableHelpers/Descriptions";
import Fashion from "../UI/AdminNewProductSection/ResuableHelpers/Fashion";
import Food from "../UI/AdminNewProductSection/ResuableHelpers/Food";
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
import { FaCopy } from "react-icons/fa";

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

const EditProduct = ({ productDetails }) => {
  const [loading, setLoading] = useState(false);

  /* ---------------- BASIC ---------------- */
  const [name, setName] = useState(productDetails?.name || "");
  const [countryOfOrigin, setCountryOfOrigin] = useState(
    productDetails?.countryOfOrigin || "",
  );
  const [category, setCategory] = useState(productDetails?.category || "");
  const [brand, setBrand] = useState(productDetails?.brand || "");
  const [rating, setRating] = useState(productDetails?.rating || 0);
  const [weight, setWeight] = useState(productDetails?.weight || "");
  const [material, setMaterial] = useState(productDetails?.material || "");

  /* ---------------- SELECTS ---------------- */
  const [mainCategory, setMainCategory] = useState(
    productDetails?.mainCategory?.toLowerCase() || "",
  );

  /* ---------------- FLAGS ---------------- */
  const [isFeatured, setIsFeatured] = useState(!!productDetails?.isFeatured);
  const [isPublished, setIsPublished] = useState(!!productDetails?.isPublished);

  /* ---------------- ARRAYS ---------------- */
  const [fashion, setFashion] = useState(productDetails?.fashion || []);
  const [food, setFood] = useState(productDetails?.food || []);
  const [tags, setTags] = useState(productDetails?.tags || []);

  /* ---------------- IMAGES ---------------- */
  const [existingImages, setExistingImages] = useState(
    productDetails?.images || [],
  );
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  /* ---------------- DESCRIPTION ---------------- */
  const [description, setDescription] = useState(
    productDetails?.description || "",
  );
  const [bulletDescription, setBulletDescription] = useState(
    productDetails?.bulletDescription || [""],
  );
  const [bulletKeyValueDescription, setBulletKeyValueDescription] = useState(
    productDetails?.bulletKeyValueDescription || [{ key: "", value: "" }],
  );
  const [metaTitle, setMetaTitle] = useState(productDetails?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(
    productDetails?.metaDescription || "",
  );

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!window.confirm("Are you sure you want to update this product?")) {
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();

      formData.append("id", productDetails._id);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("mainCategory", mainCategory);
      formData.append("category", category);
      formData.append("material", material);
      formData.append("brand", brand);
      formData.append("weight", weight);
      formData.append("rating", String(rating));
      formData.append("countryOfOrigin", countryOfOrigin);
      formData.append("metaTitle", metaTitle);
      formData.append("metaDescription", metaDescription);
      formData.append("isFeatured", String(isFeatured));
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
              price: v.price || [],
              offerPrice: v.offerPrice || [],
              stock: v.stock || 0,
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
              price: f.price || [],
              offerPrice: f.offerPrice || [],
              batchNumber: f.batchNumber || "",
              stock: f.stock || 0,
            }),
          );
        });
      }

      // New images
      images.forEach(
        (file) => file instanceof File && formData.append("images", file),
      );

      // Existing Images (send only URLs of remaining images)
      if (existingImages && existingImages.length) {
        existingImages.forEach((img) => {
          formData.append("existingImages[]", img.url);
        });
      }

      // ======== Debugging: Images ========
      console.group("===== Images Debug =====");

      // New Files
      if (images.length) {
        console.log("Newly Added Files:");
        images.forEach((file, i) => {
          console.log(i, file.name, file.size + " bytes", file.type);
        });
      } else {
        console.log("No new files added.");
      }

      // Existing Images
      if (existingImages.length) {
        console.log("Existing Images:");
        existingImages.forEach((img, i) => {
          console.log(
            i,
            "URL:",
            img.url,
            "| altText:",
            img.altText || "No altText",
          );
        });
      } else {
        console.log("No existing images remaining.");
      }

      console.groupEnd();

      // ======== Debug: FormData Summary ========
      console.group("===== FormData Summary =====");
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(key, "(File):", value.name);
        } else {
          console.log(key, value);
        }
      }
      console.groupEnd();

      // Call API action
      const { status, message } = await updateProductAction(formData);
      if (status === 200 || status === 201) {
        toast.success(message || "Product updated successfully!");
      } else {
        toast.error(message || "Failed to update product");
      }
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(productDetails._id);
    toast.success("Product ID copied to clipboard");
  };

  return (
    <div className="relative min-h-screen bg-muted/40">
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
          <div className="flex items-end gap-4">
            <h2 className="text-4xl font-bold tracking-tight leading-none">
              Edit Product
            </h2>

            <p
              onClick={handleCopy}
              title="Click to copy ID"
              className="select-none flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover:text-foreground transition border px-2 py-1 rounded-md"
            >
              {productDetails._id}
              <FaCopy className="text-[12px]" />
            </p>
          </div>

          <Badge variant="secondary">Admin Panel</Badge>
        </div>
        <Separator />

        {/* MAIN CONTROLS */}
        <Card>
          <CardHeader>
            <CardTitle>Main Controls</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3">
              <Select
                disabled
                value={mainCategory}
                onValueChange={setMainCategory}
              >
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
                />{" "}
                Featured
              </label>
              <label className="flex items-center gap-2">
                <Checkbox
                  checked={isPublished}
                  onCheckedChange={setIsPublished}
                />{" "}
                Published
              </label>
            </div>
          </CardContent>
        </Card>

        {/* PRODUCT INFO */}
        {mainCategory && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Product Info</CardTitle>
              </CardHeader>
              <CardContent>
                <SectionOne
                  name={name}
                  setName={setName}
                  countryOfOrigin={countryOfOrigin}
                  setCountryOfOrigin={setCountryOfOrigin}
                  category={category}
                  setCategory={setCategory}
                  weight={weight}
                  setWeight={setWeight}
                  rating={rating}
                  setRating={setRating}
                  tags={tags}
                  setTags={setTags}
                  brand={brand}
                  setBrand={setBrand}
                  material={material}
                  setMaterial={setMaterial}
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
                  existingImages={existingImages}
                  setExistingImages={setExistingImages}
                  fileInputRef={fileInputRef}
                />
              </CardContent>
            </Card>
          </>
        )}

        {/* SUBMIT */}
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
              {loading ? "Updating Product..." : "Update Product"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
