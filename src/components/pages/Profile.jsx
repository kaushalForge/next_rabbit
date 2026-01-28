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

const Profile = ({ currentUser }) => {
  const [mounted, setMounted] = useState(false);
  const { logout, loggingOut } = useAuth();
  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ prevents hydration mismatch
  if (!mounted || !currentUser) return null;

  const { avatar, name, email, role } = currentUser;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 via-white to-gray-50 flex flex-col">
      <div className="container mx-auto p-6 flex flex-col md:flex-row gap-6">
        {/* User Card */}
        <div className="w-full md:w-1/3 bg-white/60 backdrop-blur-md shadow-lg rounded-2xl p-6 flex flex-col items-center">
          <img
            src={avatar}
            alt={name || "User Avatar"}
            referrerPolicy="no-referrer"
            className="h-28 w-28 ring-1 ring-[#dadada] rounded-full object-cover border-2 border-white shadow-sm mb-4"
          />

          <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
            <MdPerson className="text-blue-500" /> {name || "User"}
          </h2>

          <p className="flex items-center gap-2 text-gray-700 mb-2">
            <MdEmail className="text-purple-500" /> {email}
          </p>

          <span className="flex items-center gap-1 text-white font-medium bg-black/70 px-3 py-1 rounded-full mb-4">
            <MdAdminPanelSettings className="text-white" /> {role}
          </span>

          <button
            onClick={logout}
            disabled={loggingOut}
            className="flex items-center justify-center gap-2 w-full bg-red-500
            hover:bg-red-600 text-white py-2 rounded-xl font-medium
            transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MdLogout /> {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>

        {/* Orders Section */}
        <div className="w-full md:w-2/3">
          <div className="bg-white/60 backdrop-blur-md shadow-lg rounded-2xl p-6 h-full">
            <MyOrders />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
