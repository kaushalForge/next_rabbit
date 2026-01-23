import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});

// ---------------------- Async Thunks ----------------------

// Fetch all users
export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/admin/users/all");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch users" },
      );
    }
  },
);

// Fetch all products
export const fetchProducts = createAsyncThunk(
  "admin/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/admin/products/all");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch products" },
      );
    }
  },
);

// Update product
export const updateProduct = createAsyncThunk(
  "admin/updateProduct",
  async ({ productData, id }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(
        `/api/admin/products/update/${id}`,
        productData,
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update product" },
      );
    }
  },
);

// Delete user
export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await api.delete("/api/admin/users/delete", {
        data: { userId },
      });
      return { data, userId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Error deleting user" },
      );
    }
  },
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
      // USERS
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.allUsersData = action.payload || [];
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // PRODUCTS
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.allProductsData = action.payload || [];
        state.totalProducts = state.allProductsData.length;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // UPDATE PRODUCT → reload (if running client-side)
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.allProductsData.findIndex(
          (p) => p._id === action.payload?._id,
        );
        if (index !== -1) {
          state.allProductsData[index] = action.payload;
        }
      })

      // DELETE USER → reload (if running client-side)
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.allUsersData = state.allUsersData.filter(
          (u) => u._id !== action.payload.userId,
        );
      });
  },
});

export default adminSlice.reducer;
