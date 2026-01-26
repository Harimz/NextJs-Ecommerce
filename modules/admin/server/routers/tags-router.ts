import { adminProtectedProcedure, createTRPCRouter } from "@/trpc/init";
import { createTagInput } from "../../domains/tags-schema";
import { slugify } from "../utils/helpers";
import { db } from "@/db";
import { tags } from "@/db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const tagsRouter = createTRPCRouter({
  create: adminProtectedProcedure
    .input(createTagInput)
    .mutation(async ({ input }) => {
      const name = input.name.trim();
      const slug = input.slug?.trim() || slugify(name);

      const [existing] = await db
        .select({ id: tags.id })
        .from(tags)
        .where(eq(tags.slug, slug));

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "That tag slug is already in use.",
        });
      }

      const [tag] = await db.insert(tags).values({ name, slug }).returning();
      return tag;
    }),

  list: adminProtectedProcedure.query(async () => {
    const rows = await db.select().from(tags);

    return rows;
  }),
});
