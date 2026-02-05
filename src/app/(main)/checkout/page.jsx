import Checkout from "@/components/pages/Checkout";
import { Suspense } from "react";
import React from "react";

const page = () => {
  return (
    <div>
      <Suspense>
        <Checkout />
      </Suspense>
    </div>
  );
};

export default page;
