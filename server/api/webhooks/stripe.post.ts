import Stripe from 'stripe';
import { useDb } from '../../utils/db';
import { randomUUID } from 'crypto';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readRawBody(event);
  const signature = getHeader(event, 'stripe-signature');

  if (!config.stripeSecretKey || !config.stripeWebhookSecret) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Stripe not configured'
    });
  }

  if (!signature || !body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing signature or body'
    });
  }

  const stripe = new Stripe(config.stripeSecretKey, {
    apiVersion: '2025-11-17.clover',
  });

  try {
    const stripeEvent = stripe.webhooks.constructEvent(
      body,
      signature,
      config.stripeWebhookSecret
    );

    // Handle successful payment
    if (stripeEvent.type === 'checkout.session.completed') {
      const session = stripeEvent.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata;

      if (metadata) {
        const db = useDb();
        await db.init(); // Ensure table exists

        const ad = {
          id: randomUUID(),
          x: parseInt(metadata.x),
          y: parseInt(metadata.y),
          width: parseInt(metadata.width),
          height: parseInt(metadata.height),
          imageUrl: metadata.imageUrl,
          linkUrl: metadata.linkUrl,
          altText: metadata.altText || '',
          ownerName: metadata.ownerName || 'Anonymous',
          price: parseFloat(metadata.price)
        };

        await db.insert(ad);
        console.log('Ad saved from webhook:', ad.id);
      }
    }

    return { received: true };
  } catch (error: any) {
    console.error('Webhook error:', error.message);
    throw createError({
      statusCode: 400,
      statusMessage: `Webhook Error: ${error.message}`
    });
  }
});
