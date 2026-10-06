import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";
import CollectionPage from "@/components/pages/Collections/CollectionPage";
import { fetchAllProductsAction } from "@/actions/userProducts";

export const metadata = {
  title: "Trendy Fashion Nepal – Online Shopping Store",
  description:
    "Shop trendy fashion online in Nepal at NepStyle. Stylish clothing for men and women with delivery across Kathmandu, Pokhara and all Nepal.",

  keywords: [
    "online shopping in Nepal",
    "fashion store Nepal",
    "men clothing Nepal",
    "women clothing Nepal",
    "NepStyle Nepal",
    "trendy outfits Kathmandu",
    "online clothing store Nepal",
    "buy clothes online Nepal",
    "Nepali fashion store",
    "clothing delivery Nepal",
  ],

  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}`,
  },

  openGraph: {
    title: "Trendy Fashion Nepal – Online Shopping Store | NepStyle Nepal",
    description:
    "Shop trendy fashion online in Nepal at NepStyle. Stylish clothing for men and women with delivery across Kathmandu, Pokhara and all Nepal.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
    siteName: "NepStyle Nepal",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/assets/hero-banner.png`,
        width: 1200,
        height: 630,
        alt: "NepStyle Clothing Collection Banner",
      },
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/images/NepStyle.png`,
        width: 600,
        height: 600,
        alt: "NepStyle Logo",
      },
    ],
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

const HomePage = async (props) => {
  const query = await props.searchParams;
  query.collection = "all";
  let products = [];
  try {
    const res = await fetchAllProductsAction(query);
    products = res;
  } catch (err) {
    console.error("Error fetching products:", err);
  }
  return (
    <>
      <Header />
      <main className="flex-1">
        <CollectionPage products={products} />
      </main>
      <Footer />
    </>
  );
};

export default HomePage;
