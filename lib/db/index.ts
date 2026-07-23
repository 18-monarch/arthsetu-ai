import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "@/lib/db/schema";

export function getDb() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return null;
  }

  return drizzle(databaseUrl, {
    schema,
  });
}