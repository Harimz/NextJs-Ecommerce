import { adminProtectedProcedure, createTRPCRouter } from "@/trpc/init";
import { db } from "@/db";
import { colors } from "@/db/schema";
import { createColorSchema } from "../../domains/colors-schema";
import { slugify } from "../utils/helpers";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const colorsRouter = createTRPCRouter({
  create: adminProtectedProcedure
    .input(createColorSchema)
    .mutation(async ({ input }) => {
      const slug = input?.slug?.trim() || slugify(input.name);

      const [existing] = await db
        .select()
        .from(colors)
        .where(eq(colors.slug, slug));

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Color with that slug already exists",
        });
      }

      const [color] = await db
        .insert(colors)
        .values({ name: input.name, hex: input.hex, slug })
        .returning();

      return color;
    }),

  list: adminProtectedProcedure.query(async () => {
    const rows = await db.select().from(colors);

    return rows;
  }),

  delete: adminProtectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { id } = input;

      const [existing] = await db
        .select()
        .from(colors)
        .where(eq(colors.id, id));

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Color with id: ${id} does not exist`,
        });
      }

      const [color] = await db
        .delete(colors)
        .where(eq(colors.id, id))
        .returning();

      return color;
    }),
});
