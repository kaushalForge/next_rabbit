"use client";

import { lazy, useEffect, useState, useCallback } from "react";
import {
  MdAttachMoney,
  MdAccessTime,
  MdAdminPanelSettings,
  MdLogout,
} from "react-icons/md";
import { FaBoxOpen } from "react-icons/fa6";
import { HiOutlineUser } from "react-icons/hi2";
import {
  TbShoppingBag,
  TbClock,
  TbCurrencyRupeeNepalese,
} from "react-icons/tb";
import { Suspense } from "react";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
import { useAuth } from "@/app/context/AuthContext";
import { useOrders } from "@/app/context/OrderContext";
import Link from "next/link";

const MyOrders = lazy(() => import("./MyOrders"));

// ── Stat Card ──
const StatCard = ({ icon: Icon, label, value, accent }) => (
  <div
    className={`relative overflow-hidden rounded-2xl border p-5 flex flex-col justify-between gap-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${accent}`}
  >
    <div className="flex items-center justify-between">
      <div className="w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center shadow-sm">
        <Icon className="w-5 h-5 text-zinc-700" />
      </div>
    </div>
    <div>
      <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 mb-1">
        {label}
      </p>
      <p className="text-2xl font-black text-zinc-900 tracking-tight">
        {value}
      </p>
    </div>
    {/* decorative circle */}
    <span className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-white/20 pointer-events-none" />
  </div>
);

// ── Skeleton shimmer ──
const Shimmer = ({ w, h }) => (
  <div className={`${w} ${h} rounded-lg bg-zinc-200 animate-pulse`} />
);

const Profile = () => {
  const { currentUser, logout, loggingOut } = useAuth();
  const { totalOrders, pendingOrders, totalSpent } = useOrders();

  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    setLoadingUser(!currentUser);
  }, [currentUser]);

  const handleLogout = useCallback(async () => {
    setLoadingUser(true);
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoadingUser(false);
    }
  }, [logout]);

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12 flex flex-col gap-8">
        {/* ── Top Section ── */}
        <div className="flex flex-col lg:flex-row gap-5 items-stretch">
          {/* User Card */}
          <div className="w-full lg:w-64 shrink-0">
            <div className="h-full rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden flex flex-col">
              {/* Card top bar */}
              <div className="border-b border-[#eaeaea] px-5 py-4 flex items-center gap-2">
                <span className="text-[9px] uppercase tracking-[0.25em] font-black text-zinc-500">
                  Member
                </span>
                {!loadingUser && currentUser?.role === "admin" && (
                  <Link
                    href="/admin"
                    className="ml-auto inline-flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-black rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all"
                  >
                    <MdAdminPanelSettings className="w-3.5 h-3.5" />
                    Admin
                  </Link>
                )}
              </div>

              {/* Avatar + info */}
              <div className="flex flex-col items-center justify-center gap-3 px-5 py-7 flex-1 text-center">
                {/* Avatar */}
                <div className="relative w-20 h-20">
                  {loadingUser || !currentUser?.avatar ? (
                    <div className="w-20 h-20 rounded-full bg-zinc-100 flex items-center justify-center ring-4 ring-zinc-100">
                      <HiOutlineUser className="w-9 h-9 text-zinc-300" />
                    </div>
                  ) : (
                    <Image
                      src={currentUser.avatar}
                      alt={currentUser.name || "User Avatar"}
                      fill
                      referrerPolicy="no-referrer"
                      className="rounded-full object-cover ring-4 ring-zinc-100"
                    />
                  )}
                  {!loadingUser && currentUser && (
                    <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-white" />
                  )}
                </div>

                {/* Name / Email */}
                {loadingUser || !currentUser ? (
                  <div className="flex flex-col items-center gap-2 mt-1">
                    <Shimmer w="w-28" h="h-4" />
                    <Shimmer w="w-36" h="h-3" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-[15px] font-black text-zinc-900 tracking-tight">
                      {currentUser.name}
                    </span>
                    <span className="text-[11px] text-zinc-400 truncate max-w-[180px]">
                      {currentUser.email}
                    </span>
                  </div>
                )}
              </div>

              {/* Logout */}
              <div className="px-4 pb-5">
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-[0.15em] border border-red-200 bg-red-50 hover:bg-red-100 text-red-500 transition-all duration-200 disabled:opacity-50"
                >
                  {loggingOut ? (
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-red-400 border-t-transparent animate-spin" />
                  ) : (
                    <MdLogout className="w-3.5 h-3.5" />
                  )}
                  {loggingOut ? "Logging out…" : "Sign out"}
                </button>
              </div>
            </div>
          </div>

          {/* Stats + Overview */}
          <div className="flex-1 flex flex-col gap-5">
            {/* Overview label */}
            <div className="flex items-center gap-3">
              <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-400">
                Account Overview
              </h2>
              <div className="flex-1 h-px bg-zinc-200" />
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
              <StatCard
                icon={TbShoppingBag}
                label="Total Orders"
                value={totalOrders}
                accent="border-zinc-200 bg-white"
              />
              <StatCard
                icon={TbClock}
                label="Pending Orders"
                value={pendingOrders}
                accent="border-amber-100 bg-amber-50/60"
              />
              <StatCard
                icon={TbCurrencyRupeeNepalese}
                label="Total Spent"
                value={`Rs.${totalSpent}`}
                accent="border-emerald-100 bg-emerald-50/60"
              />
            </div>

            {/* Quick links row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { href: "/collections/all", label: "Browse Collection" },
                {
                  href: "/collections/all?mainCategory=Fashion&gender=Male",
                  label: "Men's",
                },
                {
                  href: "/collections/all?mainCategory=Fashion&gender=Female",
                  label: "Women's",
                },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center justify-center py-2.5 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-950 hover:text-white hover:border-zinc-950 text-zinc-700 text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-200"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── Orders Section ── */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-400">
              My Orders
            </h2>
            <div className="flex-1 h-px bg-zinc-200" />
          </div>

          <Suspense
            fallback={
              <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
                <div className="bg-zinc-950 px-5 py-4">
                  <Shimmer w="w-28" h="h-4" />
                </div>
                <div className="p-5 flex flex-col gap-3">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-zinc-100 p-4 flex flex-col gap-3"
                    >
                      <div className="flex justify-between">
                        <Shimmer w="w-24" h="h-4" />
                        <Shimmer w="w-16" h="h-5" />
                      </div>
                      <Shimmer w="w-full" h="h-16" />
                    </div>
                  ))}
                </div>
              </div>
            }
          >
            <MyOrders />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Profile;
