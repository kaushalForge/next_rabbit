export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/discover"],
        disallow: ["/admin"],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
    host: process.env.NEXT_PUBLIC_SITE_URL,
  };
}
