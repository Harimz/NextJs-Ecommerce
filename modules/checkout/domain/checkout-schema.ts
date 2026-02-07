// modules/checkout/domain/checkout-schema.ts
import z from "zod";
import { AppRouter } from "@/trpc/routers/_app";

import { inferRouterOutputs } from "@trpc/server";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type CartItemOutput =
  RouterOutputs["cart"]["getMyCart"]["items"][number];

export const createCheckoutSessionInput = z.object({
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

export type CreateCheckoutSessionInput = z.infer<
  typeof createCheckoutSessionInput
>;
