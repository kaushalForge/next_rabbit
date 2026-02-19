import React, { useState, useEffect, Suspense } from "react";
import Hero from "../Layout/Hero";
import GenderCollectionSection from "../components/Layout/GenderCollectionSection";

import NewArrivals from "../Products/NewArrivals";
import ProductDetails from "../components/Layout/ProductDetails";
import FeaturedCollection from "../components/Products/FeaturedCollection";
import FeaturedSection from "../components/Products/FeaturedSection";
import ProductGrid from "../components/Common/ProductGrid";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductByFilters } from "../redux/slices/productSlice";
import { Spinner } from "../ui/spinner";

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [bestSeller, setBestSeller] = useState(null);

  useEffect(() => {
    dispatch(
      fetchProductByFilters({
        gender: "Female",
        category: "Top Wear",
        limit: 8,
      }),
    );
    const fetchBestSeller = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/products/best-seller`,
        );
        setBestSeller(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBestSeller();
  }, [dispatch]);

  return (
    <>
      <Hero />
      <GenderCollectionSection />
      <Suspense fallback={<Spinner />}>
        <NewArrivals />
      </Suspense>
      {bestSeller ? (
        <ProductDetails productId={bestSeller._id} />
      ) : (
        <p className="text-center">Loading Best-Seller...</p>
      )}

      <div className="container mx-auto">
        {products.length !== 0 && (
          <h2 className="text-center w-full text-3xl font-semibold mb-4">
            Womens Collection!
            <ProductGrid products={products} loading={loading} error={error} />
          </h2>
        )}
      </div>
      <FeaturedCollection />
      <FeaturedSection />
    </>
  );
};

export default Home;
