import { adminProtectedProcedure, createTRPCRouter } from "@/trpc/init";
import { db } from "@/db";
import { sizes } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { createSizeFormSchema } from "../../domains/sizes-schema";

export const sizesRouter = createTRPCRouter({
  create: adminProtectedProcedure
    .input(createSizeFormSchema)
    .mutation(async ({ input }) => {
      const [existing] = await db
        .select()
        .from(sizes)
        .where(
          and(eq(sizes.category, input.category), eq(sizes.code, input.code)),
        );

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: `Size "${input.code}" already exists for ${input.category}`,
        });
      }

      const [size] = await db
        .insert(sizes)
        .values({
          category: input.category,
          code: input.code,
          label: input.label,
          sortOrder: input.sortOrder ?? 0,
        })
        .returning();

      return size;
    }),

  list: adminProtectedProcedure.query(async () => {
    const rows = await db.select().from(sizes);

    return rows;
  }),

  delete: adminProtectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const [existing] = await db
        .select()
        .from(sizes)
        .where(eq(sizes.id, input.id));

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Size with id: ${input.id} does not exist`,
        });
      }

      const [deleted] = await db
        .delete(sizes)
        .where(eq(sizes.id, input.id))
        .returning();

      return deleted;
    }),
});
