import Stripe from 'stripe';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();

  if (!config.stripeSecretKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Stripe not configured'
    });
  }

  const stripe = new Stripe(config.stripeSecretKey, {
    apiVersion: '2025-11-17.clover',
  });

  // Validate ad data
  if (body.x === undefined || body.y === undefined || !body.width || !body.height) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid ad data'
    });
  }

  const { x, y, width, height, imageUrl, linkUrl, altText, ownerName } = body;
  const pixels = width * height;
  const pricePerPixel = 50000 / (1200 * 800); // EUR
  const priceInEur = Math.round(pixels * pricePerPixel * 100) / 100;
  const priceInCents = Math.round(priceInEur * 100); // Convert to cents

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Advent Grid Ad - ${width}x${height} pixels`,
              description: `Position: (${x}, ${y})`,
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${config.public.appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.public.appUrl}/`,
      metadata: {
        x: x.toString(),
        y: y.toString(),
        width: width.toString(),
        height: height.toString(),
        imageUrl: imageUrl || '',
        linkUrl: linkUrl || '',
        altText: altText || '',
        ownerName: ownerName || 'Anonymous',
        price: priceInEur.toString()
      }
    });

    return { sessionId: session.id, url: session.url };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    });
  }
});
