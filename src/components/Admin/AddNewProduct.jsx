"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import SectionOne from "../UI/AdminNewProductSection/SectionOne";
import SectionTwo from "../UI/AdminNewProductSection/SectionTwo";
import { createProductAction } from "@/actions/adminProducts";

const csv = (arr) => (Array.isArray(arr) ? arr.join(", ") : arr || "");

const AddNewProduct = () => {
  const [loading, setLoading] = useState(false);

  /* ---------------- BASIC ---------------- */
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [countryOfOrigin, setCountryOfOrigin] = useState("");
  const [gender, setGender] = useState("");
  const [price, setPrice] = useState(0);
  const [offerPrice, setOfferPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [rating, setRating] = useState(0);

  /* ---------------- CSV FIELDS ---------------- */
  const [size, setSize] = useState(csv());
  const [tags, setTags] = useState(csv());
  const [color, setColor] = useState(csv());
  const [material, setMaterial] = useState(csv());
  const [bulletDescription, setBulletDescription] = useState([""]);
  const [bulletKeyValueDescription, setBulletKeyValueDescription] = useState([
    { key: "", value: "" },
  ]);

  /* ---------------- SELECTS ---------------- */
  const [mainCategory, setMainCategory] = useState("");
  const [category, setCategory] = useState("");
  const [weight, setWeight] = useState("");
  const [brand, setBrand] = useState("");

  /* ---------------- META ---------------- */
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  /* ---------------- DIMENSIONS ---------------- */
  const [dimensions, setDimensions] = useState({
    length: "",
    width: "",
    height: "",
  });

  /* ---------------- CATEGORY-SPECIFIC ---------------- */
  const [sku, setSku] = useState("");
  const [foodType, setFoodType] = useState("");
  const [taste, setTaste] = useState("");

  /* ---------------- FLAGS ---------------- */
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  /* ---------------- IMAGES ---------------- */
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

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

  const logFormData = (fd) => {
    console.log("FormData entries:");
    for (let [key, value] of fd.entries()) {
      console.log(key, value);
    }
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const confirmUpdate = window.confirm(
      "Are you sure you want to create this product?",
    );
    if (!confirmUpdate) {
      setLoading(false);
      return;
    }

    const formData = new FormData();

    /* Append all your fields here... */
    formData.append("name", name);
    formData.append("description", description);
    formData.append("offerPrice", offerPrice);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("gender", gender);
    formData.append("category", category);
    formData.append("weight", weight);
    formData.append("brand", brand);
    formData.append("rating", rating);
    formData.append("mainCategory", mainCategory);

    // Meta
    formData.append("metaTitle", metaTitle);
    formData.append("metaDescription", metaDescription);

    // Flags
    formData.append("isFeatured", isFeatured ? "true" : "false");
    formData.append("isPublished", isPublished ? "true" : "false");

    // Arrays
    toArray(tags).forEach((t) => formData.append("tags[]", t));
    toArray(size).forEach((s) => formData.append("size[]", s));
    toArray(color).forEach((c) => formData.append("color[]", c));
    toArray(material).forEach((m) => formData.append("material[]", m));
    bulletDescription.forEach((b) => formData.append("bulletDescription[]", b));
    bulletKeyValueDescription.forEach((b) =>
      formData.append("bulletKeyValueDescription[]", JSON.stringify(b)),
    );

    // Dimensions
    formData.append("dimensions[length]", dimensions.length);
    formData.append("dimensions[width]", dimensions.width);
    formData.append("dimensions[height]", dimensions.height);

    // Category-specific
    formData.append("sku", sku);
    formData.append("foodType", foodType);
    formData.append("taste", taste);

    // Images
    images.forEach((file) => {
      if (file instanceof File) formData.append("images", file);
    });

    try {
      const { status, message } = await createProductAction(formData);

      if (status === 200 || status === 201) {
        toast.success(message || "Product created successfully!");
        // Optional: reset form here
      } else {
        toast.error(message || "Failed to create product!");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error(
        error?.message || "Something went wrong while creating the product.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {loading && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-t-indigo-500 border-gray-200 rounded-full animate-spin" />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="container mx-auto p-6 space-y-8"
      >
        <h2 className="text-3xl font-bold">Add New Product</h2>

        <SectionOne
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}
          countryOfOrigin={countryOfOrigin}
          setCountryOfOrigin={setCountryOfOrigin}
          bulletKeyValueDescription={bulletKeyValueDescription}
          setBulletKeyValueDescription={setBulletKeyValueDescription}
          bulletDescription={bulletDescription}
          setBulletDescription={setBulletDescription}
          offerPrice={offerPrice}
          setOfferPrice={setOfferPrice}
          price={price}
          setPrice={setPrice}
          tags={tags}
          setTags={setTags}
          stock={stock}
          setStock={setStock}
          size={size}
          setSize={setSize}
          color={color}
          setColor={setColor}
          rating={rating}
          setRating={setRating}
          material={material}
          setMaterial={setMaterial}
          brand={brand}
          setBrand={setBrand}
          gender={gender}
          setGender={setGender}
          mainCategory={mainCategory}
          setMainCategory={setMainCategory}
          category={category}
          setCategory={setCategory}
          weight={weight}
          setWeight={setWeight}
          metaTitle={metaTitle}
          setMetaTitle={setMetaTitle}
          metaDescription={metaDescription}
          setMetaDescription={setMetaDescription}
          dimensions={dimensions}
          setDimensions={setDimensions}
          isFeatured={isFeatured}
          setIsFeatured={setIsFeatured}
          isPublished={isPublished}
          setIsPublished={setIsPublished}
          sku={sku}
          setSku={setSku}
          foodType={foodType}
          setFoodType={setFoodType}
          taste={taste}
          setTaste={setTaste}
        />

        <SectionTwo
          images={images}
          setImages={setImages}
          fileInputRef={fileInputRef}
        />
      </form>
    </div>
  );
};

export default AddNewProduct;
