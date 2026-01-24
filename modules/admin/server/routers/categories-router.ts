import { adminProtectedProcedure, createTRPCRouter } from "@/trpc/init";
import {
  categoryNodeSchema,
  createCategoryInput,
  listCategoriesInput,
  updateCategoryInput,
} from "../../domains/categories-schemas";
import { db } from "@/db";
import { eq, ilike, or, sql } from "drizzle-orm";
import {
  categories,
  categoriesInsertSchema,
  productCategories,
} from "@/db/schema";
import { TRPCError } from "@trpc/server";
import { buildCategoryTree, slugify } from "../utils/helpers";
import z from "zod";

export const categoriesRouter = createTRPCRouter({
  create: adminProtectedProcedure
    .input(createCategoryInput)
    .mutation(async ({ input }) => {
      const slug = input.slug?.trim() || slugify(input.name);

      const [created] = await db
        .insert(categories)
        .values({
          name: input.name,
          slug: slug,
          parentId: input.parentId ?? null,
        })
        .returning();

      return created;
    }),

  list: adminProtectedProcedure
    .input(listCategoriesInput)
    .output(z.array(categoryNodeSchema))
    .query(async ({ input }) => {
      const whereClause = input.q?.trim()
        ? or(
            ilike(categories.name, `%${input.q.trim()}%`),
            ilike(categories.slug, `%${input.q.trim()}%`),
          )
        : undefined;

      const rows = await db
        .select({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          parentId: categories.parentId,
          createdAt: categories.createdAt,
          productCount:
            sql<number>`COALESCE(COUNT(${productCategories.productId}), 0)`.as(
              "productCount",
            ),
        })
        .from(categories)
        .leftJoin(
          productCategories,
          eq(productCategories.categoryId, categories.id),
        )
        .where(whereClause)
        .groupBy(categories.id);

      const tree = buildCategoryTree(rows);
      const parsed = z.array(categoryNodeSchema).safeParse(tree);
      if (!parsed.success) {
        console.log(parsed.error.format());
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Bad output shape",
        });
      }

      return parsed.data;
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

  delete: adminProtectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { id } = input;

      const [existing] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, id));

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      await db.delete(categories).where(eq(categories.id, id));

      return { success: true };
    }),
});
