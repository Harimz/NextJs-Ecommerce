import { z } from "zod";

import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type CartItemOutput =
  RouterOutputs["cart"]["getMyCart"]["items"][number];

export const addToCartInput = z.object({
  variantId: z.string(),
  quantity: z.number().int().min(1).max(99).default(1),
});

export const updateCartItemQtyInput = z.object({
  variantId: z.string(),
  quantity: z.number().int().min(0).max(99),
});

export const removeCartItemInput = z.object({
  variantId: z.string(),
});
