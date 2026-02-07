import { db } from "@/db";
import {
  cartItems,
  orderEvents,
  orderItems,
  orders,
  products,
  productVariants,
} from "@/db/schema";
import { getOrCreateActiveCart } from "@/modules/cart/server/cart-service";
import { TRPCError } from "@trpc/server";
import { eq, sql } from "drizzle-orm";
import { calculateTotals } from "./totals";
import { stripe } from "@/lib/stripe";

type SessionUser = { id: string } | null;

export const resolveCartForCheckout = async (user: SessionUser) => {
  const cart = await getOrCreateActiveCart(user);

  const items = await db
    .select({
      cartItemId: cartItems.id,
      variantId: cartItems.variantId,
      quantity: cartItems.quantity,

      priceCents: productVariants.priceCents,
      inventory: productVariants.inventory,
      active: productVariants.active,

      productId: products.id,
      productName: products.name,
      productSlug: products.slug,
      sku: productVariants.sku,
    })
    .from(cartItems)
    .innerJoin(productVariants, eq(cartItems.variantId, productVariants.id))
    .innerJoin(products, eq(productVariants.productId, products.id))
    .where(eq(cartItems.cartId, cart.id));

  if (items.length === 0) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Cart is empty.",
    });
  }

  for (const it of items) {
    if (!it.active) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Variant is no longer available.`,
      });
    }
    if (it.inventory < it.quantity) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Not enough inventory for an item in your cart.`,
      });
    }
  }

  const totals = calculateTotals(
    items.map((it) => ({ priceCents: it.priceCents, quantity: it.quantity })),
  );

  return { cart, items, totals };
};

export const createOrderAndCheckoutSession = async ({
  user,
  successUrl,
  cancelUrl,
}: {
  user: { id: string } | null;
  successUrl: string;
  cancelUrl: string;
}) => {
  const { cart, items, totals } = await resolveCartForCheckout(user);

  return await db.transaction(async (tx) => {
    const [order] = await tx
      .insert(orders)
      .values({
        userId: user?.id ?? null,
        status: "pending",
        currency: cart.currency,

        subtotalCents: totals.subtotalCents,
        discountCents: totals.discountCents,
        shippingCents: totals.shippingCents,
        taxCents: totals.taxCents,
        totalCents: totals.totalCents,

        paymentProvider: "stripe",
      })
      .returning();

    for (const item of items) {
      await tx.insert(orderItems).values({
        orderId: order.id,
        productId: item.productId,
        variantId: item.variantId,

        nameSnapshot: item.productName,
        variantSnapshot: `${item.sku ?? ""}`,
        skuSnapshot: item.sku,
        unitPriceCentsSnapshot: item.priceCents,

        quantity: item.quantity,
        lineTotalCents: item.priceCents * item.quantity,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      allow_promotion_codes: true,

      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,

      customer_email: user ? undefined : undefined,

      shipping_address_collection: {
        allowed_countries: ["US"],
      },

      line_items: items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: cart.currency,
          unit_amount: item.priceCents,
          product_data: {
            name: item.productName,
          },
        },
      })),

      metadata: {
        orderId: order.id,
      },
    });

    await tx
      .update(orders)
      .set({
        stripeCheckoutSessionId: session.id,
        updatedAt: new Date(),
      })
      .where(sql`id = ${order.id}`);

    await tx.insert(orderEvents).values({
      orderId: order.id,
      provider: "stripe",
      type: "checkout_session_created",
      payload: { sessionId: session.id },
    });

    return {
      checkoutUrl: session.url,
      orderId: order.id,
    };
  });
};
