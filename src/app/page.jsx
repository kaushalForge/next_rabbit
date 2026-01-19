import Hero from "@/components/Layout/Hero";
import GenderCollectionSection from "@/components/Layout/GenderCollectionSection";
import NewArrivalRouting from "./(main)/new-arrivals/page";
import WomenCollectionRouting from "./(main)/women-collection/page";
import MenCollectionRouting from "./(main)/men-collection/page";
import FetchingHelper from "@/components/Helper/fetchingHelper";
import FeaturedCollection from "@/components/Products/FeaturedCollection";
import FeaturedSection from "@/components/Products/FeaturedSection";
import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";
import React from "react";

const page = () => {
  return (
    <div>
      <Header />
      <Hero />
      <GenderCollectionSection />
      <NewArrivalRouting />
      <WomenCollectionRouting />
      <MenCollectionRouting />
      <FetchingHelper id="67c55f6d4e677e943798a3ec" />
      <FeaturedCollection />
      <FeaturedSection />
      <Footer />
    </div>
  );
};

export default page;
