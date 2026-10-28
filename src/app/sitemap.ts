import { MetadataRoute } from "next";
import { ALL_PROJECTS } from "@/data/projectsData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://danamholdings.in";
  const locales = ["en", "ta"];
  const staticPages = [
    "",
    "/about",
    "/services",
    "/projects",
    "/process",
    "/blog",
    "/contact",
  ];

  const now = new Date();

  const entries: MetadataRoute.Sitemap = [];

  // Generate localized URLs for all main pages
  for (const page of staticPages) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: now,
        changeFrequency: page === "" ? "daily" : "weekly",
        priority: page === "" ? 1.0 : page === "/projects" || page === "/services" ? 0.9 : 0.8,
      });
    }
  }

  // Add individual project entries
  for (const project of ALL_PROJECTS) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}/projects?id=${project.id}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
  }

  return entries;
}
