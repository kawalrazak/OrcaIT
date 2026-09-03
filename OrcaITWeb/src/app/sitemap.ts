import type { MetadataRoute } from "next";
import { homeServiceArticles } from "@/data/home-service-articles";
import { servicePages } from "@/data/service-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://orcait.com.au";
  const now = new Date();

  const staticRoutes = [
    "",
    "/what-we-do",
    "/business-it",
    "/why-orca-it",
    "/about",
    "/book",
    "/book-now",
    "/privacy",
    "/terms",
    "/industries",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const homeArticles = homeServiceArticles.map((article) => ({
    url: `${base}/what-we-do/${article.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const businessServices = servicePages.map((service) => ({
    url: `${base}/services/${service.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  return [...staticRoutes, ...homeArticles, ...businessServices];
}
