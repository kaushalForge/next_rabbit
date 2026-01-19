import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProductByFilters = createAsyncThunk(
  "products/fetchByFilters",
  async (
    {
      collection,
      category,
      gender,
      sortBy,
      search,
      minPrice,
      maxPrice,
      size,
      color,
      brand,
      material,
    },
    { rejectWithValue }
  ) => {
    try {
      const query = new URLSearchParams();

      if (collection && collection !== "all") query.set("collection", collection);
      if (category) query.set("category", category);
      if (gender) query.set("gender", gender);
      if (sortBy) query.set("sortBy", sortBy);
      if (search) query.set("search", search);

      if (typeof minPrice === "number" && minPrice > 0) query.set("minPrice", minPrice);
      if (typeof maxPrice === "number" && maxPrice < 100) query.set("maxPrice", maxPrice);

      if (Array.isArray(size) && size.length) query.set("size", size.join(","));
      if (Array.isArray(color) && color.length) query.set("color", color.join(","));
      if (Array.isArray(brand) && brand.length) query.set("brand", brand.join(","));
      if (Array.isArray(material) && material.length) query.set("material", material.join(","));

      // ✅ Use relative URL if your backend is exposed via /api in the same domain
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
      const url = `${baseUrl}/api/products/search?${query.toString()}`;

      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      // Make sure we handle both Axios errors and generic errors
      return rejectWithValue(
        error.response?.data || { message: error.message || "Something went wrong" }
      );
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    loading: false,
    error: null,
    filters: {
      collection: "all",
      category: "",
      gender: "",
      sortBy: "",
      search: "",
      minPrice: 0,
      maxPrice: 100,
      size: [],
      color: [],
      brand: [],
      material: [],
    },
  },
  reducers: {
    setSearch(state, action) {
      state.filters.search = action.payload;
    },

    resetFilters(state) {
      state.filters = {
        collection: "all",
        category: "",
        gender: "",
        sortBy: "",
        search: "",
        minPrice: 0,
        maxPrice: 100,
        size: [],
        color: [],
        brand: [],
        material: [],
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductByFilters.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductByFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProductByFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearch, resetFilters } = productsSlice.actions;
export default productsSlice.reducer;
