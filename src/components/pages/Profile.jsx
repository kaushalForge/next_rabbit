"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import MyOrders from "./MyOrders";

const Profile = () => {
  const router = useRouter();
  const userInfo = useSelector((state) => state.auth.user);

  // Redirect if user is not logged in
  useEffect(() => {
    if (!userInfo) {
      router.replace("/not-found"); // Next.js style redirect
    }
  }, [userInfo, router]);

  // Fallback values
  const name = userInfo?.name || "username";
  const email = userInfo?.email || "example@example.com";

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userToken");

    // Optionally, you could also dispatch a Redux logout action
    // dispatch(logout());

    router.push("/login"); // redirect to login page
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
          {/* User Info */}
          <div className="w-full md:w-1/3 lg:w-1/4 shadow-md rounded-lg p-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 capitalize">
              {name}
            </h1>
            <p className="text-lg text-gray-600 mb-4">{email}</p>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>

          {/* Orders */}
          <div className="w-full md:w-2/3 lg:3/4">
            <MyOrders />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
