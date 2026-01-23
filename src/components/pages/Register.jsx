"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  MdVerified,
  MdRocketLaunch,
  MdLock,
  MdTrackChanges,
} from "react-icons/md";

const Register = () => {
  const router = useRouter();

  return (
    <div className="container mx-auto flex items-center justify-center bg-gray-100 h-screen">
      <div className="rounded-3xl shadow-xl p-8 bg-white">
        {/* Header */}
        <h1 className="text-3xl md:text-3xl font-medium text-gray-900 mb-3 text-center leading-snug">
          Welcome to Rabbit 🐇
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Sign up securely using your Google account. Verified login ensures
          your email is valid.
        </p>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 gap-3 mb-6 text-left">
          {[
            {
              icon: <MdVerified className="text-blue-500 text-2xl" />,
              text: "Verified Google login",
            },
            {
              icon: <MdRocketLaunch className="text-purple-500 text-2xl" />,
              text: "Instant access without passwords",
            },
            {
              icon: <MdLock className="text-red-500 text-2xl" />,
              text: "Secure and trusted authentication",
            },
            {
              icon: <MdTrackChanges className="text-green-500 text-2xl" />,
              text: "Focus on what matters most",
            },
          ].map((feature, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="text-blue-500 text-xl">{feature.icon}</span>
              <p className="text-gray-700 text-sm">{feature.text}</p>
            </div>
          ))}
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
          Sign up with Google
        </a>

        {/* Footer */}
        <p className="mt-6 text-center text-gray-500 text-sm">
          By continuing, you agree to our{" "}
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
          Already have an account?{" "}
          <span
            className="text-purple-500 underline cursor-pointer hover:text-purple-700 transition-colors"
            onClick={() => router.push("/login")}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
