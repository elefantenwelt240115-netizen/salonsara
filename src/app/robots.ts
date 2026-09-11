import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/", "/hallo"],
    },
    sitemap: "https://salonsara.de/sitemap.xml",
  };
}
