import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from '@shared/schema';

// Optional: needed for Neon WebSocket support
neonConfig.webSocketConstructor = ws;

// Postgres pool
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Drizzle ORM instance
export const db = drizzle({ client: pool, schema });
