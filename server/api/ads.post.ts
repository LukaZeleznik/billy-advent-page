import { useDb } from '../utils/db';
import { randomUUID } from 'crypto';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const db = useDb();
  await db.init(); // Ensure table exists

  // Basic validation
  if (body.x === undefined || body.y === undefined || !body.width || !body.height || !body.imageUrl || !body.linkUrl) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields'
    });
  }

  const ad = {
    id: randomUUID(),
    x: body.x,
    y: body.y,
    width: body.width,
    height: body.height,
    imageUrl: body.imageUrl,
    linkUrl: body.linkUrl,
    altText: body.altText || '',
    ownerName: body.ownerName || 'Anonymous',
    price: body.price
  };

  await db.insert(ad);

  return ad;
});
