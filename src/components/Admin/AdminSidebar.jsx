"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdSpaceDashboard } from "react-icons/md";

import {
  FaBoxOpen,
  FaClipboardList,
  FaSignInAlt,
  FaStore,
  FaUser,
} from "react-icons/fa";

const AdminSidebar = () => {
  const pathname = usePathname();

  const handleLogout = () => {
    // Replace with your Next.js logout logic if needed
    window.location.href = "/"; // simple redirect to homepage
  };

  const navItems = [
    { href: "/admin/users", icon: <FaUser />, label: "Users" },
    { href: "/admin/products", icon: <FaBoxOpen />, label: "Products" },
    { href: "/admin/orders", icon: <FaClipboardList />, label: "Orders" },
    { href: "/", icon: <FaStore />, label: "Shop" },
  ];

  return (
    <div className="p-4">
      <div className="mb-6">
        <Link
          href="/admin"
          className="flex items-center gap-2 text-xl font-medium"
        >
          <MdSpaceDashboard className="text-red-500 w-6 h-6" />
          <span className="truncate">Rabbit Dashboard</span>
        </Link>
      </div>

      <nav className="flex flex-col space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                isActive
                  ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white p-2 rounded flex items-center space-x-2"
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:text-red-600 text-white py-2 px-4 rounded flex items-center justify-center space-x-2"
        >
          <FaSignInAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
