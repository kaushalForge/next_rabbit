import AdminHomePage from "@/components/pages/AdminHomePage";
import React from "react";
import { cookies } from "next/headers";

const page = async () => {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");
  const token = tokenCookie?.value;

  return (
    <div>
      <AdminHomePage />
    </div>
  );
};

export default page;
