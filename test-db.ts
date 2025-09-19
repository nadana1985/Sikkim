import pg from "pg";
import 'dotenv/config';

const { Pool } = pg; // <-- destructure from default import

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // required for Render
});

async function test() {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("Connected! Current time:", res.rows[0]);
  } catch (err) {
    console.error("Connection error:", err);
  } finally {
    await pool.end();
  }
}

test();
