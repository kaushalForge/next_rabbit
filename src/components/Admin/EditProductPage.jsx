"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails } from "../redux/slices/productSlice";
import { updateProduct } from "../redux/slices/adminSlice";
const EditProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const productDetails = useSelector((state) => state.products.selectedProduct);

  const [productData, setProductData] = useState(null);

  useEffect(() => {
    dispatch(fetchProductDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (productDetails) {
      setProductData({
        name: productDetails.name || "",
        description: productDetails.description || "",
        price: productDetails.price || 0,
        originalPrice: productDetails.originalPrice || 0,
        countInStock: productDetails.countInStock || 0,
        sku: productDetails.sku || "",
        category: productDetails.category || "",
        brand: productDetails.brand || "",
        size: productDetails.size || [],
        color: productDetails.color || [],
        collections: productDetails.collections || "",
        material: productDetails.material || "",
        gender: productDetails.gender || "",
        images: productDetails?.images || [],
      });
    }
  }, [productDetails]);

  // console.log("Product Data: ", productDetails);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({ ...prevData, [name]: value }));
  };

  if (!productData) return <div>Loading...</div>;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Product Data: ", productData);
    dispatch(updateProduct({ productData, id: id }));
  };

  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6">Edit Product</h2>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Product Name</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Description</label>
          <textarea
            name="description"
            value={productData.description}
            rows={4}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Original Price */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Original Price</label>
          <input
            type="number"
            name="originalPrice"
            value={productData.originalPrice}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Price */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Price</label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Count In Stock */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Count in Stock</label>
          <input
            type="number"
            name="countInStock"
            value={productData.countInStock}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* SKU */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">SKU</label>
          <input
            type="text"
            name="sku"
            value={productData.sku}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Size */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Size (comma-separated)
          </label>
          <input
            type="text"
            name="size"
            value={productData?.size?.join(", ") || ""}
            onChange={(e) =>
              setProductData({
                ...productData,
                size: e.target.value
                  .split(",")
                  .map((s) => s.trim().toUpperCase()),
              })
            }
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Color */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Color (comma-separated)
          </label>
          <input
            type="text"
            name="color"
            value={productData?.color?.join(", ") || ""}
            onChange={(e) =>
              setProductData({
                ...productData,
                color: e.target.value
                  .split(",")
                  .map(
                    (c) =>
                      c.trim().charAt(0).toUpperCase() +
                      c.trim().slice(1).toLowerCase(),
                  ),
              })
            }
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Upload Image</label>
          <div className="flex gap-4 mt-4 flex-col">
            {productData.images.map((img, i) => (
              <div key={i} className="w-full h-auto object-cover rounded-md">
                <h4 className="font-medium text-lg text-[#ff4500]">
                  Image {i + 1}
                </h4>
                <input
                  type="text"
                  value={img.url}
                  onChange={(e) => {
                    const updatedImages = [...productData.images];
                    updatedImages[i] = {
                      ...updatedImages[i],
                      url: e.target.value,
                    };
                    setProductData({ ...productData, images: updatedImages });
                  }}
                  className="w-full mb-2 text-sm font-semibold border rounded-sm px-2 py-1 focus:ring-2 focus:shadow-lg focus:ring-[#ff4500] focus:outline-none"
                />

                <img src={img.url} alt="Preview" className="w-72 h-72" />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
