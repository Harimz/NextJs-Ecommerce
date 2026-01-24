import { adminProtectedProcedure, createTRPCRouter } from "@/trpc/init";
import {
  createCategoryInput,
  listCategoriesInput,
  updateCategoryInput,
} from "../domains/categories-schemas";
import { db } from "@/db";
import { eq, ilike, or } from "drizzle-orm";
import { categories } from "@/db/schema";
import { TRPCError } from "@trpc/server";

export const categoriesRouter = createTRPCRouter({
  create: adminProtectedProcedure
    .input(createCategoryInput)
    .mutation(async ({ input }) => {
      const existing = await db.query.categories.findFirst({
        where: eq(categories.slug, input.slug),
        columns: { id: true },
      });

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "That slug is already in use.",
        });
      }

      const [created] = await db
        .insert(categories)
        .values({
          name: input.name,
          slug: input.slug,
          parentId: input.parentId ?? null,
        })
        .returning();

      return created;
    }),

  list: adminProtectedProcedure
    .input(listCategoriesInput)
    .query(async ({ input }) => {
      const q = input.q?.trim();
      const rows = await db
        .select()
        .from(categories)
        .where(
          q
            ? or(
                ilike(categories.name, `%${q}%`),
                ilike(categories.slug, `%${q}%`),
              )
            : undefined,
        );

      return rows;
    }),

  update: adminProtectedProcedure
    .input(updateCategoryInput)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;

      const [updated] = await db
        .update(categories)
        .set(data)
        .where(eq(categories.id, id))
        .returning();

      if (!updated) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found.",
        });
      }

      return updated;
    }),
});
