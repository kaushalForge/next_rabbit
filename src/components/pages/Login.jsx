"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/app/context/AuthContext";
import { Spinner } from "../ui/spinner";

const Login = () => {
  const router = useRouter();
  const { refreshCurrentUser } = useAuth();

  const googleBtnRef = useRef(null);

  const [pageLoading, setPageLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      setPageLoading(false);

      if (!window.google || !googleBtnRef.current) return;

      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        auto_select: false,
        cancel_on_tap_outside: true,
        callback: handleGoogleResponse,
      });

      // 🔥 Important: clear previous render
      googleBtnRef.current.innerHTML = "";

      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: "outline",
        size: "large",
        width: "100%",
      });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      setAuthLoading(true);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: response.credential }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Login successful!");
        await refreshCurrentUser();
        router.replace("/");
      } else {
        toast.error(data.message || "Login failed");
        setAuthLoading(false);
      }
    } catch (error) {
      toast.error("Server error");
      setAuthLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center bg-gray-100 h-screen relative">
      {/* FULL SCREEN LOADER */}
      {(pageLoading || authLoading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
          <Spinner className="w-14 h-14 text-primary" />
        </div>
      )}

      <div className="rounded-3xl shadow-xl p-8 bg-white w-full max-w-md">
        <h1 className="text-3xl font-medium text-gray-900 mb-3 text-center leading-snug">
          Welcome to Rabbit 🐇
        </h1>

        <p className="text-gray-600 mb-6 text-center">
          Sign in securely using your Google account or your registered email.
        </p>

        {/* ✅ ALWAYS RENDERED */}
        <div
          ref={googleBtnRef}
          className={`mb-6 ${authLoading ? "opacity-50 pointer-events-none" : ""}`}
        />

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
