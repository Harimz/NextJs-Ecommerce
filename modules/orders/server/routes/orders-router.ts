import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/trpc/init";
import { z } from "zod";
import { db } from "@/db";
import { TRPCError } from "@trpc/server";
import {
  colors,
  orderItems,
  orders,
  productImages,
  products,
  productVariants,
  sizes,
} from "@/db/schema";
import { and, desc, eq, inArray, lt, sql } from "drizzle-orm";
import { getMineInput } from "../../domain/orders-schema";

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

  getMine: protectedProcedure
    .input(getMineInput)
    .query(async ({ ctx, input }) => {
      const userId = ctx.auth.user.id;
      const limit = input.limit;
      const cursor = input.cursor ?? null;

      const rows = await db
        .select({
          id: orders.id,
          status: orders.status,
          createdAt: orders.createdAt,
          currency: orders.currency,
          totalCents: orders.totalCents,
        })
        .from(orders)
        .where(
          and(
            eq(orders.userId, userId),
            cursor ? lt(orders.id, cursor) : undefined,
          ),
        )
        .orderBy(desc(orders.createdAt), desc(orders.id))
        .limit(limit + 1);

      const nextCursor = rows.length > limit ? rows[limit]!.id : null;
      const page = rows.slice(0, limit);

      if (page.length === 0) {
        return { items: [], nextCursor };
      }

      const orderIds = page.map((o) => o.id);

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

      const itemRows = await db
        .select({
          id: orderItems.id,
          orderId: orderItems.orderId,
          createdAt: orderItems.createdAt,

          quantity: orderItems.quantity,
          nameSnapshot: orderItems.nameSnapshot,

          productSlug: products.slug,

          imageUrl: firstProductImage.imageUrl,

          size: sizes.label,
          color: colors.name,

          price: orderItems.unitPriceCentsSnapshot,
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
        .where(inArray(orderItems.orderId, orderIds))
        .orderBy(desc(orderItems.createdAt), desc(orderItems.id));

      const itemsByOrderId = new Map<
        string,
        Array<(typeof itemRows)[number]>
      >();

      for (const row of itemRows) {
        const arr = itemsByOrderId.get(row.orderId) ?? [];
        arr.push(row);
        itemsByOrderId.set(row.orderId, arr);
      }

      const items = page.map((o) => {
        const orderItemRows = itemsByOrderId.get(o.id) ?? [];

        const itemCount = orderItemRows.reduce(
          (acc, it) => acc + it.quantity,
          0,
        );

        const previewFirst = orderItemRows[0] ?? null;

        return {
          id: o.id,
          status: o.status,
          createdAt: o.createdAt,
          currency: o.currency,
          totalCents: o.totalCents,

          itemCount,

          previewTitle: previewFirst?.nameSnapshot ?? null,
          previewImageUrl: previewFirst?.imageUrl ?? null,

          previewItems: orderItemRows.slice(0, limit).map((it) => ({
            id: it.id,
            productSlug: it.productSlug,
            name: it.nameSnapshot,
            quantity: it.quantity,
            size: it.size ?? null,
            color: it.color ?? null,
            imageUrl: it.imageUrl ?? null,
            price: it.price,
          })),
        };
      });

      return { items, nextCursor };
    }),
});
