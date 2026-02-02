import type { AppRouter } from "@/trpc/routers/_app";
import type { inferRouterOutputs } from "@trpc/server";

type RouterOutput = inferRouterOutputs<AppRouter>;

export type FeaturedProduct = RouterOutput["products"]["featured"][number];
export type NewArrivalProduct = RouterOutput["products"]["newArrivals"][number];

export type ProductDetails = RouterOutput["products"]["details"];
export type ProductImages = RouterOutput["products"]["details"]["images"];
