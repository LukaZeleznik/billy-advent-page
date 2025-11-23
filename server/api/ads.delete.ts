import { useDb } from '../utils/db';

export default defineEventHandler((event) => {
  const db = useDb();
  const stmt = db.prepare('DELETE FROM ads');
  stmt.run();
  return { success: true };
});
