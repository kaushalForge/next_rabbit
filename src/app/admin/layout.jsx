"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/Admin/AdminSidebar";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const { currentUser, loading } = useAuth();

  useEffect(() => {
    if (!loading && (!currentUser || currentUser.role !== "admin")) {
      router.replace("/404");
    }
  }, [currentUser, loading, router]);

  if (loading) return null;

  if (!currentUser || currentUser.role !== "admin") {
    return null;
  }

  return (
    <div className="flex bg-gray-100">
      <div className="fixed top-0 left-0 h-screen z-20">
        <AdminSidebar
          collapsed={collapsed}
          toggleCollapse={() => setCollapsed(!collapsed)}
        />
      </div>

      <main
        className={`flex-1 p-2 ml-18 min-h-screen transition-all duration-300 ${
          collapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
