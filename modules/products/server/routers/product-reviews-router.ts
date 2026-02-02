import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import {
  deleteReviewInput,
  listReviewsInput,
  upsertReviewInput,
} from "../../domains/product-schema";
import { db } from "@/db";
import { productReviews, products, user } from "@/db/schema";
import { and, desc, eq, lt, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const productReviewsRouter = createTRPCRouter({
  list: baseProcedure.input(listReviewsInput).query(async ({ input }) => {
    const { productId, cursor, limit } = input;

    const rows = await db
      .select({
        id: productReviews.id,
        rating: productReviews.rating,
        title: productReviews.title,
        body: productReviews.body,
        createdAt: productReviews.createdAt,

        user: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
      })
      .from(productReviews)
      .leftJoin(user, eq(productReviews.userId, user.id))
      .where(
        cursor
          ? and(
              eq(productReviews.productId, productId),
              lt(productReviews.id, cursor),
            )
          : eq(productReviews.productId, productId),
      )
      .orderBy(desc(productReviews.createdAt), desc(productReviews.id))
      .limit(limit + 1);

    const nextCursor = rows.length > limit ? rows[limit]!.id : null;

    return {
      items: rows.slice(0, limit),
      nextCursor,
    };
  }),

  mine: protectedProcedure
    .input(deleteReviewInput)
    .query(async ({ input, ctx }) => {
      const [row] = await db
        .select()
        .from(productReviews)
        .where(
          and(
            eq(productReviews.productId, input.productId),
            eq(productReviews.userId, ctx.auth.user.id),
          ),
        );

      return row ?? null;
    }),

  upsert: protectedProcedure
    .input(upsertReviewInput)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.auth.user.id;

      return await db.transaction(async (tx) => {
        const [p] = await tx
          .select({
            id: products.id,
            ratingAvg: products.ratingAvg,
            ratingCount: products.ratingCount,
          })
          .from(products)
          .where(eq(products.id, input.productId));

        if (!p)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Product not found",
          });

        const [existing] = await tx
          .select()
          .from(productReviews)
          .where(
            and(
              eq(productReviews.productId, input.productId),
              eq(productReviews.userId, userId),
            ),
          );

        if (!existing) {
          const [created] = await tx
            .insert(productReviews)
            .values({
              productId: input.productId,
              userId,
              rating: input.rating,
              title: input.title ?? null,
              body: input.body ?? null,
            })
            .returning();

          await tx
            .update(products)
            .set({
              ratingCount: sql`${products.ratingCount} + 1`,
              ratingAvg: sql`
              round(
                (
                  (${products.ratingAvg}::numeric * ${products.ratingCount}::numeric) + ${input.rating}::numeric
                ) / (${products.ratingCount}::numeric + 1),
                2
              )
            `,
            })
            .where(eq(products.id, input.productId));

          return created;
        }

        const oldRating = existing.rating;

        const [updated] = await tx
          .update(productReviews)
          .set({
            rating: input.rating,
            title: input.title ?? null,
            body: input.body ?? null,
            updatedAt: new Date(),
          })
          .where(eq(productReviews.id, existing.id))
          .returning();

        if (oldRating !== input.rating) {
          await tx
            .update(products)
            .set({
              ratingAvg: sql`
              round(
                (
                  (${products.ratingAvg}::numeric * ${products.ratingCount}::numeric)
                  - ${oldRating}::numeric
                  + ${input.rating}::numeric
                ) / nullif(${products.ratingCount}::numeric, 0),
                2
              )
            `,
            })
            .where(eq(products.id, input.productId));
        }

        return updated;
      });
    }),

  remove: protectedProcedure
    .input(deleteReviewInput)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.auth.user.id;

      return await db.transaction(async (tx) => {
        const [p] = await tx
          .select({
            id: products.id,
            ratingAvg: products.ratingAvg,
            ratingCount: products.ratingCount,
          })
          .from(products)
          .where(eq(products.id, input.productId));

        if (!p)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Product not found",
          });

        const [existing] = await tx
          .select({ id: productReviews.id, rating: productReviews.rating })
          .from(productReviews)
          .where(
            and(
              eq(productReviews.productId, input.productId),
              eq(productReviews.userId, userId),
            ),
          );

        if (!existing) return { deleted: false };

        await tx
          .delete(productReviews)
          .where(eq(productReviews.id, existing.id));

        const oldRating = existing.rating;

        await tx
          .update(products)
          .set({
            ratingCount: sql`${products.ratingCount} - 1`,
            ratingAvg: sql`
            case
              when (${products.ratingCount} - 1) <= 0 then 0
              else round(
                (
                  (${products.ratingAvg}::numeric * ${products.ratingCount}::numeric) - ${oldRating}::numeric
                ) / (${products.ratingCount}::numeric - 1),
                2
              )
            end
          `,
          })
          .where(eq(products.id, input.productId));

        return { deleted: true };
      });
    }),
});
