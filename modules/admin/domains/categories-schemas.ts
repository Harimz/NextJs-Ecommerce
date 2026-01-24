import { z } from "zod";
import {
  categoriesInsertSchema,
  categoriesUpdateSchema,
  categoriesSelectSchema,
} from "@/db/schema";

export const createCategoryInput = categoriesInsertSchema
  .pick({
    name: true,
    slug: true,
    parentId: true,
  })
  .extend({
    name: z.string().min(2, "Name is required"),
    slug: z
      .string()
      .min(2)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use kebab-case (e.g. mens-shirts)"),
    parentId: z.string().uuid().optional().nullable(),
  });

export const updateCategoryInput = categoriesUpdateSchema
  .pick({
    name: true,
    slug: true,
    parentId: true,
  })
  .partial()
  .extend({
    id: z.string().uuid(),
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use kebab-case")
      .optional(),
    parentId: z.string().uuid().optional().nullable(),
  });

export const listCategoriesInput = z.object({
  q: z.string().trim().optional(),
});

export type Category = z.infer<typeof categoriesSelectSchema>;
export type CreateCategoryInput = z.infer<typeof createCategoryInput>;
