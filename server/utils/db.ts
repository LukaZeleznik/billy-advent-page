import Database from 'better-sqlite3';
import { sql } from '@vercel/postgres';
import { mkdirSync } from 'fs';
import { dirname, join } from 'path';

// Check if we're using Postgres (production) or SQLite (local dev)
const usePostgres = !!process.env.POSTGRES_URL;

// SQLite setup for local dev
let sqliteDb: Database.Database | null = null;
if (!usePostgres) {
  const dbPath = join(process.cwd(), 'data', 'advent.db');
  mkdirSync(dirname(dbPath), { recursive: true });
  sqliteDb = new Database(dbPath);

  // Initialize SQLite table
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS ads (
      id TEXT PRIMARY KEY,
      x INTEGER NOT NULL,
      y INTEGER NOT NULL,
      width INTEGER NOT NULL,
      height INTEGER NOT NULL,
      imageUrl TEXT NOT NULL,
      linkUrl TEXT NOT NULL,
      altText TEXT NOT NULL,
      ownerName TEXT NOT NULL,
      price REAL NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export const useDb = () => {
  return {
    // Initialize table (Postgres only)
    async init() {
      if (usePostgres) {
        await sql`
          CREATE TABLE IF NOT EXISTS ads (
            id TEXT PRIMARY KEY,
            x INTEGER NOT NULL,
            y INTEGER NOT NULL,
            width INTEGER NOT NULL,
            height INTEGER NOT NULL,
            imageUrl TEXT NOT NULL,
            linkUrl TEXT NOT NULL,
            altText TEXT NOT NULL,
            ownerName TEXT NOT NULL,
            price REAL NOT NULL,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `;
      }
    },

    // Get all ads
    async getAll() {
      if (usePostgres) {
        const { rows } = await sql`SELECT * FROM ads`;
        // Convert lowercase Postgres fields to camelCase
        return rows.map((row: any) => ({
          id: row.id,
          x: Number(row.x),
          y: Number(row.y),
          width: Number(row.width),
          height: Number(row.height),
          imageUrl: row.imageurl,
          linkUrl: row.linkurl,
          altText: row.alttext,
          ownerName: row.ownername,
          price: Number(row.price),
          createdAt: row.createdat
        }));
      } else {
        // SQLite
        const rows = sqliteDb!.prepare('SELECT * FROM ads').all();
        return rows;
      }
    },

    // Insert ad
    async insert(ad: any) {
      if (usePostgres) {
        await sql`
          INSERT INTO ads (id, x, y, width, height, imageUrl, linkUrl, altText, ownerName, price)
          VALUES (${ad.id}, ${ad.x}, ${ad.y}, ${ad.width}, ${ad.height}, ${ad.imageUrl}, ${ad.linkUrl}, ${ad.altText}, ${ad.ownerName}, ${ad.price})
        `;
      } else {
        // SQLite
        const stmt = sqliteDb!.prepare(`
          INSERT INTO ads (id, x, y, width, height, imageUrl, linkUrl, altText, ownerName, price)
          VALUES (@id, @x, @y, @width, @height, @imageUrl, @linkUrl, @altText, @ownerName, @price)
        `);
        stmt.run(ad);
      }
    },

    // Delete all ads
    async deleteAll() {
      if (usePostgres) {
        await sql`DELETE FROM ads`;
      } else {
        // SQLite
        sqliteDb!.prepare('DELETE FROM ads').run();
      }
    }
  };
};
