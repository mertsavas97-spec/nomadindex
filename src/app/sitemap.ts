import type { MetadataRoute } from "next";

import { getAllCountryPairs } from "@/data/comparisons";
import { getAllCountries } from "@/data/countries";
import { getAllGuides } from "@/data/guides";
import { getAllVisaPrograms } from "@/data/visa-programs";
import { getPublishedPosts } from "@/lib/cms/posts";
import { absoluteUrl } from "@/lib/seo";
import { TOOL_LINKS } from "@/lib/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: absoluteUrl("/countries"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/visas"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/compare"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/tools"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/guides"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: absoluteUrl("/blog"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: absoluteUrl("/methodology"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: absoluteUrl("/about"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: absoluteUrl("/editorial-policy"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: absoluteUrl("/sources"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: absoluteUrl("/contact"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: absoluteUrl("/privacy"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: absoluteUrl("/terms"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const countryRoutes: MetadataRoute.Sitemap = getAllCountries().map(
    (country) => ({
      url: absoluteUrl(`/countries/${country.slug}`),
      lastModified: new Date(country.lastUpdated),
      changeFrequency: "weekly",
      priority: 0.8,
    })
  );

  const visaRoutes: MetadataRoute.Sitemap = getAllVisaPrograms().map(
    (program) => ({
      url: absoluteUrl(`/visas/${program.slug}`),
      lastModified: new Date(program.lastVerified),
      changeFrequency: "weekly",
      priority: 0.7,
    })
  );

  const compareRoutes: MetadataRoute.Sitemap = getAllCountryPairs().map(
    (pair) => ({
      url: absoluteUrl(`/compare/${pair.slug}`),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    })
  );

  const toolRoutes: MetadataRoute.Sitemap = TOOL_LINKS.map((tool) => ({
    url: absoluteUrl(`/tools/${tool.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const guideRoutes: MetadataRoute.Sitemap = getAllGuides().map((guide) => ({
    url: absoluteUrl(`/guides/${guide.slug}`),
    lastModified: new Date(guide.lastUpdated),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const blogRoutes: MetadataRoute.Sitemap = getPublishedPosts().map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.updatedAt),
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [
    ...staticRoutes,
    ...countryRoutes,
    ...visaRoutes,
    ...compareRoutes,
    ...toolRoutes,
    ...guideRoutes,
    ...blogRoutes,
  ];
}
