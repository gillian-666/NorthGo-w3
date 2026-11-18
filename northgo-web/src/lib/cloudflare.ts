import type { D1Database } from "@cloudflare/workers-types";

export type NorthgoEnv = {
  DB: D1Database;
};

export async function getD1(): Promise<D1Database | null> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { env } = await getCloudflareContext({ async: true });
    const db = (env as NorthgoEnv | undefined)?.DB;
    return db ?? null;
  } catch {
    return null;
  }
}
