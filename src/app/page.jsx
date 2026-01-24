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
import React from "react";
import ProductDetails from "@/components/Layout/ProductDetails";
import Product from "@/components/pages/Product";

const page = () => {
  return (
    <div>
      <Header />
      <Hero />
      <GenderCollectionSection />
      <NewArrivalRouting />
      <WomenCollectionRouting />
      {/* <MenCollectionRouting /> */}
      <Product productId="6974f19d87a8af9ee3aa6b5f" />
      <ProductDetails />
      <FeaturedCollection />
      <FeaturedSection />
      <Footer />
    </div>
  );
};

export default page;
