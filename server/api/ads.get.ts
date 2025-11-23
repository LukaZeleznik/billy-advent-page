import { useDb } from '../utils/db';

export default defineEventHandler(async (event) => {
  const db = useDb();
  await db.init(); // Ensure table exists
  const rows = await db.getAll();
  return rows;
});
