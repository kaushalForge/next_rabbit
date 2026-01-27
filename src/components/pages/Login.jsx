"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/app/context/AuthContext";

const Login = () => {
  const router = useRouter();
  const { refreshCurrentUser } = useAuth();

  useEffect(() => {
    // Load Google Identity Services script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: async (response) => {
          try {
            const res = await fetch("/api/auth/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ idToken: response.credential }),
              credentials: "include",
            });
            const data = await res.json();

            if (data.success) {
              toast.success("Login successful!");
              await refreshCurrentUser();
              router.push("/");
            } else {
              toast.error(data.message || "Login failed");
              await refreshCurrentUser();
            }
          } catch (err) {
            toast.error("Server error");
            await refreshCurrentUser();
          }
        },
      });

      google.accounts.id.renderButton(
        document.getElementById("google-signin-btn"),
        { theme: "outline", size: "large", width: "100%" },
      );
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [router, refreshCurrentUser]);

  return (
    <div className="container mx-auto flex items-center justify-center bg-gray-100 h-screen">
      <div className="rounded-3xl shadow-xl p-8 bg-white w-full max-w-md">
        <h1 className="text-3xl font-medium text-gray-900 mb-3 text-center leading-snug">
          Welcome to Rabbit 🐇
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Sign in securely using your Google account or your registered email.
        </p>

        <div id="google-signin-btn" className="mb-6" />

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
