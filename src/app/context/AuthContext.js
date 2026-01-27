"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Create context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  // Fetch current user from backend
  const fetchCurrentUser = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/currentUser", {
        method: "GET",
        cache: "no-store",
        credentials: "include",
      });

      const data = await res.json();
      setCurrentUser(data.user || null);
    } catch (err) {
      console.error("Auth fetch error:", err);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Refresh user data
  const refreshCurrentUser = () => fetchCurrentUser();

  // Logout function
  const logout = async () => {
    setLoggingOut(true);
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(data.message || "Logged out successfully");
        setCurrentUser(null); // update context
        router.replace("/login");
      } else {
        toast.error(data.message || "Logout failed");
      }
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Logout failed due to server error");
    } finally {
      setLoggingOut(false);
    }
  };

  // Fetch user on mount
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        refreshCurrentUser,
        logout,
        loading,
        loggingOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to access context
export const useAuth = () => useContext(AuthContext);
