import CollectionPage from "@/components/pages/Collections/CollectionPage";
import { fetchAllProductsAction } from "@/actions/userProducts";

export const metadata = {
  title: "Premium Fashion, Trendy Outfits & Casual Dress",
  description:
    "Discover premium fashion at Rabbit. Shop stylish outfits for men and women including streetwear, everyday essentials, and trendy looks with worldwide shipping.",

  keywords: [
    "Rabbit clothing",
    "fashion store",
    "men clothing",
    "women clothing",
    "streetwear",
    "trendy outfits",
    "online clothing store",
    "casual dress",
    "print on demand",
    "premium fashion",
  ],

  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/collections/all`,
  },

  openGraph: {
    title: "Rabbit | Premium Fashion – Trendy Outfits & Casual Dress",
    description:
      "Explore Rabbit's premium fashion collections for men and women. Stylish streetwear, trendy outfits, and everyday essentials.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/collections/all`,
    siteName: "Rabbit",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/assets/hero-banner.png`,
        width: 1200,
        height: 630,
        alt: "Rabbit Clothing Collection Banner",
      },
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/images/RabbitHub.png`,
        width: 600,
        height: 600,
        alt: "Rabbit Logo",
      },
    ],
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

const AllCollections = async (props) => {
  const query = await props.searchParams;
  query.collection = "all";
  let products = [];
  try {
    const res = await fetchAllProductsAction(query);
    products = res;
  } catch (err) {
    console.error("Error fetching products:", err);
  }
  return <CollectionPage products={products} />;
};

export default AllCollections;
