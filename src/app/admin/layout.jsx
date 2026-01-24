"use client";

import { useState } from "react";
import AdminSidebar from "@/components/Admin/AdminSidebar";

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  // Sidebar width when expanded/collapsed
  const sidebarWidth = collapsed ? "80px" : "250px";

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
