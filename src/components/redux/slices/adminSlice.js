"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ---------------------- Async Thunks ----------------------

// Fetch all users
export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("userToken") : null;

      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/api`, {
        headers: {
          authorization: token || "",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      return rejectWithValue(error.response?.data || { message: "Failed to fetch users" });
    }
  }
);

// Fetch all products
export const fetchProducts = createAsyncThunk(
  "admin/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("userToken") : null;

      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/api`, {
        headers: {
          authorization: token || "",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      return rejectWithValue(error.response?.data || { message: "Failed to fetch products" });
    }
  }
);

// Update a product (admin)
export const updateProduct = createAsyncThunk(
  "admin/updateProduct",
  async ({ productData, id }, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("userToken") : null;

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/product/${id}`,
        productData,
        {
          headers: {
            authorization: token || "",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error updating product:", error);
      return rejectWithValue(error.response?.data || { message: "Failed to update product" });
    }
  }
);

// ---------------------- Slice ----------------------

const initialState = {
  allUsersData: [],
  allProductsData: [],
  totalProducts: 0,
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.allUsersData = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error?.message || "Error fetching users";
      })

      // fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.allProductsData = Array.isArray(action.payload) ? action.payload : [];
        state.totalProducts = state.allProductsData.length;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || action.error?.message || "Error fetching products";
      })

      // update product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const updatedIndex = state.allProductsData.findIndex(
          (prod) => prod._id === action.payload._id
        );
        if (updatedIndex !== -1) {
          state.allProductsData[updatedIndex] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error?.message || "Error updating product";
      });
  },
});

// ---------------------- Exports ----------------------
export default adminSlice.reducer;
