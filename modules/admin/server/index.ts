import { createTRPCRouter } from "@/trpc/init";
import { categoriesRouter } from "./routers/categories-router";

export const adminRouter = createTRPCRouter({
  categories: categoriesRouter,
});
