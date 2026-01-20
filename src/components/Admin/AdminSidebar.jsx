"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdSpaceDashboard, MdLogout } from "react-icons/md";
import { RiMenuFoldFill, RiMenuFold2Fill } from "react-icons/ri";
import { FaBoxOpen, FaClipboardList, FaStore, FaUser } from "react-icons/fa";

const navItems = [
  { href: "/admin/users", icon: <FaUser />, label: "Users" },
  { href: "/admin/products", icon: <FaBoxOpen />, label: "Products" },
  { href: "/admin/orders", icon: <FaClipboardList />, label: "Orders" },
  { href: "/", icon: <FaStore />, label: "Shop" },
];

export default function AdminSidebar({ collapsed, toggleCollapse }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-shrink-0">
      {/* Desktop Sidebar */}
      <aside
        className={`
          hidden lg:flex flex-col h-screen bg-white shadow-lg
          transition-all duration-300
          ${collapsed ? "w-20" : "w-64"}
          flex-shrink-0
        `}
      >
        {/* Brand + Toggle */}
        <div className="flex items-center justify-between p-4 mb-6">
          <Link href="/admin" className="flex items-center gap-2">
            <MdSpaceDashboard className="text-red-500 w-7 h-7" />
            {!collapsed && (
              <span className="text-lg whitespace-nowrap font-semibold">
                Rabbit Dashboard
              </span>
            )}
          </Link>

          <button
            onClick={toggleCollapse}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            {collapsed ? (
              <RiMenuFold2Fill className="w-6 h-6" />
            ) : (
              <RiMenuFoldFill className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col space-y-1 p-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 p-3 rounded-lg transition
                  ${isActive ? "bg-red-500 text-white" : "text-gray-700 hover:bg-gray-100"}
                `}
              >
                <span className="text-xl">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <button className="mt-4 flex items-center gap-3 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
          <MdLogout className="w-5 h-5" />
          {!collapsed && <span>Logout</span>}
        </button>
      </aside>

      {/* Mobile Sidebar (sm/md) */}
      <aside className="lg:hidden flex flex-col h-screen w-20 bg-white shadow-lg">
        {/* Brand */}
        <div className="flex items-center justify-center p-4 mb-6">
          <Link href="/admin">
            <MdSpaceDashboard className="text-red-500 w-7 h-7" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col items-center space-y-2 p-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-center p-3 rounded-lg transition
                  ${isActive ? "bg-red-500 text-white" : "text-gray-700 hover:bg-gray-100"}
                `}
              >
                <span className="text-xl">{item.icon}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <button className="flex items-center justify-center p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition m-2">
          <MdLogout className="w-5 h-5" />
        </button>
      </aside>
    </div>
  );
}
