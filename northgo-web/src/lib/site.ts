export const siteConfig = {
  name: "Northgo",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.northgo.com",
  email: "info.tpe@northgo.com",
  tagline: "Making logistics effortless.",
};

export const serviceSlugs = [
  "freight-logistics",
  "project-logistics",
  "warehouse-logistics",
  "shipping-agency",
] as const;

export type ServiceSlug = (typeof serviceSlugs)[number];

export const legalSlugs = [
  "privacy-policy",
  "terms",
  "cookie-policy",
  "disclaimer",
] as const;

export type LegalSlug = (typeof legalSlugs)[number];
