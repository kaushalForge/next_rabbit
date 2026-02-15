"use client";

import { lazy, useEffect, useState } from "react";
import {
  MdAttachMoney,
  MdAccessTime,
  MdAdminPanelSettings,
  MdLogout,
} from "react-icons/md";
import { FaBoxOpen } from "react-icons/fa6";
// import MyOrders from "./MyOrders";
const MyOrders = lazy(() => import("./MyOrders"));
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
import { Suspense } from "react";
const Profile = () => {
  const { currentUser, refreshCurrentUser, logout, loggingOut } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      setLoading(false);
    }
  }, [loading, currentUser]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="container mx-auto p-6 flex flex-col w-full gap-8">
        {/* User Card + Stats */}
        <div className="flex flex-col lg:flex-row gap-6 h-full items-start lg:items-center">
          {/* Left Column - Stats */}
          <div className="w-full flex-1 flex flex-col gap-6 h-full">
            <div className="flex-1 rounded-2xl p-6 flex flex-col bg-stone-100/60 border-gray-100 shadow-sm backdrop-blur-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Account Stats
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
                {/* RabbitHub */}
                <div className="relative w-full aspect-square rounded-xl bg-linear-to-br from-blue-200/50 to-blue-400/30 transition-all duration-300 flex items-center justify-center">
                  <Image
                    src="/images/RabbitHub.png"
                    alt="RabbitHub Logo"
                    fill
                    preload
                    className="rounded-md object-cover"
                  />
                </div>

                {/* Total Orders */}
                <div className="relative flex flex-col items-center justify-center aspect-square p-4 rounded-xl bg-linear-to-br from-indigo-200/50 to-indigo-400/30 transition-all duration-300">
                  <span className="flex items-center justify-center text-indigo-700 text-sm gap-1 font-medium">
                    <FaBoxOpen />
                    Total Orders
                  </span>
                  <span className="text-indigo-900 font-bold text-lg">128</span>
                  <div className="absolute inset-0 rounded-xl bg-indigo-200/20 blur-xl -z-10"></div>
                </div>

                {/* Pending Orders */}
                <div className="relative flex flex-col items-center justify-center aspect-square p-4 rounded-xl bg-linear-to-br from-orange-200/50 to-orange-400/30 transition-all duration-300">
                  <span className="flex items-center justify-center text-orange-600 text-sm gap-1 font-medium">
                    <MdAccessTime />
                    Pending Orders
                  </span>
                  <span className="text-orange-800 font-bold text-lg">5</span>
                  <div className="absolute inset-0 rounded-xl bg-orange-200/20 blur-xl -z-10"></div>
                </div>

                {/* Total Spent */}
                <div className="relative flex flex-col items-center justify-center aspect-square p-4 rounded-xl bg-linear-to-br from-green-200/50 to-green-400/30 transition-all duration-300">
                  <span className="flex items-center justify-center text-green-700 text-sm gap-1 font-medium">
                    <MdAttachMoney />
                    Total Spent
                  </span>
                  <span className="text-green-900 font-bold text-lg">
                    Rs. 54,300
                  </span>
                  <div className="absolute inset-0 rounded-xl bg-green-200/20 blur-xl -z-10"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Minimal User Card */}
          <div className="w-full lg:w-72 aspect-square shrink-0 flex flex-col h-full self-start lg:self-center">
            <div className="bg-stone-100/80 grow border border-gray-100 rounded-2xl px-4 py-3 flex flex-col items-center justify-center text-center shadow-sm h-full">
              {/* Avatar */}
              <div className="relative">
                {loading ? (
                  <Skeleton className="h-16 w-16 rounded-full bg-stone-300 animate-pulse" />
                ) : (
                  <img
                    src={currentUser?.avatar}
                    alt={currentUser?.name || "User Avatar"}
                    referrerPolicy="no-referrer"
                    className="h-16 w-16 rounded-full object-cover border border-gray-300"
                  />
                )}
                {!loading && (
                  <span
                    className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full ring-2 ring-white"
                    title="Online"
                  />
                )}
              </div>

              {/* Name and Email */}
              <div className="mt-2 flex flex-col gap-2 items-center justify-center">
                {loading ? (
                  <div className="flex flex-col gap-2 items-center">
                    <Skeleton className="h-4 w-24 rounded bg-stone-300 animate-pulse" />
                    <Skeleton className="h-3 w-32 rounded bg-stone-300 animate-pulse" />
                  </div>
                ) : (
                  <>
                    <span className="font-semibold text-gray-800 truncate">
                      {currentUser?.name}
                    </span>
                    <span className="text-gray-500 text-xs truncate">
                      {currentUser?.email}
                    </span>
                  </>
                )}
              </div>

              {/* Role */}
              <div className="mt-2">
                {!loading &&
                  (currentUser?.role === "admin" ? (
                    <Link
                      href="/admin"
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-black text-white rounded-full text-xs"
                    >
                      <MdAdminPanelSettings size={14} /> Admin
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-xs">
                      <MdAdminPanelSettings size={14} />{" "}
                      {currentUser?.role || "User"}
                    </span>
                  ))}
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                disabled={loggingOut}
                className="mt-4 w-full flex items-center justify-center gap-2 text-sm bg-red-300/60 hover:bg-red-400/60 text-red-500 font-semibold px-4 py-2 rounded-lg transition disabled:opacity-50"
              >
                {loggingOut ? (
                  <Skeleton className="h-4 w-4 rounded-full bg-red-300 animate-pulse" />
                ) : (
                  <MdLogout size={16} />
                )}
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>

        {/* My Orders Section - dynamic */}
        <div className="w-full bg-white shadow-xl rounded-3xl p-4 flex flex-col gap-2">
          <h3 className="text-xl font-bold text-gray-800 mb-2">My Orders</h3>
          <Suspense>
            <MyOrders />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Profile;
