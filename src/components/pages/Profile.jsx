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
import { useOrders } from "@/app/context/OrderContext";
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
import { Suspense } from "react";
const Profile = () => {
  const { currentUser, logout, loggingOut } = useAuth();

  const { totalOrders, pendingOrders, totalSpent } = useOrders();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      setLoading(false);
    }
  }, [loading, currentUser]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="container mx-auto p-4 lg:p-6 flex flex-col w-full gap-8">
        {/* User Card + Stats */}
        <div className="flex flex-col lg:flex-row gap-6 h-full items-start lg:items-center">
          {/* Left Column - Stats */}
          <div className="w-full flex-1 flex flex-col h-full">
            <div className="flex-1 rounded-2xl p-4 lg:p-8 bg-white border border-neutral-200 shadow-sm">
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                Account Overview
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 lg:gap-4">
                {/* Total Orders */}
                <div className="group rounded-xl border border-neutral-200 p-3 lg:p-5 transition-all hover:shadow-md hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600">
                      <FaBoxOpen size={16} />
                    </div>
                  </div>

                  <p className="text-sm text-neutral-500 mt-4">Total Orders</p>

                  <p className="text-2xl font-semibold text-neutral-900 mt-1">
                    {totalOrders}
                  </p>
                </div>

                {/* Pending Orders */}
                <div className="group rounded-xl border border-neutral-200 p-3 lg:p-5 transition-all hover:shadow-md hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600">
                      <MdAccessTime size={18} />
                    </div>
                  </div>

                  <p className="text-sm text-neutral-500 mt-4">
                    Pending Orders
                  </p>

                  <p className="text-2xl font-semibold text-neutral-900 mt-1">
                    {pendingOrders}
                  </p>
                </div>

                {/* Total Spent */}
                <div className="group rounded-xl border border-neutral-200 p-3 lg:p-5 transition-all hover:shadow-md hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600">
                      <MdAttachMoney size={18} />
                    </div>
                  </div>

                  <p className="text-sm text-neutral-500 mt-4">Total Spent</p>

                  <p className="text-2xl font-semibold text-neutral-900 mt-1">
                    Rs.{totalSpent}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Minimal User Card */}
          <div className="w-full lg:w-72 aspect-square shrink-0 flex flex-col max-h-60 lg:h-full self-start lg:self-center">
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
                {!loading && currentUser?.role === "admin" && (
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-black text-white rounded-full text-xs"
                  >
                    <MdAdminPanelSettings size={14} /> Admin
                  </Link>
                )}
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
