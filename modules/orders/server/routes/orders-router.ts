import { createTRPCRouter, publicProcedure } from "@/trpc/init";
import { z } from "zod";
import { db } from "@/db";
import { TRPCError } from "@trpc/server";
import {
  colors,
  orderItems,
  productImages,
  products,
  productVariants,
  sizes,
} from "@/db/schema";
import { eq } from "drizzle-orm";

export const ordersRouter = createTRPCRouter({
  getByStripeSessionId: publicProcedure
    .input(z.object({ sessionId: z.string().min(1) }))
    .query(async ({ input, ctx }) => {
      const order = await db.query.orders.findFirst({
        where: (t, { eq }) => eq(t.stripeCheckoutSessionId, input.sessionId),
      });

      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found for this checkout session.",
        });
      }

      if (order.userId && ctx.session?.user?.id !== order.userId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not Authorized" });
      }

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
          id: orderItems.id,
          orderId: orderItems.orderId,

          quantity: orderItems.quantity,
          lineTotalCents: orderItems.lineTotalCents,

          nameSnapshot: orderItems.nameSnapshot,
          variantSnapshot: orderItems.variantSnapshot,
          skuSnapshot: orderItems.skuSnapshot,
          unitPriceCentsSnapshot: orderItems.unitPriceCentsSnapshot,

          productId: orderItems.productId,
          productSlug: products.slug,

          imageUrl: firstProductImage.imageUrl,

          size: sizes.label,
          color: colors.name,
        })
        .from(orderItems)
        .innerJoin(products, eq(orderItems.productId, products.id))
        .leftJoin(
          firstProductImage,
          eq(firstProductImage.productId, products.id),
        )
        .leftJoin(productVariants, eq(orderItems.variantId, productVariants.id))
        .leftJoin(sizes, eq(productVariants.sizeId, sizes.id))
        .leftJoin(colors, eq(productVariants.colorId, colors.id))
        .where(eq(orderItems.orderId, order.id));

      return { order, items };
    }),
});
