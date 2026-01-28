"use client";

import Profile from "@/components/pages/Profile";
import { useAuth } from "@/app/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const { currentUser, refreshCurrentUser, loading, loggingOut, logout } =
    useAuth();

  const router = useRouter();

  useEffect(() => {
    // wait for auth check to finish
    if (!loading && !currentUser) {
      router.replace("/login");
    }
  }, [loading, currentUser, router]);

  // optional: prevent flashing Profile while loading
  if (loading) return null;

  return (
    <Profile
      currentUser={currentUser}
      refreshCurrentUser={refreshCurrentUser}
      loading={loading}
      logout={logout}
      loggingOut={loggingOut}
    />
  );
}
