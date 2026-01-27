import { colorsInsertSchema, colorsSelectSchema } from "@/db/schema";
import z from "zod";

export const createColorSchema = colorsInsertSchema
  .pick({
    name: true,
    slug: true,
    hex: true,
  })
  .extend({
    name: z.string().min(2, "Name is required"),
    slug: z.string().optional(),
    hex: z.string().min(6, "Hex is required"),
  });

export type Color = z.infer<typeof colorsSelectSchema>;
export type CreateColorInput = z.infer<typeof createColorSchema>;
