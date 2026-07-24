import Hero from "@/components/Layout/Hero";
import GenderCollectionSection from "@/components/Layout/GenderCollectionSection";
import NewArrivalRouting from "../new-arrivals/page";
import WomenCollectionRouting from "../women-collection/page";
import Branding from "@/components/Products/Branding";
import Programs from "@/components/Products/Programs";
import MenCollectionRouting from "../men-collection/page";
import FeaturedProducts from "../featured-products/page";
import PreFooter from "@/components/Layout/PreFooter";

export const metadata = {
  metadataBase: new URL("https://next-rabbit.vercel.app"),
  title: {
    default: "Rabbit House - Dress Well, Live Better",
    template: "%s - Rabbit House",
  },
  description:
    "Rabbit House is a premium online clothing store offering stylish outfits, modern fashion, and comfortable everyday wear for men and women.",
  openGraph: {
    title: "Rabbit House - Dress Well, Live Better",
    siteName: "Rabbit House",
    images: [
      {
        url: "/assets/rabbit-banner.png",
        width: 1200,
        height: 630,
        alt: "Rabbit House Clothing - Dress Well, Live Better",
      },
    ],
    type: "website",
  },
};

const DiscoverPage = () => {
  return (
    <div>
      <Hero />
      <GenderCollectionSection />
      <NewArrivalRouting />
      <MenCollectionRouting />
      <WomenCollectionRouting />
      <FeaturedProducts />
      <Branding />
      <Programs />
      <PreFooter />
    </div>
  );
};

export default DiscoverPage;
