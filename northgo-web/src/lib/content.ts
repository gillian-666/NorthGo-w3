import type { Locale } from "@/i18n/routing";
import { getSanityClient, isSanityConfigured } from "./sanity";

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
};

/** Local seed / fallback until Sanity project is connected. */
const localPosts: Post[] = [];

export async function getPosts(locale: Locale): Promise<Post[]> {
  if (!isSanityConfigured()) return localPosts;

  try {
    const client = getSanityClient();
    const posts = await client.fetch<Post[]>(
      `*[_type == "post" && locale == $locale && defined(slug.current)] | order(publishedAt desc) {
        "slug": slug.current,
        title,
        excerpt,
        publishedAt
      }`,
      { locale },
    );
    return posts ?? localPosts;
  } catch {
    return localPosts;
  }
}
