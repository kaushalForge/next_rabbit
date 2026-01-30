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

  const sidebarWidth = collapsed ? "80px" : "250px";

  return (
    <div className="flex bg-gray-100">
      <div
        className="fixed top-0 left-0 h-screen z-20"
        style={{ width: sidebarWidth }}
      >
        <AdminSidebar
          collapsed={collapsed}
          toggleCollapse={() => setCollapsed(!collapsed)}
        />
      </div>

      <main
        className="flex-1 p-2 min-h-screen transition-all duration-300"
        style={{ marginLeft: sidebarWidth }}
      >
        {children}
      </main>
    </div>
  );
}
