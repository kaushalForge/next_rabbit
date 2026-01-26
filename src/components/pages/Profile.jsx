"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import MyOrders from "./MyOrders";
import { useAuth } from "@/app/context/AuthContext";

const Profile = () => {
  const router = useRouter();
  const { user, loading, refreshAuth } = useAuth();

  const handleLogout = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cookie/logout`,
        {
          method: "POST",
          credentials: "include",
          cache: "no-store",
        },
      );

      const result = await res.json();

      if (res.ok) {
        toast.success(result.message || "Logged out");
        refreshAuth();
        router.replace("/login");
      } else {
        toast.error(result.message || "Logout failed");
      }
    } catch (err) {
      console.error("❌ Logout error:", err);
      toast.error("Logout failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow container mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* User Info */}
          <div className="w-full md:w-1/3 shadow-md rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-2">Profile</h1>
            <p className="text-gray-700 mb-2">{user.email}</p>
            <p className="text-sm text-gray-500 mb-4">Role: {user.role}</p>

            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>

          {/* Orders */}
          <div className="w-full md:w-2/3">
            <MyOrders />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
