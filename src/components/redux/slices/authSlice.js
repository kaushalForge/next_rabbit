"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ---------------------- Helper functions ----------------------

// Safely get user from localStorage
const getUserFromStorage = () => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("userInfo");
    return user ? JSON.parse(user) : null;
  }
  return null;
};

// Safely get guestId from localStorage
const getGuestIdFromStorage = () => {
  if (typeof window !== "undefined") {
    let guestId = localStorage.getItem("guestId");
    if (!guestId) {
      guestId = `guest_${Date.now()}`;
      localStorage.setItem("guestId", guestId);
    }
    return guestId;
  }
  return `guest_${Date.now()}`;
};

// Check if user is admin
const checkIsAdmin = () => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("userInfo");
    return user ? JSON.parse(user)?.role === "admin" : false;
  }
  return false;
};

// ---------------------- Initial State ----------------------

const initialState = {
  user: getUserFromStorage(),
  guestId: getGuestIdFromStorage(),
  userRoleData: null,
  isAdmin: checkIsAdmin(),
  allUserData: [],
  loading: false,
  error: null,
};

// ---------------------- Async Thunks ----------------------

// Login User
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/login`,
        userData,
        { withCredentials: true },
      );

      // ✅ Only store non-sensitive data
      if (typeof window !== "undefined") {
        localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      }

      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message },
      );
    }
  },
);

// Register User
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/register`,
        userData,
      );
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message },
      );
    }
  },
);

// Update User Role
export const userRole = createAsyncThunk(
  "auth/userRole",
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/update-role`,
        { userId, role },
        {
          headers: {
            authorization:
              typeof window !== "undefined"
                ? localStorage.getItem("userToken")
                : "",
          },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Error updating role" },
      );
    }
  },
);

// ---------------------- Slice ----------------------

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAdmin = false;
      state.guestId = `guest_${Date.now()}`;
      if (typeof window !== "undefined") {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("userToken");
        localStorage.setItem("guestId", state.guestId);
      }
    },
    generateNewGuestId: (state) => {
      state.guestId = `guest_${Date.now()}`;
      if (typeof window !== "undefined") {
        localStorage.setItem("guestId", state.guestId);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAdmin = action.payload?.role === "admin";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Registration failed";
      })

      // Update Role
      .addCase(userRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userRole.fulfilled, (state, action) => {
        state.loading = false;
        state.userRoleData = action.payload;
      })
      .addCase(userRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Role update failed";
      });
  },
});

// ---------------------- Exports ----------------------

export const { logout, generateNewGuestId } = authSlice.actions;
export default authSlice.reducer;
