"use client";

import { FaTrash } from "react-icons/fa";
import { updateUserRoleAction, deleteUserAction } from "@/actions/adminUsers";
import { toast } from "sonner";

const UserManagement = ({ allUsersData = [] }) => {
  const handleRoleChange = async (userId, role) => {
    try {
      const { status, newRole } = await updateUserRoleAction({ userId, role });
      if (status === 201) toast.success(`User role updated to ${newRole}`);
    } catch (err) {
      console.error("Failed to update role:", err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const { status } = await deleteUserAction(userId);
      if (status === 201) toast.success("User deleted successfully!");
    } catch (err) {
      console.error("Failed to delete user:", err);
      toast.error("Failed to delete user");
    }
  };

  let groupedUsers;
  if (allUsersData.length > 0) {
    groupedUsers = {
      admin: allUsersData.filter((user) => user.role === "admin"),
      moderator: allUsersData.filter((user) => user.role === "moderator"),
      customer: allUsersData.filter((user) => user.role === "customer"),
    };
  }
  const renderUsers = (users) =>
    users.length ? (
      users.map((user) => (
        <div
          key={user._id}
          className="flex items-center justify-between bg-white rounded-xl shadow p-4 hover:shadow-lg transition"
        >
          <div className="flex items-center gap-4">
            <img
              src={user.avatar || "/images/Avatar.png"}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover border border-gray-200"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="font-semibold text-gray-800">{user.name}</div>
              <div className="text-gray-500 text-sm">{user.email}</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${ROLE_COLORS[user.role]}`}
            >
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span> */}

            <select
              value={user.role}
              onChange={(e) => handleRoleChange(user._id, e.target.value)}
              className="rounded-lg border px-3 py-1 text-gray-700 focus:ring-2 focus:ring-blue-500"
            >
              <option value="customer">Customer</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>

            <button
              onClick={() => handleDeleteUser(user._id)}
              className="text-red-600 hover:text-red-700"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      ))
    ) : (
      <div className="text-center text-gray-400 py-6">No users found!</div>
    );

  return (
    <div className="container mx-auto px-6 py-8 space-y-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
      </div>
      <div className="w-full border-b border-[#bababa]"></div>

      {allUsersData.length === 0 ? (
        <div className="text-center text-gray-400 py-10 text-lg">
          No users found!
        </div>
      ) : (
        <>
          {/* Admin Section */}
          {groupedUsers?.admin.length > 0 && (
            <div className="space-y-4">
              <span className="bg-black text-white text-sm font-semibold px-2 py-1 rounded-lg mb-2 inline-block">
                Admins
              </span>
              <div className="grid md:grid-cols-1 gap-4">
                {renderUsers(groupedUsers.admin)}
              </div>
            </div>
          )}

          {/* Moderator Section */}
          {groupedUsers?.moderator.length > 0 && (
            <div className="space-y-4">
              <span className="bg-[#ff4500] text-white text-sm font-semibold px-2 py-1 rounded-lg mb-2 inline-block">
                Moderators
              </span>
              <div className="grid md:grid-cols-1 gap-4">
                {renderUsers(groupedUsers.moderator)}
              </div>
            </div>
          )}

          {/* Customer Section */}
          {groupedUsers?.customer.length > 0 && (
            <div className="space-y-4">
              <span className="bg-green-700 text-white text-sm font-semibold px-2 py-1 rounded-lg mb-2 inline-block">
                Customers
              </span>
              <div className="grid md:grid-cols-1 gap-4">
                {renderUsers(groupedUsers.customer)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserManagement;
