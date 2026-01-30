import Hero from "@/components/Layout/Hero";
import GenderCollectionSection from "@/components/Layout/GenderCollectionSection";
import NewArrivalRouting from "./(main)/new-arrivals/page";
import WomenCollectionRouting from "./(main)/women-collection/page";
// import MenCollectionRouting from "../../../men-collection/page";
import FetchingHelper from "@/components/Helper/fetchingHelper";
import FeaturedCollection from "@/components/Products/FeaturedCollection";
import FeaturedSection from "@/components/Products/FeaturedSection";
import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";
import React, { Suspense } from "react";
import ProductDetails from "@/components/Layout/ProductDetails";
import Product from "@/components/pages/Product";

const page = () => {
  return (
    <div>
      <Header />
      <Hero />
      <GenderCollectionSection />
      <NewArrivalRouting />
      {/* Womens Collection */}
      <Suspense>
        <WomenCollectionRouting />
      </Suspense>

      {/* Product Details */}
      <Suspense>
        <Product productId="697a42c1b69cff340257e509" />
      </Suspense>
      <FeaturedCollection />
      <FeaturedSection />
      <Footer />
    </div>
  );
};

export default page;
