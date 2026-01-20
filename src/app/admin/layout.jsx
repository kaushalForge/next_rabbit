"use client";

import { useState } from "react";
import AdminSidebar from "@/components/Admin/AdminSidebar";

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex bg-gray-100">
      {/* Sidebar */}
      <div className="min-h-screen">
        <AdminSidebar
          collapsed={collapsed}
          toggleCollapse={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* Main Content */}
      <main
        className={`
          flex-1 p-2
          transition-all w-full duration-300
        `}
      >
        {children}
      </main>
    </div>
  );
}
