"use client";

import { useState, useRef } from "react";
import { createProductAction } from "@/actions/adminProducts";
import { toast } from "sonner";
import SectionOne from "../UI/AdminNewProductSection/SectionOne";
import SectionTwo from "../UI/AdminNewProductSection/SectionTwo";

const AddNewProduct = () => {
  // ---------------- CORE ----------------
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [material, setMaterial] = useState("");
  const [brand, setBrand] = useState("");
  const [tags, setTags] = useState([]);
  const [gender, setGender] = useState("");
  const [category, setCategory] = useState("");
  const [weight, setWeight] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  const [dimensions, setDimensions] = useState({
    length: "",
    width: "",
    height: "",
  });
  const [images, setImages] = useState([]);

  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  // ---------------- MEDIA ----------------
  const fileInputRef = useRef(null);

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !price) {
      return toast.error("Required fields missing");
    }

    const formData = new FormData();

    const formFields = {
      name,
      description,
      originalPrice,
      price,
      stock,
      size,
      color,
      material,
      brand,
      tags,
      gender,
      category,
      weight,
      metaTitle,
      metaDescription,
      metaKeywords,
      dimensions,
      isFeatured,
      isPublished,
    };

    Object.entries(formFields).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(`${key}[]`, v));
      } else if (typeof value === "object") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });

    // Append each image individually
    images.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const { status, message } = await createProductAction(formData);

      if (status === 201 || status === 200) {
        toast.success("Product created successfully");
      } else {
        toast.error(message || "Failed to create product");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to create product");
    }
  };

  return (
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
        tags={tags}
        setTags={setTags}
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
  );
};

export default AddNewProduct;
