import z from "zod";
import { productReviewsInsertSchema } from "@/db/schema";

export const upsertReviewInput = productReviewsInsertSchema
  .pick({ productId: true, rating: true, title: true, body: true })
  .extend({
    rating: z.number().int().min(1).max(5),
    title: z.string().max(80).optional().nullable(),
    body: z.string().max(2000).optional().nullable(),
  });

export const deleteReviewInput = z.object({ productId: z.string().uuid() });
export const listReviewsInput = z.object({
  productId: z.string().uuid(),
  cursor: z.string().uuid().nullish(),
  limit: z.number().int().min(1).max(50).default(10),
});
