import { createTRPCRouter } from "@/trpc/init";
import { categoriesRouter } from "./routers/categories-router";
import { tagsRouter } from "./routers/tags-router";
import { productsRouter } from "./routers/products-router";

export const adminRouter = createTRPCRouter({
  categories: categoriesRouter,
  tags: tagsRouter,
  products: productsRouter,
});
