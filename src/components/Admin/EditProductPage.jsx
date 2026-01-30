"use client";

import { useState, useRef } from "react";
import { updateProductAction } from "@/actions/adminProducts";
import { toast } from "sonner";
import SectionOne from "../UI/AdminEditSections/SectionOne";
import SectionTwo from "../UI/AdminEditSections/SectionTwo";

/* ---------------- HELPERS ---------------- */
const csv = (arr) => (Array.isArray(arr) ? arr.join(", ") : arr || "");

const toArray = (str) =>
  typeof str === "string"
    ? str
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean)
    : [];

/* ---------------- COMPONENT ---------------- */
const EditProductPage = ({ productDetails }) => {
  const [loading, setLoading] = useState(false);

  /* ---------------- BASIC ---------------- */
  const [name, setName] = useState(productDetails.name || "");
  const [description, setDescription] = useState(
    productDetails.description || "",
  );
  const [brand, setBrand] = useState(productDetails.brand || "");
  const [countryOfOrigin, setCountryOfOrigin] = useState(
    productDetails.countryOfOrigin || "",
  );
  const [mainCategory, setMainCategory] = useState(
    productDetails.mainCategory || "",
  );
  const [rating, setRating] = useState(productDetails.rating || 0);

  /* ---------------- PRICES ---------------- */
  const [offerPrice, setOfferPrice] = useState(productDetails.offerPrice || 0);
  const [price, setPrice] = useState(productDetails.price || 0);
  const [stock, setStock] = useState(productDetails.stock || 0);

  /* ---------------- CSV INPUT STATES ---------------- */
  const [tags, setTags] = useState(csv(productDetails?.tags));
  const [size, setSize] = useState(csv(productDetails?.fashion?.size));
  const [color, setColor] = useState(csv(productDetails?.fashion?.color));
  const [material, setMaterial] = useState(
    csv(productDetails?.fashion?.material),
  );

  /* ---------------- BULLETS ---------------- */
  const [bulletDescription, setBulletDescription] = useState(
    productDetails.bulletDescription || [""],
  );
  const [bulletKeyValueDescription, setBulletKeyValueDescription] = useState(
    productDetails.bulletKeyValueDescription || [{ key: "", value: "" }],
  );

  /* ---------------- SELECTS ---------------- */
  const [gender, setGender] = useState(productDetails.gender || "");
  const [category, setCategory] = useState(productDetails.category || "");
  const [weight, setWeight] = useState(productDetails.weight || "");

  /* ---------------- META ---------------- */
  const [metaTitle, setMetaTitle] = useState(productDetails.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(
    productDetails.metaDescription || "",
  );

  /* ---------------- DIMENSIONS ---------------- */
  const [dimensions, setDimensions] = useState({
    length: productDetails?.fashion?.dimensions?.length || "",
    width: productDetails?.fashion?.dimensions?.width || "",
    height: productDetails?.fashion?.dimensions?.height || "",
  });

  /* ---------------- FLAGS ---------------- */
  const [isFeatured, setIsFeatured] = useState(
    productDetails.isFeatured ?? false,
  );
  const [isPublished, setIsPublished] = useState(
    productDetails.isPublished ?? false,
  );

  /* ---------------- IMAGES ---------------- */
  const [existingImages, setExistingImages] = useState(
    productDetails.images || [],
  );
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!window.confirm("Are you sure you want to update this product?")) {
      setLoading(false);
      return;
    }

    const formData = new FormData();

    /* ---------------- CORE ---------------- */
    formData.append("id", productDetails._id);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("brand", brand);
    formData.append("countryOfOrigin", countryOfOrigin);
    formData.append("mainCategory", mainCategory);
    formData.append("rating", rating);

    /* ---------------- PRICES ---------------- */
    formData.append("offerPrice", offerPrice);
    formData.append("price", price);
    formData.append("stock", stock);

    /* ---------------- META ---------------- */
    formData.append("metaTitle", metaTitle);
    formData.append("metaDescription", metaDescription);

    /* ---------------- FLAGS ---------------- */
    formData.append("isFeatured", String(isFeatured));
    formData.append("isPublished", String(isPublished));

    /* ---------------- BULLETS ---------------- */
    bulletDescription.forEach((b) => formData.append("bulletDescription[]", b));

    bulletKeyValueDescription.forEach((b) =>
      formData.append("bulletKeyValueDescription[]", JSON.stringify(b)),
    );

    /* ---------------- DIMENSIONS ---------------- */
    formData.append("dimensions[length]", dimensions.length);
    formData.append("dimensions[width]", dimensions.width);
    formData.append("dimensions[height]", dimensions.height);

    /* ---------------- EXISTING IMAGES ---------------- */
    existingImages.forEach((img) =>
      formData.append("existingImages[]", img.url || img),
    );

    /* ---------------- TAGS (FIXED) ---------------- */
    toArray(tags).forEach((tag) => formData.append("tags[]", tag));

    /* ---------------- NEW IMAGES ---------------- */
    images.forEach((file) => {
      if (file instanceof File) {
        formData.append("images", file);
      }
    });

    /* ---------------- CATEGORY-SPECIFIC ---------------- */

    // 🔹 Fashion ONLY
    if (/^fashion$/i.test(mainCategory)) {
      formData.append("gender", gender);

      toArray(color).forEach((c) => formData.append("color[]", c));

      toArray(size).forEach((s) => formData.append("size[]", s));

      toArray(material).forEach((m) => formData.append("material[]", m));
    }

    // 🔹 Food ONLY
    if (/^food$/i.test(mainCategory)) {
      formData.append("sku", productDetails.food?.sku || "");
      formData.append("foodType", productDetails.food?.foodType || "");
      formData.append("taste", productDetails.food?.taste || "");
    }

    try {
      const { status } = await updateProductAction(formData);

      if (status === 200 || status === 201) {
        toast.success("Product updated successfully!");
      } else {
        toast.error("Failed to update product");
      }
    } catch (err) {
      console.error("UPDATE PRODUCT ERROR:", err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="relative">
      {loading && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-t-indigo-500 border-gray-200 rounded-full animate-spin" />
        </div>
      )}

      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6">Edit Product</h2>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="grid lg:grid-cols-3 gap-8">
            <SectionOne
              images={images}
              setImages={setImages}
              existingImages={existingImages}
              setExistingImages={setExistingImages}
              fileInputRef={fileInputRef}
              tags={tags}
              setTags={setTags}
            />

            <SectionTwo
              name={name}
              setName={setName}
              description={description}
              setDescription={setDescription}
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
              bulletDescription={bulletDescription}
              setBulletDescription={setBulletDescription}
              bulletKeyValueDescription={bulletKeyValueDescription}
              setBulletKeyValueDescription={setBulletKeyValueDescription}
              mainCategory={mainCategory}
              setMainCategory={setMainCategory}
              rating={rating}
              setRating={setRating}
              countryOfOrigin={countryOfOrigin}
              setCountryOfOrigin={setCountryOfOrigin}
              offerPrice={offerPrice}
              setOfferPrice={setOfferPrice}
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
