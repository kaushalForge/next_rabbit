"use client";

import { useRouter } from "next/navigation";
import MyOrders from "./MyOrders";
import { toast } from "sonner";
import { useAuth } from "@/app/context/AuthContext";

const Profile = () => {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const handleLogout = async () => {
    const { result, status } = await logout();
    if (status === 200 || status === 201) {
      toast.success(result?.message);
      router.push("/login");
    } else {
      toast.message(result?.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    router.replace("/login");
    return null;
  }

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
