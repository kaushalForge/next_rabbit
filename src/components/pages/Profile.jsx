"use client";

import { useEffect, useState } from "react";
import {
  MdEmail,
  MdPerson,
  MdAdminPanelSettings,
  MdLogout,
} from "react-icons/md";
import MyOrders from "./MyOrders";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";

const Profile = ({ currentUser }) => {
  const [mounted, setMounted] = useState(false);
  const { logout, loggingOut } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !currentUser) return null;

  const { avatar, name, email, role } = currentUser;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="container mx-auto p-6 flex flex-col lg:flex-row gap-8">
        {/* User Card */}
        <div className="w-full lg:w-1/3 bg-white shadow-xl rounded-3xl p-6 flex flex-col items-center text-center">
          <div className="relative">
            <img
              src={avatar}
              alt={name || "User Avatar"}
              referrerPolicy="no-referrer"
              className="h-32 w-32 rounded-full object-cover border-2 border-black shadow-md"
            />
            <div
              className="absolute top-4 right-1 -translate-x-1/2 -translate-y-1/2 bg-green-500 w-5 h-5 rounded-full ring-2 ring-white"
              title="Online"
            ></div>
          </div>

          <h2 className="text-2xl font-bold mt-4 flex items-center justify-center gap-2 text-gray-800">
            <MdPerson className="text-blue-500" size={24} /> {name || "User"}
          </h2>

          <p className="flex items-center justify-center gap-2 text-gray-600 mt-2">
            <MdEmail className="text-purple-500" /> {email}
          </p>

          <span className="flex items-center justify-center gap-2 text-white font-medium bg-black/80 px-4 py-1 rounded-full mt-3">
            {role === "admin" ? (
              <Link href="/admin" className="flex items-center gap-2">
                <MdAdminPanelSettings /> {role}
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <MdAdminPanelSettings /> {role}
              </div>
            )}
          </span>

          <button
            onClick={logout}
            disabled={loggingOut}
            className="mt-6 w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MdLogout size={20} />
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>

        {/* Orders Section */}
        <div className="w-full lg:w-2/3 bg-white shadow-xl rounded-3xl p-4 flex flex-col gap-2">
          <h3 className="text-xl font-bold text-gray-800 mb-2">My Orders</h3>
          <MyOrders />
        </div>
      </div>
    </div>
  );
};

export default Profile;
