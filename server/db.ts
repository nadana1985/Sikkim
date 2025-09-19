import pkg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";
import "dotenv/config";

const { Pool } = pkg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set.");
}

// Postgres pool configuration
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // SSL only for production/cloud databases, not for localhost
  ...(process.env.NODE_ENV === "production" && {
    ssl: { rejectUnauthorized: false },
  }),
});

// Drizzle ORM instance
export const db = drizzle(pool, { schema });
