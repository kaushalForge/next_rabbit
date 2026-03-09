"use client";

import { useState } from "react";
import { updateUserRoleAction, deleteUserAction } from "@/actions/adminUsers";
import { toast } from "sonner";
import { Separator } from "../ui/separator";

const TrashIcon = ({ spinning }) =>
  spinning ? (
    <svg
      className="w-3.5 h-3.5 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  ) : (
    <svg
      className="w-3.5 h-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  );

const ROLE_CONFIG = {
  admin: {
    label: "Admin",
    sectionTitle: "Admins",
    dot: "bg-slate-800",
    tag: "bg-slate-100 text-slate-600",
    bar: "bg-slate-800",
  },
  moderator: {
    label: "Moderator",
    sectionTitle: "Moderators",
    dot: "bg-amber-400",
    tag: "bg-amber-50 text-amber-700",
    bar: "bg-amber-400",
  },
  customer: {
    label: "Customer",
    sectionTitle: "Customers",
    dot: "bg-emerald-400",
    tag: "bg-emerald-50 text-emerald-700",
    bar: "bg-emerald-400",
  },
};

const UserManagement = ({ allUsersData }) => {
  const [deletingId, setDeletingId] = useState(null);

  const handleRoleChange = async (userId, role) => {
    try {
      const { status, newRole } = await updateUserRoleAction({ userId, role });
      if (status === 201) toast.success(`Role updated to ${newRole}`);
    } catch (err) {
      console.error("Failed to update role:", err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setDeletingId(userId);
    try {
      const { status } = await deleteUserAction(userId);
      if (status === 201) toast.success("User deleted");
    } catch (err) {
      toast.error("Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  };

  const groupedUsers = allUsersData?.length
    ? {
        admin: allUsersData.filter((u) => u.role === "admin"),
        moderator: allUsersData.filter((u) => u.role === "moderator"),
        customer: allUsersData.filter((u) => u.role === "customer"),
      }
    : null;

  const renderSection = (roleKey) => {
    const users = groupedUsers?.[roleKey];
    if (!users?.length) return null;
    const cfg = ROLE_CONFIG[roleKey];

    return (
      <section key={roleKey}>
        {/* Section label */}
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-1 h-4 rounded-full ${cfg.bar}`} />
          <span className="text-xs font-semibold tracking-widest uppercase">
            {cfg.sectionTitle}
          </span>
          <span className="text-xs font-medium">{users.length}</span>
        </div>

        {/* Cards */}
        <div className="space-y-2">
          {users.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-3 hover:border-gray-200 hover:shadow-sm transition-all duration-150 group"
            >
              {/* Left: avatar + info */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={user.avatar || "/images/Avatar.png"}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover bg-gray-100"
                    referrerPolicy="no-referrer"
                  />
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 ${cfg.dot} rounded-full border-2 border-white`}
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate leading-snug">
                    {user.name}
                  </p>
                  <p className="text-xs truncate">{user.email}</p>
                </div>
              </div>

              {/* Right: role selector + delete */}
              <div className="flex items-center gap-2 shrink-0 ml-4">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  className={`text-xs font-medium rounded-lg px-2.5 py-1.5 border-0 outline-none cursor-pointer transition-colors ${cfg.tag}`}
                >
                  <option value="customer">Customer</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>

                <button
                  onClick={() => handleDeleteUser(user._id)}
                  disabled={deletingId === user._id}
                  title="Delete user"
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all duration-150 disabled:opacity-40 opacity-0 group-hover:opacity-100"
                >
                  <TrashIcon spinning={deletingId === user._id} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen p-4">
      <div className="container mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              User Management
            </h2>
            <p className="text-gray-500 mt-1">
              Manage site users
            </p>
          </div>
        </div>

        {/* Body */}
        {!groupedUsers ? (
          <p className="text-sm text-center py-16">No users found.</p>
        ) : (
          <div className="space-y-8">
            {renderSection("admin")}
            {renderSection("moderator")}
            {renderSection("customer")}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
