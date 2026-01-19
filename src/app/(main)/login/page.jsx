"use client";

import Login from "@/components/pages/Login";
import React from "react";
import { Suspense } from "react";

const page = () => {
  return (
    <Suspense>
      <Login />
    </Suspense>
  );
};

export default page;
