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
    { rejectWithValue },
  ) => {
    try {
      const query = new URLSearchParams();

      if (collection && collection !== "all")
        query.append("collection", collection);
      if (category) query.append("category", category);
      if (gender) query.append("gender", gender);
      if (sortBy) query.append("sortBy", sortBy);
      if (search) query.append("search", search);

      if (minPrice > 0) query.append("minPrice", minPrice);
      if (maxPrice < 100) query.append("maxPrice", maxPrice);

      if (size?.length) query.append("size", size.join(","));
      if (color?.length) query.append("color", color.join(","));
      if (brand?.length) query.append("brand", brand.join(","));
      if (material?.length) query.append("material", material.join(","));

      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/search?${query.toString()}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message },
      );
    }
  },
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
