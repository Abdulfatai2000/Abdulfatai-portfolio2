import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
 const hostname = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined);
 return hostname ? [{url:hostname,changeFrequency:"monthly",priority:1}] : [];
}
