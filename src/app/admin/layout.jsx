"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminSidebar from "@/components/Admin/AdminSidebar";
import { fetchCurrentUser } from "@/actions/auth";

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  const sidebarWidth = collapsed ? "80px" : "250px";

  useEffect(() => {
    const checkAuth = async () => {
      const result = await fetchCurrentUser();

      if (!result?.isLoggedIn) {
        router.replace("/login");
        return;
      }

      if (result.user?.role !== "admin") {
        router.replace(document.referrer || "/404");
        return;
      }

      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) return null;

  return (
    <div className="flex bg-gray-100">
      {/* Sidebar */}
      <div
        className="fixed top-0 left-0 h-screen z-20"
        style={{ width: sidebarWidth }}
      >
        <AdminSidebar
          collapsed={collapsed}
          toggleCollapse={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* Main Content */}
      <main
        className="flex-1 p-2 min-h-screen transition-all duration-300"
        style={{ marginLeft: sidebarWidth }}
      >
        {children}
      </main>
    </div>
  );
}
