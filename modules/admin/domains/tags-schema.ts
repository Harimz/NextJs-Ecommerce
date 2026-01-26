import { tagsInsertSchema, tagsSelectSchema } from "@/db/schema";
import z from "zod";

export const createTagInput = tagsInsertSchema
  .pick({
    name: true,
    slug: true,
  })
  .extend({
    name: z.string().min(2, "Name is required"),
    slug: z.string().optional(),
  });

export type CreateTagInput = z.infer<typeof createTagInput>;
export type Tag = z.infer<typeof tagsSelectSchema>;
