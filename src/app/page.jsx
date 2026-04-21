import Hero from "@/components/Layout/Hero";
import GenderCollectionSection from "@/components/Layout/GenderCollectionSection";
import NewArrivalRouting from "./(main)/new-arrivals/page";
import WomenCollectionRouting from "./(main)/women-collection/page";
import FetchingHelper from "@/components/Helper/fetchingHelper";
import Branding from "@/components/Products/Branding";
import Programs from "@/components/Products/Programs";
import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";
import React, { Suspense } from "react";
import MenCollectionRouting from "./(main)/men-collection/page";
import FeaturedProducts from "./(main)/featured-products/page";
import PreFooter from "@/components/Layout/PreFooter";
import HomeAnimation from "@/components/Animation/HomeAnimation";

const page = () => {
  return (
    <div>
      <Header />
      <Hero />
      <GenderCollectionSection />
      <NewArrivalRouting />
      <MenCollectionRouting />
      <WomenCollectionRouting />
      {/* <div className="relative"> */}
      <FeaturedProducts />
      {/* <HomeAnimation /> */}
      {/* </div> */}
      <Branding />
      <Programs />
      <PreFooter />
      <Footer />
    </div>
  );
};

export default page;
