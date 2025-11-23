import { sql } from '@vercel/postgres';

export const useDb = () => {
  return {
    // Initialize table
    async init() {
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
    },

    // Get all ads
    async getAll() {
      const { rows } = await sql`SELECT * FROM ads`;
      // Convert numeric fields from strings to numbers (Postgres returns them as strings sometimes)
      return rows.map((row: any) => ({
        ...row,
        x: Number(row.x),
        y: Number(row.y),
        width: Number(row.width),
        height: Number(row.height),
        price: Number(row.price)
      }));
    },

    // Insert ad
    async insert(ad: any) {
      await sql`
        INSERT INTO ads (id, x, y, width, height, imageUrl, linkUrl, altText, ownerName, price)
        VALUES (${ad.id}, ${ad.x}, ${ad.y}, ${ad.width}, ${ad.height}, ${ad.imageUrl}, ${ad.linkUrl}, ${ad.altText}, ${ad.ownerName}, ${ad.price})
      `;
    },

    // Delete all ads
    async deleteAll() {
      await sql`DELETE FROM ads`;
    }
  };
};
