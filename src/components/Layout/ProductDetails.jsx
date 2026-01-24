"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductByFilters } from "../redux/slices/productSlice";
import { addToCart, updateCartItemQuantity } from "../redux/slices/cartSlice";
import { useParams } from "next/navigation";

const ProductDetails = ({ productId, productDetail }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  // const { loading, error } = useSelector((state) => state.products);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const { user, guestId } = useSelector((state) => state.auth);

  const [activeImage, setActiveImage] = useState({
    imageURL: "",
    altText: "",
  });

  useEffect(() => {
    if (productDetail?.images?.length > 0) {
      setActiveImage({
        imageURL: productDetail.images[0].url,
        altText: productDetail.images[0].altText,
      });
    }
  }, [id, productDetail]);

  const productFetchId = productId || id;

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductByFilters(productFetchId));
      // dispatch(similarProducts({ id: productFetchId }));
    }
  }, [dispatch, productFetchId, productFetchId]);

  const handleAddToCart = () => {
    console.log("add to cart product details page");

    if (!selectedColor || !selectedSize) {
      toast.error("Please select size and color to continue!", {
        duration: 1000,
      });
      return;
    }
    dispatch(
      addToCart({
        productId: productFetchId,
        quantity,
        size: selectedSize,
        color: selectedColor,
        guestId,
        userId: user?._id,
      }),
    )
      .unwrap() // Unwraps the promise from createAsyncThunk
      .then(() => {
        toast.success("Product Added to cart!");
      })
      .catch((error) => {
        toast.error("Failed to add product to cart!");
        console.error(error);
      });
  };

  const handleQuantityChange = (action) => {
    if (action === "plus") setQuantity((prev) => prev + 1);
    if (action === "minus" && quantity > 0) setQuantity((prev) => prev - 1);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      <section className="p-6">
        {productDetail && (
          <div className="max-w-6xl mx-auto p-8">
            <div className="flex flex-col md:flex-row">
              {/* Left Thumbnails */}
              <div className="hidden md:flex flex-col space-y-4 mr-6">
                {productDetail.images?.length > 0 &&
                  productDetail.images.map((image, index) => (
                    <img
                      key={index}
                      src={image.url}
                      alt={image.altText || "Product Image"}
                      onClick={() => {
                        setActiveImage({
                          imageURL: image.url,
                          altText: image.altText,
                        });
                      }}
                      className={`h-20 w-20 rounded-lg object-cover cursor-pointer border-2 ${
                        activeImage.imageURL === image.url
                          ? "border-black"
                          : "border-gray-300"
                      }`}
                    />
                  ))}
              </div>
              {/* Main Image */}
              <div className="md:w-1/2">
                <div className="mb-4">
                  <img
                    src={
                      activeImage?.imageURL ||
                      productDetail?.images?.[0]?.url ||
                      "/images/placeholder.jpg"
                    }
                    alt={productDetail?.name || "Product Image"}
                    className="w-full h-auto object-cover rounded-lg"
                  />
                </div>
              </div>
              {/* Mobile Thumbnails */}
              <div className="flex w-full md:hidden space-x-4">
                {productDetail.images?.length > 0 &&
                  productDetail.images.map((image, index) => (
                    <img
                      key={index}
                      src={image.url}
                      alt={image.altText || "Product Image"}
                      onClick={() => {
                        setActiveImage({
                          imageURL: image.url,
                          altText: image.altText,
                        });
                      }}
                      className={`h-20 w-20 rounded-lg object-cover cursor-pointer border-2 ${
                        activeImage === image.url
                          ? "border-black"
                          : "border-gray-300"
                      }`}
                    />
                  ))}
              </div>
              {/* Right Side */}
              <div className="md:w-1/2 md:ml-10">
                <h1 className="text-2xl md:text-3xl font-semibold mb-2">
                  {productDetail.name}
                </h1>
                <p className="text-lg line-through mb-1 text-gray-600">
                  {productDetail.originalPrice &&
                    `$ ${productDetail.originalPrice}`}
                </p>
                <p className="text-lg mb-2 text-gray-500">
                  $ {productDetail.price}
                </p>
                <p className="text-sm font-medium text-gray-800 mb-4">
                  {productDetail.description}
                </p>
                <div className="mb-4">
                  <p className="text-gray-700">Color:</p>
                  <div className="flex gap-2 mt-2">
                    {productDetail?.color?.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedColor(color);
                        }}
                        className={`w-8 h-8 rounded-full border transform transition-colors duration-200 ${
                          selectedColor === color ? "ring-2 ring-black" : ""
                        }`}
                        style={{
                          backgroundColor: color.toLowerCase(),
                          filter: "brightness(0.7)",
                        }}
                      ></button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-gray-700">Size:</p>
                  <div className="flex gap-2 mb-2">
                    {productDetail?.size?.map((size, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedSize(size);
                        }}
                        className={`w-8 h-8 rounded-md border transition-colors duration-200 transform ${
                          selectedSize === size ? "bg-black text-white" : ""
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <p className="text-gray-700">Quantity:</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <button
                      onClick={() => handleQuantityChange("minus")}
                      className="px-2 bg-gray-200 rounded text-lg"
                    >
                      -
                    </button>
                    <span>{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange("plus")}
                      className="px-2 bg-gray-200 rounded text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="w-full uppercase bg-black text-white rounded text-center py-1"
                >
                  Add To Cart
                </button>
                <div className="mt-10 text-gray-700">
                  <h3 className="text-xl font-bold mb-4">Characteristics:</h3>
                  <table>
                    <tbody>
                      <tr>
                        <th className="py-1 px-4 border">Brand</th>
                        <td className="py-1 px-4 border">
                          {productDetail && productDetail.brand}
                        </td>
                      </tr>
                      <tr>
                        <th className="py-1 px-4 border">Material</th>
                        <td className="py-1 px-4 border">
                          {productDetail.material}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default ProductDetails;
