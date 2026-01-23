"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { fetchCurrentUser, handleLogoutAction } from "@/actions/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshAuth = async () => {
    try {
      setLoading(true);
      const { status, result } = await fetchCurrentUser();

      if (result?.isLoggedIn && result.user) {
        setUser(result.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Auth refresh failed:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- LOGOUT ----------------
  const logout = async () => {
    try {
      setLoading(true);
      const { result, status } = await handleLogoutAction();
      setUser(null);
      console.log("logout result", result);
      return { result, status };
    } catch (err) {
      console.error("❌ Logout failed:", err);
      setUser(null);
      return {
        message: "Logout failed",
        isLoggedIn: false,
      };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refreshAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
