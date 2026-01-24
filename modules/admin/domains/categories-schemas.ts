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
    slug: z.string().optional(),
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

export type CategoryNode = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  createdAt: Date;
  productCount: number;
  children: CategoryNode[];
};

export let categoryNodeSchema: z.ZodType<CategoryNode>;

// eslint-disable-next-line prefer-const
categoryNodeSchema = z.lazy(() =>
  z.object({
    id: z.string().uuid(),
    name: z.string(),
    slug: z.string(),
    parentId: z.string().uuid().nullable(),
    createdAt: z.coerce.date(),
    productCount: z.coerce.number().int().nonnegative(),
    children: z.array(categoryNodeSchema),
  }),
) as z.ZodType<CategoryNode>;

export type Category = z.infer<typeof categoriesSelectSchema>;
export type CreateCategoryInput = z.infer<typeof createCategoryInput>;
