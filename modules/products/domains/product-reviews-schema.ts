import {
  departmentEnum,
  productReviewsInsertSchema,
  productTypeEnum,
} from "@/db/schema";
import type { AppRouter } from "@/trpc/routers/_app";
import type { inferRouterOutputs } from "@trpc/server";
import z from "zod";

type RouterOutput = inferRouterOutputs<AppRouter>;

export type UserProductReview = RouterOutput["productReviews"]["mine"];

export type FilteredProduct = RouterOutput["products"]["list"]["items"][number];

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

export const sortOptionSchema = z.enum([
  "newest",
  "price-asc",
  "price-desc",
  "rating",
]);

export const productsListCursorSchema = z.object({
  id: z.string().uuid(),

  createdAt: z.string().datetime().optional(),

  minPriceCents: z.number().int().optional(),

  ratingAvg: z.number().optional(),
  ratingCount: z.number().int().optional(),
});

export const productsListInput = z.object({
  q: z.string().trim().min(1).max(100).optional(),

  departments: z.array(z.enum(departmentEnum.enumValues)).default([]),
  productTypes: z.array(z.enum(productTypeEnum.enumValues)).default([]),

  minPriceCents: z.number().int().min(0).default(0),
  maxPriceCents: z.number().int().min(0).default(50000),

  onSale: z.boolean().default(false),

  sort: sortOptionSchema.default("newest"),

  limit: z.number().int().min(1).max(60).default(24),
  cursor: productsListCursorSchema.nullish(),
});

export type ProductsListInput = z.infer<typeof productsListInput>;
