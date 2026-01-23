"use client";

import { useEffect, useState } from "react";
import CollectionPage from "@/components/pages/Collections/CollectionPage";
import { fetchAllProductsAction } from "@/actions/userProducts";
import { useSearchParams } from "next/navigation";

export default function AllCollectionPageClient() {
  const [products, setProducts] = useState([]);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      // Get all search params from URL
      const collection = searchParams.get("collection");
      const search = searchParams.get("search");
      const category = searchParams.get("category");
      const gender = searchParams.get("gender");
      const color = searchParams.get("color"); // comma-separated
      const size = searchParams.get("size"); // comma-separated
      const brand = searchParams.get("brand"); // comma-separated
      const material = searchParams.get("material"); // comma-separated
      const minPrice = searchParams.get("minPrice");
      const maxPrice = searchParams.get("maxPrice");
      const sortBy = searchParams.get("sortBy");
      const limit = searchParams.get("limit");

      // Build URLSearchParams for backend
      const params = new URLSearchParams();
      if (collection) params.set("collection", collection);
      if (search) params.set("search", search);
      if (category) params.set("category", category);
      if (gender) params.set("gender", gender);
      if (color) params.set("color", color); // e.g., "White,Red"
      if (size) params.set("size", size);
      if (brand) params.set("brand", brand);
      if (material) params.set("material", material);
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);
      if (sortBy) params.set("sortBy", sortBy);
      if (limit) params.set("limit", limit);
      const queryString = params.toString();

      try {
        const res = await fetchAllProductsAction(queryString);
        console.log("Fetched products:", res);
        setProducts(Array.isArray(res) ? res : res.products || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchData();
  }, [searchParams.toString()]);

  return <CollectionPage products={products} />;
}
