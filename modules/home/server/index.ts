import { createTRPCRouter } from "@/trpc/init";
import { productsRouter } from "./routers/products-router";

export const homeRouter = createTRPCRouter({
  products: productsRouter,
});
