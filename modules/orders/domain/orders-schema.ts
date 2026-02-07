import type { AppRouter } from "@/trpc/routers/_app";
import type { inferRouterOutputs } from "@trpc/server";

type RouterOutput = inferRouterOutputs<AppRouter>;

export type OrderOutput = RouterOutput["orders"]["getByStripeSessionId"];
export type OrderItemsOutput =
  RouterOutput["orders"]["getByStripeSessionId"]["items"];
export type OrderDetailsOutput =
  RouterOutput["orders"]["getByStripeSessionId"]["order"];
