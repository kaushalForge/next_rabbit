import Hero from "@/components/Layout/Hero";
import GenderCollectionSection from "@/components/Layout/GenderCollectionSection";
import NewArrivalRouting from "../new-arrivals/page";
import WomenCollectionRouting from "../women-collection/page";
import Branding from "@/components/Products/Branding";
import Programs from "@/components/Products/Programs";
import MenCollectionRouting from "../men-collection/page";
import FeaturedProducts from "../featured-products/page";
import PreFooter from "@/components/Layout/PreFooter";

export const dynamic = "force-dynamic";

export const metadata = {
  metadataBase: new URL("https://next-rabbit.vercel.app"),
  title: {
    default: "RabbitHub - Dress Well, Live Better",
    template: "%s - RabbitHub",
  },
  description:
    "RabbitHub is a premium online clothing store offering stylish outfits, modern fashion, and comfortable everyday wear for men and women.",
  openGraph: {
    title: "RabbitHub - Dress Well, Live Better",
    siteName: "RabbitHub",
    images: [
      {
        url: "/assets/rabbit-banner.png",
        width: 1200,
        height: 630,
        alt: "RabbitHub Clothing - Dress Well, Live Better",
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
