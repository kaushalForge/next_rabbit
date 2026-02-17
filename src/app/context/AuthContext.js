"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/actions/auth";
import { toast } from "sonner";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const router = useRouter();

  const fetchCurrentUser = async () => {
    setLoading(true);
    try {
      const res = await getCurrentUser();
      setCurrentUser(res.user || null);
    } catch {
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshCurrentUser = () => fetchCurrentUser();

  const logout = async () => {
    setLoggingOut(true);
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message);
        setCurrentUser(null);
        router.push("/login");
      }
    } finally {
      setLoggingOut(false);
    }
  };

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

export const useAuth = () => useContext(AuthContext);
