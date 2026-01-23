"use client";

import { useState } from "react";
import { updateProductAction } from "@/actions/adminProducts";
import { toast } from "sonner";
import SectionOne from "../UI/AdminEditSections/SectionOne";
import SectionTwo from "../UI/AdminEditSections/SectionTwo";

const EditProductPage = ({ productDetails }) => {
  /* ---------------- CORE ---------------- */
  const [name, setName] = useState(productDetails?.name || "");
  const [description, setDescription] = useState(
    productDetails?.description || "",
  );
  const [originalPrice, setOriginalPrice] = useState(
    productDetails?.originalPrice || 0,
  );
  const [price, setPrice] = useState(productDetails?.price || 0);
  const [stock, setStock] = useState(productDetails?.stock || 0);

  /* ---------------- ARRAYS (CSV IN UI) ---------------- */
  const csv = (arr) => (Array.isArray(arr) ? arr.join(", ") : "");

  const [size, setSize] = useState(csv(productDetails?.size));
  const [tags, setTags] = useState(csv(productDetails?.tags));
  const [color, setColor] = useState(csv(productDetails?.color));
  const [material, setMaterial] = useState(csv(productDetails?.material));
  const [brand, setBrand] = useState(csv(productDetails?.brand));

  /* ---------------- SELECT / TEXT ---------------- */
  const [gender, setGender] = useState(productDetails?.gender || "");
  const [category, setCategory] = useState(productDetails?.category || "");
  const [weight, setWeight] = useState(productDetails?.weight || "");

  /* ---------------- META ---------------- */
  const [metaTitle, setMetaTitle] = useState(productDetails?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(
    productDetails?.metaDescription || "",
  );
  const [metaKeywords, setMetaKeywords] = useState(
    productDetails?.metaKeywords || "",
  );

  /* ---------------- DIMENSIONS ---------------- */
  const [dimensions, setDimensions] = useState({
    length: productDetails?.dimensions?.length || "",
    width: productDetails?.dimensions?.width || "",
    height: productDetails?.dimensions?.height || "",
  });

  /* ---------------- FLAGS ---------------- */
  const [isFeatured, setIsFeatured] = useState(
    productDetails?.isFeatured ?? false,
  );
  const [isPublished, setIsPublished] = useState(
    productDetails?.isPublished ?? false,
  );

  /* ---------------- MEDIA ---------------- */
  const [images, setImages] = useState(
    productDetails?.images?.slice(0, 6) || [],
  );
  const [activeIndex, setActiveIndex] = useState(0);

  /* ---------------- SUBMIT ---------------- */
  const toArray = (str) =>
    str
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      _id: productDetails._id,
      name,
      description,
      originalPrice: Number(originalPrice),
      price: Number(price),
      stock: Number(stock),
      tags: toArray(tags),
      size: toArray(size),
      color: toArray(color),
      material: toArray(material),
      brand: toArray(brand),
      gender,
      category,
      weight,
      metaTitle,
      metaDescription,
      metaKeywords,
      dimensions: {
        length: Number(dimensions.length) || 0,
        width: Number(dimensions.width) || 0,
        height: Number(dimensions.height) || 0,
      },

      isFeatured,
      isPublished,
      images,
    };
    const confirmUpdate = window.confirm(
      "Are you sure you want to update this product?",
    );

    if (!confirmUpdate) return;

    const { status } = await updateProductAction(payload);

    if (status === 201 || status === 200) {
      toast.success("Product updated successfully!");
    } else {
      toast.error("Failed updating product!");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Edit Product</h2>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          <SectionOne
            images={images}
            setImages={setImages}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            tags={tags}
            setTags={setTags}
          />

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
  );
};

export default EditProductPage;
