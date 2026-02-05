import { db } from "@/db";
import {
  clearCartIdCookie,
  getCartIdCookie,
  setCartIdCookie,
} from "./cart-cookie";
import { cartItems, carts } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

type SessionUser = { id: string } | null;

const mergeCarts = async (fromCartId: string, toCartId: string) => {
  // Merge items: if same variant exists, add quantities
  // 1) Load items from fromCart
  const fromItems = await db
    .select()
    .from(cartItems)
    .where(eq(cartItems.cartId, fromCartId));

  for (const item of fromItems) {
    // Upsert by (cartId, variantId) unique index
    await db
      .insert(cartItems)
      .values({
        cartId: toCartId,
        variantId: item.variantId,
        quantity: item.quantity,
      })
      .onConflictDoUpdate({
        target: [cartItems.cartId, cartItems.variantId],
        set: {
          quantity: sql`${cartItems.quantity} + ${item.quantity}`,
          updatedAt: new Date(),
        },
      });
  }
};

export const clearActiveCartCookieOnly = async () => {
  await clearCartIdCookie();
};

/**
 * Finds an "open" cart by cookie and/or user.
 * Rules:
 * - If logged in: prefer user's open cart.
 * - If cookie cart exists and differs: merge cookie cart into user cart, then delete cookie cart.
 * - If no cart exists: create one (userId nullable) and set cookie.
 */
export const getOrCreateActiveCart = async (user: SessionUser) => {
  const cookieCartId = await getCartIdCookie();

  const userCart = user
    ? await db.query.carts.findFirst({
        where: (t, { and, eq }) =>
          and(eq(t.userId, user.id), eq(t.status, "open")),
      })
    : null;

  const cookieCart = cookieCartId
    ? await db.query.carts.findFirst({
        where: (t, { and, eq }) =>
          and(eq(t.id, cookieCartId), eq(t.status, "open")),
      })
    : null;

  if (user && userCart && cookieCart && userCart.id !== cookieCart.id) {
    await mergeCarts(cookieCart.id, userCart.id);
    // delete old cookie cart (cascades cart_items)
    await db.delete(carts).where(eq(carts.id, cookieCart.id));
    await setCartIdCookie(userCart.id);
    return userCart;
  }

  // If logged in, no user cart, but cookie cart exists => "claim" it
  if (user && !userCart && cookieCart) {
    await db
      .update(carts)
      .set({ userId: user.id, updatedAt: new Date() })
      .where(eq(carts.id, cookieCart.id));
    await setCartIdCookie(cookieCart.id);
    return { ...cookieCart, userId: user.id };
  }

  // If we have a user cart, use it and ensure cookie is set
  if (user && userCart) {
    await setCartIdCookie(userCart.id);
    return userCart;
  }

  // Guest: use cookie cart if exists
  if (!user && cookieCart) {
    await setCartIdCookie(cookieCart.id);
    return cookieCart;
  }

  // Otherwise create a new cart (userId nullable)
  const [created] = await db
    .insert(carts)
    .values({
      userId: user?.id ?? null,
      status: "open",
      currency: "usd",
    })
    .returning();

  await setCartIdCookie(created.id);
  return created;
};
