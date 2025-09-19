import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './shared/schema.ts',    // path to your schema files
  out: './migrations',             // folder for migrations
  dialect: 'postgresql',           // database dialect
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    // SSL only for production/cloud databases
    ...(process.env.NODE_ENV === 'production' && {
      ssl: { rejectUnauthorized: false }
    }),
  },
});
