"use client";

import { useState } from "react";
import { FaUserPlus, FaTrash, FaUserShield, FaUser } from "react-icons/fa";
import {
  createUserAction,
  updateUserRoleAction,
  deleteUserAction,
} from "@/actions/adminUsers";
import { toast } from "sonner";

const UserManagement = ({ allUsersData }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // console.log(name, email, password, role);
      const { status } = await createUserAction({
        name,
        email,
        password,
        role,
      });
      setName("");
      setEmail("");
      setPassword("");
      setRole("customer");
      if (status === 201) {
        toast.success("User Added successfully!");
      }
    } catch (err) {
      console.error("Failed to create user:", err);
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      const { status, newRole } = await updateUserRoleAction({ userId, role });
      if (status === 201) {
        toast.success(`User role Updated to ${newRole}`);
      }
    } catch (err) {
      console.error("Failed to update role:", err);
    }
  };

  const handleDeleteUser = async (userId) => {
    // Show a confirmation dialog
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmDelete) return; // Exit if user cancels

    try {
      const { status } = await deleteUserAction(userId);
      if (status === 201) {
        toast.success("User deleted successfully!");
      }
    } catch (err) {
      console.error("Failed to delete user:", err);
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1">Manage users, roles and access</p>
        </div>
        <FaUserShield size={24} className="text-blue-600" />
      </div>

      {/* Add User */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <FaUserPlus />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Add New User</h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl border px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl border px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <select
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="rounded-xl border px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition"
            >
              <FaUserPlus /> Create User
            </button>
          </div>
        </form>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-4 text-left">User</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Role</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {allUsersData?.length ? (
              allUsersData.map((user) => (
                <tr
                  key={user._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                      <FaUser className="text-gray-500" />
                    </div>
                    <span className="font-medium text-gray-800">
                      {user.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                      className="rounded-lg border px-3 py-1.5 text-gray-700 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="inline-flex items-center gap-2 text-red-600 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-10 text-center text-gray-400">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
