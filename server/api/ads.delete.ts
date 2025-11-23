import { useDb } from '../utils/db';

export default defineEventHandler(async (event) => {
  const db = useDb();
  await db.deleteAll();
  return { success: true };
});
