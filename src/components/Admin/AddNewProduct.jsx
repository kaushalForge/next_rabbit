"use client";

import { useState, useRef } from "react";
import { createProductAction } from "@/actions/adminProducts";
import { toast } from "sonner";
import SectionOne from "../UI/AdminNewProductSection/SectionOne";
import SectionTwo from "../UI/AdminNewProductSection/SectionTwo";

const csv = (arr) => (Array.isArray(arr) ? arr.join(", ") : arr || "");

const AddNewProduct = () => {
  const [loading, setLoading] = useState(false);
  /* ---------------- BASIC ---------------- */
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [originalPrice, setOriginalPrice] = useState(0);
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);

  /* ---------------- CSV FIELDS ---------------- */
  const [size, setSize] = useState(csv());
  const [tags, setTags] = useState(csv());
  const [color, setColor] = useState(csv());
  const [material, setMaterial] = useState(csv());
  const [brand, setBrand] = useState(csv());

  /* ---------------- SELECTS ---------------- */
  const [gender, setGender] = useState("");
  const [category, setCategory] = useState("");
  const [weight, setWeight] = useState("");

  /* ---------------- META ---------------- */
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState(csv());

  /* ---------------- DIMENSIONS ---------------- */
  const [dimensions, setDimensions] = useState({
    length: "",
    width: "",
    height: "",
  });

  /* ---------------- FLAGS ---------------- */
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  // New uploaded files
  const [images, setImages] = useState([]);

  const fileInputRef = useRef(null);

  /* ---------------- HELPERS ---------------- */
  const toArray = (str) =>
    str
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);

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

    /* BASIC */
    formData.append("name", name);
    formData.append("description", description);
    formData.append("originalPrice", originalPrice);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("gender", gender);
    formData.append("category", category);
    formData.append("weight", weight);
    /* META */
    formData.append("metaTitle", metaTitle);
    formData.append("metaDescription", metaDescription);

    toArray(metaKeywords).forEach((k) => formData.append("metaKeywords[]", k));

    /* FLAGS */
    formData.append("isFeatured", isFeatured ? "true" : "false");
    formData.append("isPublished", isPublished ? "true" : "false");

    /* ARRAYS */
    toArray(tags).forEach((t) => formData.append("tags[]", t));
    toArray(size).forEach((s) => formData.append("size[]", s));
    toArray(color).forEach((c) => formData.append("color[]", c));
    toArray(material).forEach((m) => formData.append("material[]", m));
    toArray(brand).forEach((b) => formData.append("brand[]", b));

    /* DIMENSIONS */
    formData.append("dimensions[length]", dimensions.length);
    formData.append("dimensions[width]", dimensions.width);
    formData.append("dimensions[height]", dimensions.height);

    /* NEW IMAGES ONLY */
    images.forEach((file) => {
      if (file instanceof File) {
        formData.append("images", file);
      }
    });

    const { status, message } = await createProductAction(formData);

    if (status === 200 || status === 201) {
      setLoading(false);
      toast.success(message || "Product created successfully!");
    } else if (status !== 200 || status !== 201) {
      setLoading(false);
      toast.warning(message || "Product created successfully!");
    } else {
      setLoading(false);
      toast.success(message || "Failed to create product!");
    }
  };
  /* ================== JSX ================== */
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
          originalPrice={originalPrice}
          setOriginalPrice={setOriginalPrice}
          price={price}
          setPrice={setPrice}
          stock={stock}
          setStock={setStock}
          size={size}
          setSize={setSize}
          color={color}
          setColor={setColor}
          material={material}
          setMaterial={setMaterial}
          brand={brand}
          setBrand={setBrand}
          gender={gender}
          setGender={setGender}
          category={category}
          setCategory={setCategory}
          weight={weight}
          setWeight={setWeight}
          metaTitle={metaTitle}
          setMetaTitle={setMetaTitle}
          metaDescription={metaDescription}
          setMetaDescription={setMetaDescription}
          metaKeywords={metaKeywords}
          setMetaKeywords={setMetaKeywords}
          dimensions={dimensions}
          setDimensions={setDimensions}
          isFeatured={isFeatured}
          setIsFeatured={setIsFeatured}
          isPublished={isPublished}
          setIsPublished={setIsPublished}
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
