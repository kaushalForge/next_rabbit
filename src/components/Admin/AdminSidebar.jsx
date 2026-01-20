"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MdSpaceDashboard,
  MdMenu,
  MdLogout,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";
import { FaBoxOpen, FaClipboardList, FaStore, FaUser } from "react-icons/fa";

const navItems = [
  { href: "/admin/users", icon: <FaUser />, label: "Users" },
  { href: "/admin/products", icon: <FaBoxOpen />, label: "Products" },
  { href: "/admin/orders", icon: <FaClipboardList />, label: "Orders" },
  { href: "/", icon: <FaStore />, label: "Shop" },
];

export default function AdminSidebar({ isCollapsed }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    window.location.href = "/"; // replace with real logout logic
  };

  return (
    <>
      {/* Hamburger toggle for small devices */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300"
        >
          <MdMenu className="w-6 h-6 text-gray-800" />
        </button>
      </div>

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 shadow-xl z-40
          transform transition-all duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
          ${isCollapsed ? "w-20" : "w-64"} flex flex-col
        `}
      >
        <div className="flex flex-col h-full justify-between p-4">
          {/* Brand */}
          <div className="flex items-center gap-2 mb-6">
            <Link href="/admin" className="flex items-center gap-2">
              <MdSpaceDashboard className="text-red-500 w-7 h-7" />
              {!isCollapsed && (
                <span className="text-lg font-semibold">Rabbit Dashboard</span>
              )}
            </Link>
          </div>

          {/* Toggle collapse (large screens only) */}
          <div className="hidden lg:flex justify-end mb-4">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 rounded-full hover:bg-gray-100 transition-all duration-300"
            >
              {collapsed ? (
                <MdChevronRight className="w-6 h-6 text-gray-700" />
              ) : (
                <MdChevronLeft className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 flex flex-col space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300
                    ${isActive ? "bg-red-500 text-white shadow-lg" : "text-gray-700 hover:bg-gray-100 hover:shadow-sm"}
                  `}
                >
                  <span className="text-2xl">{item.icon}</span>
                  {!collapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="mt-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition-all duration-300"
            >
              <MdLogout className="w-6 h-6" />
              {!collapsed && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 transition-opacity duration-300 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
