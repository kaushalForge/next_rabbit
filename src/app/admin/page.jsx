"use client";

import AdminHomePage from "@/components/pages/AdminHomePage";
import { Spinner } from "@/components/ui/spinner";
import React from "react";
import { useAuth } from "../context/AuthContext";
const page = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
        <Spinner className="w-14 h-14 text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <AdminHomePage />
    </div>
  );
};

export default page;
