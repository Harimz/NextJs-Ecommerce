import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/db";
import { eq, sql } from "drizzle-orm";
import { orderEvents, orders, productVariants } from "@/db/schema";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = (await headers()).get("stripe-signature");

  if (!sig)
    return new NextResponse("Missing stripe-signature", { status: 400 });

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = event.data.object as any;
    const orderId = session.metadata?.orderId;

    if (!orderId) return NextResponse.json({ ok: true, missingOrderId: true });

    await db.transaction(async (tx) => {
      const [order] = await tx
        .update(orders)
        .set({
          status: "paid",
          paidAt: new Date(),
          email: session.customer_details?.email,
          stripePaymentIntentId: session.payment_intent,
          shippingName: session.shipping_details?.name,
          shippingLine1: session.shipping_details?.address?.line1,
          shippingCity: session.shipping_details?.address?.city,
          shippingState: session.shipping_details?.address?.state,
          shippingPostal: session.shipping_details?.address?.postal_code,
          shippingCountry: session.shipping_details?.address?.country,
          updatedAt: new Date(),
        })
        .where(eq(orders.id, orderId))
        .returning();

      if (!order) {
        console.warn("No order row found for orderId:", orderId);
        return;
      }

      await tx.insert(orderEvents).values({
        orderId,
        provider: "stripe",
        type: "checkout_session_completed",
        payload: { sessionId: session.id },
      });

      const items = await tx.query.orderItems.findMany({
        where: (t, { eq }) => eq(t.orderId, orderId),
      });

      for (const item of items) {
        await tx
          .update(productVariants)
          .set({
            inventory: sql`${productVariants.inventory} - ${item.quantity}`,
            updatedAt: new Date(),
          })
          .where(eq(productVariants.id, item.variantId));
      }
    });
  }

  return NextResponse.json({ received: true });
}
