"use client";

import { useState, useRef } from "react";
import { updateProductAction } from "@/actions/adminProducts";
import { toast } from "sonner";
import SectionOne from "../UI/AdminEditSections/SectionOne";
import SectionTwo from "../UI/AdminEditSections/SectionTwo";

const csv = (arr) => (Array.isArray(arr) ? arr.join(", ") : arr || "");

const EditProductPage = ({ productDetails }) => {
  const [loading, setLoading] = useState(false);
  /* ---------------- BASIC ---------------- */
  const [name, setName] = useState(productDetails.name || "");
  const [description, setDescription] = useState(
    productDetails.description || "",
  );
  const [originalPrice, setOriginalPrice] = useState(
    productDetails.originalPrice || 0,
  );
  const [price, setPrice] = useState(productDetails.price || 0);
  const [stock, setStock] = useState(productDetails.stock || 0);

  /* ---------------- CSV FIELDS ---------------- */
  const [size, setSize] = useState(csv(productDetails.size));
  const [tags, setTags] = useState(csv(productDetails.tags));
  const [color, setColor] = useState(csv(productDetails.color));
  const [material, setMaterial] = useState(csv(productDetails.material));
  const [brand, setBrand] = useState(csv(productDetails.brand));

  /* ---------------- SELECTS ---------------- */
  const [gender, setGender] = useState(productDetails.gender || "");
  const [category, setCategory] = useState(productDetails.category || "");
  const [weight, setWeight] = useState(productDetails.weight || "");

  /* ---------------- META ---------------- */
  const [metaTitle, setMetaTitle] = useState(productDetails.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(
    productDetails.metaDescription || "",
  );
  const [metaKeywords, setMetaKeywords] = useState(
    csv(productDetails.metaKeywords),
  );

  /* ---------------- DIMENSIONS ---------------- */
  const [dimensions, setDimensions] = useState({
    length: productDetails.dimensions?.length || "",
    width: productDetails.dimensions?.width || "",
    height: productDetails.dimensions?.height || "",
  });

  /* ---------------- FLAGS ---------------- */
  const [isFeatured, setIsFeatured] = useState(
    productDetails.isFeatured ?? false,
  );
  const [isPublished, setIsPublished] = useState(
    productDetails.isPublished ?? false,
  );

  /* ---------------- IMAGES ---------------- */
  // URLs already in DB
  const [existingImages, setExistingImages] = useState(
    productDetails.images || [],
  );

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
      "Are you sure you want to update this product?",
    );
    if (!confirmUpdate) {
      setLoading(false);
      return;
    }

    const formData = new FormData();

    /* ID */
    formData.append("id", productDetails._id);

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

    /* EXISTING IMAGES (KEEP THESE) */
    existingImages.forEach((img) => {
      formData.append("existingImages[]", img.url);
    });

    /* NEW IMAGES ONLY */
    images.forEach((file) => {
      if (file instanceof File) {
        formData.append("images", file);
      }
    });

    const { status } = await updateProductAction(formData);

    if (status === 200 || status === 201) {
      setLoading(false);
      toast.success("Product updated successfully!");
    } else {
      setLoading(false);
      toast.error("Failed to update product");
    }
  };

  return (
    <div className="relative">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-t-indigo-500 border-gray-200 rounded-full animate-spin"></div>
        </div>
      )}
      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6">Edit Product</h2>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* IMAGES + TAGS */}
            <SectionOne
              images={images}
              setImages={setImages}
              existingImages={existingImages}
              setExistingImages={setExistingImages}
              fileInputRef={fileInputRef}
              tags={tags}
              setTags={setTags}
            />

            {/* PRODUCT DETAILS */}
            <SectionTwo
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductPage;
