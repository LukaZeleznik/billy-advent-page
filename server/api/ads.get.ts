import { useDb } from '../utils/db';

export default defineEventHandler((event) => {
  const db = useDb();
  const stmt = db.prepare('SELECT * FROM ads');
  return stmt.all();
});
