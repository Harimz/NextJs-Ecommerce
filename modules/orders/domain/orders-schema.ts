import type { AppRouter } from "@/trpc/routers/_app";
import type { inferRouterOutputs } from "@trpc/server";
import z from "zod";

type RouterOutput = inferRouterOutputs<AppRouter>;

export type OrderOutput = RouterOutput["orders"]["getByStripeSessionId"];
export type OrderItemsOutput =
  RouterOutput["orders"]["getByStripeSessionId"]["items"];
export type OrderDetailsOutput =
  RouterOutput["orders"]["getByStripeSessionId"]["order"];

export type UserOrdersOutput =
  RouterOutput["orders"]["getMine"]["items"][number];

export const getMineInput = z.object({
  cursor: z.string().nullish(),
  limit: z.number().min(1).max(20).default(10),
});
