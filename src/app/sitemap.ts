import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { featurePages } from "@/lib/pages";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: "weekly" | "monthly" | "yearly" = "monthly") => ({
    url: `${siteConfig.url}${path || "/"}`,
    lastModified: now,
    changeFrequency,
    priority,
  });
  return [
    page("", 1, "weekly"),
    page("/download", 0.9, "weekly"),
    page("/features", 0.8),
    ...featurePages().map((p) => page(`/features/${p.slug}`, 0.7)),
    page("/changelog", 0.6, "weekly"),
    page("/faq", 0.6),
    page("/support", 0.5),
    page("/about", 0.5),
    page("/privacy", 0.3, "yearly"),
    page("/terms", 0.3, "yearly"),
  ];
}
