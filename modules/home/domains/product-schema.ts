import type { AppRouter } from "@/trpc/routers/_app";
import type { inferRouterOutputs } from "@trpc/server";

type RouterOutput = inferRouterOutputs<AppRouter>;

export type FeaturedProduct =
  RouterOutput["home"]["products"]["featured"][number];
export type NewArrivalProduct =
  RouterOutput["home"]["products"]["newArrivals"][number];
