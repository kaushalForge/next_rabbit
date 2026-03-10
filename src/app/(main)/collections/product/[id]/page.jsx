import Product from "@/components/pages/Product";
import NotFound from "@/app/404/page";

// ── Dynamic metadata ──
export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/products/${id}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      },
    );

    const product = await res.json();

    const title =
      product?.metaTitle?.trim() ||
      product?.name?.trim() ||
      "Rabbit - Dress Well, Live Better";
    const description =
      product?.metaDescription?.trim() ||
      product?.description?.trim() ||
      "Shop the latest styles at Rabbit.";
    const image = product?.images?.[0]?.url;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/collections/product/${id}`,
        siteName: "Rabbit",
        ...(image && {
          images: [{ url: image, width: 1200, height: 630, alt: title }],
        }),
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        ...(image && { images: [image] }),
      },
    };
  } catch {
    return {
      title: "Rabbit - Dress Well, Live Better",
      description: "Shop the latest styles at Rabbit.",
    };
  }
}

// ── Page ──
const page = async ({ params }) => {
  const { id } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/products/${id}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      cache: "no-store",
    },
  );

  const productDetails = await res.json();
  const { name } = productDetails;

  if (name) {
    return <Product productDetail={productDetails} productId={id} />;
  } else {
    return <NotFound />;
  }
};

export default page;
