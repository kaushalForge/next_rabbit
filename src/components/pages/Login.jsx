"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const message = searchParams.get("message");
    const error = searchParams.get("error");

    if (message) {
      toast.success(message); // ✅ show success toast
      router.replace("/"); // optionally redirect after showing toast
    }

    if (error) {
      toast.error(error); // ✅ show error toast
      router.replace("/login"); // optional
    }
  }, [searchParams, router]);

  return (
    <div className="container mx-auto flex items-center justify-center bg-gray-100 h-screen">
      <div className="rounded-3xl shadow-xl p-8 bg-white">
        {/* Header */}
        <h1 className="text-3xl md:text-3xl font-medium text-gray-900 mb-3 text-center leading-snug">
          Welcome to Rabbit 🐇
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Sign in securely using your Google account or your registered email.
        </p>

        {/* Divider */}
        <div className="flex items-center gap-2 mb-6">
          <hr className="flex-1 border-gray-300" />
          <span className="text-gray-500 text-sm">Rabbit</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Google OAuth Button */}
        <a
          href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google`}
          className="flex items-center justify-center w-full py-3 px-4 rounded-xl border shadow-md hover:shadow-lg transition-all bg-white text-gray-700 font-medium hover:bg-gray-50"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google Logo"
            className="h-5 w-5 mr-3"
          />
          Continue with Google
        </a>

        {/* Footer */}
        <p className="mt-6 text-center text-gray-500 text-sm">
          By continuing, you agree to our
          <span className="text-blue-500 underline cursor-pointer">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="text-blue-500 underline cursor-pointer">
            Privacy Policy
          </span>
          .
        </p>

        <p className="mt-4 text-center text-gray-500 text-sm">
          Don't have an account?{" "}
          <span
            className="text-purple-500 underline cursor-pointer hover:text-purple-700 transition-colors"
            onClick={() => router.push("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
