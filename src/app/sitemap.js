export const revalidate = 86400;

export default async function sitemap() {
  const BASE_URL =
    process.env.NEXT_PUBLIC_SITE_URL;

  let products = [];

  try {
    const res = await fetch(`${BASE_URL}/api/products/search`, {
      cache: "no-store",
    });
    const data = await res.json();
    products = data.products ?? [];
  } catch (err) {
    console.error("Sitemap fetch failed:", err);
  }

  const staticPages = [
    { url: `${BASE_URL}`, lastModified: new Date() },
    { url: `${BASE_URL}/collections/all`, lastModified: new Date() },
    { url: `${BASE_URL}/about`, lastModified: new Date() },
    { url: `${BASE_URL}/contact`, lastModified: new Date() },
    { url: `${BASE_URL}/privacy-policy`, lastModified: new Date() },
    { url: `${BASE_URL}/terms-and-conditions`, lastModified: new Date() },
    { url: `${BASE_URL}/refund-policy`, lastModified: new Date() },
    { url: `${BASE_URL}/shipping-policy`, lastModified: new Date() },
    { url: `${BASE_URL}/faq`, lastModified: new Date() },
  ];

  const productPages = products.map((product) => ({
    url: `${BASE_URL}/collections/product/${product._id}`,
    lastModified: new Date(product.updatedAt),
  }));

  return [...staticPages, ...productPages];
}
