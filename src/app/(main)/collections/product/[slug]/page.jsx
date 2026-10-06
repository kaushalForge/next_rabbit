import Product from "@/components/pages/Product";
import NotFound from "@/app/404/page";

function seoTitle(name) {
  const clean = name?.trim() || "";
  const parts = clean.split(/[–\-—]/);
  return parts[0].trim();
}

function seoDescription(metaDesc, desc) {
  const raw = metaDesc?.trim() || desc?.trim() || "";
  return raw.length > 150 ? raw.slice(0, 147) + "..." : raw || "Shop the latest fashion online in Nepal at NepStyle.";
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://next-nepstyle.vercel.app";

  try {
    const res = await fetch(`${baseUrl}/api/products/${slug}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "default",
    });

    const product = await res.json();
    const name = product?.name?.trim();

    const title = product?.metaTitle?.trim() || seoTitle(name) || "Trendy Fashion Nepal";
    const description = seoDescription(product?.metaDescription, product?.description);
    const image = product?.images?.[0]?.url;

    return {
      title,
      description,
      alternates: {
        canonical: `${baseUrl}/collections/product/${slug}`,
      },
      openGraph: {
        title,
        description,
        url: `${baseUrl}/collections/product/${slug}`,
        siteName: "NepStyle Nepal",
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
      title: "Trendy Fashion Nepal",
      description: "Shop the latest fashion online in Nepal at NepStyle.",
    };
  }
}

function productJsonLd(product) {
  const name = product?.name?.trim();
  if (!name) return null;
  const price = product?.fashion?.[0]?.offerPrice || product?.fashion?.[0]?.price;
  const image = product?.images?.[0]?.url;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description: product?.description?.trim()?.slice(0, 200),
    image: image || undefined,
    ...(price && {
      offers: {
        "@type": "Offer",
        price,
        priceCurrency: "NPR",
        availability: (product?.fashion?.reduce?.((s, v) => s + (v.stock || 0), 0) || 0) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      },
    }),
  };
}

const page = async ({ params }) => {
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://next-nepstyle.vercel.app";

  const res = await fetch(`${baseUrl}/api/products/${slug}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    cache: "no-store",
  });

  const productDetails = await res.json();
  const { name } = productDetails;

  if (name) {
    const ld = productJsonLd(productDetails);
    return (
      <>
        {ld && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
          />
        )}
        <Product productDetail={productDetails} productId={productDetails._id} />
      </>
    );
  } else {
    return <NotFound />;
  }
};

export default page;