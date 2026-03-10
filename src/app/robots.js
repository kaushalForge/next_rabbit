export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/collections/all?gender=Male",
          "/collections/all?gender=Female",
          "/collections/all?mainCategory=Fashion&gender=Male",
          "/collections/all?mainCategory=Fashion&gender=Female",
        ],
        disallow: [
          "/admin",
          "/admin/",
          "/api/",
          "/dashboard",
          "/_next/",
          "/private/",
          "/*?*", // still blocks all other query strings
        ],
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "CCBot",
          "anthropic-ai",
          "Claude-Web",
          "Google-Extended",
        ],
        disallow: "/",
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
    host: process.env.NEXT_PUBLIC_SITE_URL,
  };
}
