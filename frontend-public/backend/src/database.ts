import Database from 'better-sqlite3';
import path from 'path';
import { logger } from './logger';
import { dbQueryCounter, dbQueryDuration } from './metrics';

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'monastery360.db');

// Ensure data directory exists
import fs from 'fs';
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// ─── Database Connection Error Handling (B-105d) ─────────────────────────────
let db: InstanceType<typeof Database>;
try {
  db = new Database(DB_PATH);
  logger.info({ path: DB_PATH }, 'Database connected');
} catch (error) {
  logger.fatal({ err: error, path: DB_PATH }, 'Failed to connect to database');
  process.exit(1);
}

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS monasteries (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    history TEXT NOT NULL,
    architecture TEXT NOT NULL,
    rituals TEXT NOT NULL,
    foundedYear INTEGER NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    address TEXT NOT NULL,
    images TEXT NOT NULL DEFAULT '[]',
    virtualTourId TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS festivals (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    date TEXT NOT NULL,
    duration INTEGER NOT NULL,
    significance TEXT NOT NULL,
    monasteryId TEXT NOT NULL,
    images TEXT NOT NULL DEFAULT '[]',
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (monasteryId) REFERENCES monasteries(id)
  );

  CREATE TABLE IF NOT EXISTS tours (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    panoramaUrl TEXT,
    monasteryId TEXT NOT NULL,
    images TEXT NOT NULL DEFAULT '[]',
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (monasteryId) REFERENCES monasteries(id)
  );

  CREATE TABLE IF NOT EXISTS media (
    id TEXT PRIMARY KEY,
    fileName TEXT NOT NULL,
    filePath TEXT NOT NULL,
    thumbnailPath TEXT,
    fileType TEXT NOT NULL CHECK(fileType IN ('image', 'panoramic', 'video', 'audio')),
    description TEXT,
    monasteryId TEXT,
    festivalId TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (monasteryId) REFERENCES monasteries(id),
    FOREIGN KEY (festivalId) REFERENCES festivals(id)
  );
`);

// ─── Migrations ──────────────────────────────────────────────────────────────
// Add thumbnailPath column if missing (for existing databases)
const mediaColumns = db.prepare("PRAGMA table_info(media)").all() as { name: string }[];
if (!mediaColumns.some(col => col.name === 'thumbnailPath')) {
  db.exec('ALTER TABLE media ADD COLUMN thumbnailPath TEXT');
  logger.info('Migration: Added thumbnailPath column to media table');
}

// ─── Database Indexes (B-108b) ───────────────────────────────────────────────
// Add indexes for frequently queried columns to improve read performance.
// These are created AFTER tables so they reference existing objects.
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_monasteries_name ON monasteries(name);
  CREATE INDEX IF NOT EXISTS idx_monasteries_founded_year ON monasteries(foundedYear);
  CREATE INDEX IF NOT EXISTS idx_festivals_date ON festivals(date);
  CREATE INDEX IF NOT EXISTS idx_festivals_monastery_id ON festivals(monasteryId);
  CREATE INDEX IF NOT EXISTS idx_tours_monastery_id ON tours(monasteryId);
  CREATE INDEX IF NOT EXISTS idx_media_monastery_id ON media(monasteryId);
  CREATE INDEX IF NOT EXISTS idx_media_festival_id ON media(festivalId);
  CREATE INDEX IF NOT EXISTS idx_media_file_type ON media(fileType);
  CREATE INDEX IF NOT EXISTS idx_media_created_at ON media(createdAt);
`);
logger.info('Database indexes ensured');

// ─── Instrumented Database Wrapper (B-109) ──────────────────────────────────
// Wraps better-sqlite3 calls to record query metrics for Prometheus.
// Exposes the same API as the raw db object.

type BetterSqlite3Statement = ReturnType<typeof db.prepare>;

const originalPrepare = db.prepare.bind(db);
db.prepare = function instrumentedPrepare(sql: string) {
  const stmt = originalPrepare(sql);
  const originalGet = stmt.get.bind(stmt);
  const originalAll = stmt.all.bind(stmt);
  const originalRun = stmt.run.bind(stmt);

  // Extract operation type and table name from SQL for labeling
  const op = sql.trim().split(/\s+/)[0].toUpperCase(); // SELECT, INSERT, UPDATE, DELETE
  const tableMatch = sql.match(/(?:FROM|INTO|UPDATE|JOIN)\s+(\w+)/i);
  const table = tableMatch ? tableMatch[1].toLowerCase() : 'unknown';

  return {
    ...stmt,
    get(...args: unknown[]) {
      const end = dbQueryDuration.startTimer({ operation: op, table });
      try {
        const result = originalGet(...args);
        dbQueryCounter.inc({ operation: op, table });
        return result;
      } finally {
        end();
      }
    },
    all(...args: unknown[]) {
      const end = dbQueryDuration.startTimer({ operation: op, table });
      try {
        const result = originalAll(...args);
        dbQueryCounter.inc({ operation: op, table });
        return result;
      } finally {
        end();
      }
    },
    run(...args: unknown[]) {
      const end = dbQueryDuration.startTimer({ operation: op, table });
      try {
        const result = originalRun(...args);
        dbQueryCounter.inc({ operation: op, table });
        return result;
      } finally {
        end();
      }
    },
  } as unknown as BetterSqlite3Statement;
} as typeof db.prepare;

// Also instrument db.exec for DDL/DML statements
const originalExec = db.exec.bind(db);
db.exec = function instrumentedExec(sql: string) {
  const end = dbQueryDuration.startTimer({ operation: 'EXEC', table: 'multiple' });
  try {
    originalExec(sql);
    dbQueryCounter.inc({ operation: 'EXEC', table: 'multiple' });
  } finally {
    end();
  }
} as typeof db.exec;

export default db;
