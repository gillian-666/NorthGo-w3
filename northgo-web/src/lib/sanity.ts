import { createClient, type SanityClient } from "@sanity/client";

export function isSanityConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
      process.env.NEXT_PUBLIC_SANITY_DATASET,
  );
}

let client: SanityClient | null = null;

export function getSanityClient(): SanityClient {
  if (!isSanityConfigured()) {
    throw new Error("Sanity is not configured");
  }
  if (!client) {
    client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
      apiVersion: "2025-01-01",
      useCdn: true,
      token: process.env.SANITY_API_READ_TOKEN,
    });
  }
  return client;
}
