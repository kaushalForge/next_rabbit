"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/slices/authSlice";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(
        loginUser({ email, password }),
      ).unwrap();
      if (resultAction) {
        router.push("/"); // Navigate to home page
      }
    } catch (error) {
      toast.error("Invalid email or password!");
    }
  };

  return (
    <div className="flex">
      {/* Form Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-lg border shadow-sm"
        >
          <div className="flex justify-center font-bold mb-6">
            <h2 className="text-xl font-medium">Rabbit</h2>
          </div>
          <h2 className="text-2xl text-center font-bold mb-6">Hey there! 👋🏼</h2>
          <p className="text-center mb-6">
            Enter your email and password to login
          </p>

          {/* Email */}
          <div className="flex flex-col items-start gap-1 py-2 w-full">
            <label htmlFor="email" className="block text-sm font-semibold mb-2">
              Email
            </label>
            <input
              id="email"
              type="text"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border p-2"
              placeholder="Enter your email address"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col items-start gap-1 py-2 w-full">
            <label
              htmlFor="password"
              className="block text-sm font-semibold mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border p-2"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white mt-4 py-2 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-all"
          >
            Sign In
          </button>

          <p className="mt-6 text-center text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-500 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>

      {/* Image Section */}
      <div className="hidden md:block w-1/2 bg-gray-800">
        <div className="h-full flex flex-col justify-center items-center w-full">
          <img
            src="https://images.unsplash.com/photo-1517191434949-5e90cd67d2b6?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Login"
            className="h-[750px] w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
