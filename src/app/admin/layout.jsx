"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapse = () => {
    console.log("changed");
    setCollapsed(!collapsed);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar collapsed={collapsed} toggleCollapse={toggleCollapse} />
      {/* Main content */}
      <main
        className={`flex-1 transition-all duration-500 ease-in-out p-6 ${
          collapsed ? "ml-20" : "ml-64"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
