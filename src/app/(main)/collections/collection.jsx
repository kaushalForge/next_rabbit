"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductByFilters } from "@/redux/slices/productSlice";
import FilterSidebar from "@/components/Products/FilterSidebar";
import SortOptions from "@/components/Products/SortOptions";
import ProductGrid from "@/components/Products/ProductGrid";
import { useSearchParams } from "next/navigation";

export default function CollectionClient({ initialProducts }) {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    if (initialProducts?.length) {
      dispatch({
        type: "products/fetchByFilters/fulfilled",
        payload: initialProducts,
      });
    }
  }, [dispatch, initialProducts]);

  // refetch when URL changes (NO reload, NO jitter)
  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    dispatch(fetchProductByFilters(params));
  }, [searchParams, dispatch]);

  return (
    <div className="flex gap-6">
      <FilterSidebar />
      <div className="flex-1">
        <SortOptions />
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
