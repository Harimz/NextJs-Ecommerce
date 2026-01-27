import {
  sizeCategoryEnum,
  sizesSelectSchema,
  sizesInsertSchema,
} from "@/db/schema";
import z from "zod";

export const sizeCategorySchema = z.enum(sizeCategoryEnum.enumValues);

export const createSizeFormSchema = sizesInsertSchema
  .pick({
    label: true,
    code: true,
    category: true,
    sortOrder: true,
  })
  .extend({
    label: z.string().min(2, "Name is required"),
    code: z.string().min(1, "Code is required"),
    category: sizeCategorySchema,
    sortOrder: z.number(),
  });

export type Size = z.infer<typeof sizesSelectSchema>;
export type CreateSizeFormValues = z.infer<typeof createSizeFormSchema>;
