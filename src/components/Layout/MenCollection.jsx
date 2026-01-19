"use client";

import ProductGrid from "../Common/ProductGrid";
import { Suspense } from "react";

const MenCollection = ({ products }) => {
  return (
    <Suspense>
      <div className="container px-4 lg:px-6 mx-auto">
        <h2 className="text-center w-full text-3xl font-semibold mb-2">
          Men Collection!
        </h2>
        <ProductGrid products={products} />
      </div>
    </Suspense>
  );
};

export default MenCollection;
