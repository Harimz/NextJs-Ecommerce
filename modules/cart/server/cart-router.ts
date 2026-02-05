import { createTRPCRouter, publicProcedure } from "@/trpc/init";
import { getOrCreateActiveCart } from "./cart-service";
import {
  cartItems,
  carts,
  colors,
  productImages,
  products,
  productVariants,
  sizes,
} from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  addToCartInput,
  removeCartItemInput,
  updateCartItemQtyInput,
} from "../domain/cart-schema";
import { TRPCError } from "@trpc/server";

export const cartRouter = createTRPCRouter({
  getMyCart: publicProcedure.query(async ({ ctx }) => {
    const cart = await getOrCreateActiveCart(ctx.session?.user ?? null);

    const firstProductImage = db
      .selectDistinctOn([productImages.productId], {
        productId: productImages.productId,
        imageUrl: productImages.url,
      })
      .from(productImages)
      .orderBy(
        productImages.productId,
        productImages.sortOrder,
        productImages.createdAt,
      )
      .as("first_product_image");

    const items = await db
      .select({
        id: cartItems.id,
        variantId: cartItems.variantId,
        quantity: cartItems.quantity,

        priceCents: productVariants.priceCents,
        compareAtPriceCents: productVariants.compareAtPriceCents,
        inventory: productVariants.inventory,

        productId: products.id,
        productName: products.name,
        productSlug: products.slug,

        size: sizes.label,
        color: colors.name,

        imageUrl: firstProductImage.imageUrl,
      })
      .from(cartItems)
      .innerJoin(productVariants, eq(cartItems.variantId, productVariants.id))
      .innerJoin(products, eq(productVariants.productId, products.id))
      .leftJoin(firstProductImage, eq(firstProductImage.productId, products.id))
      .leftJoin(sizes, eq(productVariants.sizeId, sizes.id))
      .leftJoin(colors, eq(productVariants.colorId, colors.id))
      .where(eq(cartItems.cartId, cart.id));

    const subtotalCents = items.reduce(
      (acc, it) => acc + it.priceCents * it.quantity,
      0,
    );

    return {
      cart: {
        id: cart.id,
        currency: cart.currency,
        status: cart.status,
      },
      items,
      subtotalCents,
    };
  }),

  addItem: publicProcedure
    .input(addToCartInput)
    .mutation(async ({ ctx, input }) => {
      const cart = await getOrCreateActiveCart(ctx.session?.user ?? null);

      const variant = await db.query.productVariants.findFirst({
        where: (t, { and, eq }) =>
          and(eq(t.id, input.variantId), eq(t.active, true)),
      });

      if (!variant)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Variant not found.",
        });

      if (variant.inventory < input.quantity) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Not enough inventory.",
        });
      }

      await db
        .insert(cartItems)
        .values({
          cartId: cart.id,
          variantId: input.variantId,
          quantity: input.quantity,
        })
        .onConflictDoUpdate({
          target: [cartItems.cartId, cartItems.variantId],
          set: {
            quantity: sql`${cartItems.quantity} + ${input.quantity}`,
            updatedAt: new Date(),
          },
        });

      await db
        .update(carts)
        .set({ updatedAt: new Date() })
        .where(eq(carts.id, cart.id));

      return { ok: true, cartId: cart.id };
    }),

  updateItemQty: publicProcedure
    .input(updateCartItemQtyInput)
    .mutation(async ({ ctx, input }) => {
      const cart = await getOrCreateActiveCart(ctx.session?.user ?? null);

      if (input.quantity === 0) {
        await db
          .delete(cartItems)
          .where(
            and(
              eq(cartItems.cartId, cart.id),
              eq(cartItems.variantId, input.variantId),
            ),
          );
        await db
          .update(carts)
          .set({ updatedAt: new Date() })
          .where(eq(carts.id, cart.id));
        return { ok: true };
      }

      const variant = await db.query.productVariants.findFirst({
        where: (t, { eq }) => eq(t.id, input.variantId),
      });
      if (!variant)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Variant not found.",
        });
      if (variant.inventory < input.quantity) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Not enough inventory.",
        });
      }

      await db
        .update(cartItems)
        .set({ quantity: input.quantity, updatedAt: new Date() })
        .where(
          and(
            eq(cartItems.cartId, cart.id),
            eq(cartItems.variantId, input.variantId),
          ),
        );

      await db
        .update(carts)
        .set({ updatedAt: new Date() })
        .where(eq(carts.id, cart.id));

      return { ok: true };
    }),

  removeItems: publicProcedure
    .input(removeCartItemInput)
    .mutation(async ({ ctx, input }) => {
      const cart = await getOrCreateActiveCart(ctx.session?.user ?? null);

      await db
        .delete(cartItems)
        .where(
          and(
            eq(cartItems.cartId, cart.id),
            eq(cartItems.variantId, input.variantId),
          ),
        );

      return { ok: true };
    }),

  clearCart: publicProcedure.mutation(async ({ ctx }) => {
    const cart = await getOrCreateActiveCart(ctx.session?.user ?? null);

    await db.delete(cartItems).where(eq(cartItems.cartId, cart.id));
    await db
      .update(carts)
      .set({ updatedAt: new Date() })
      .where(eq(carts.id, cart.id));

    return { ok: true };
  }),
});
