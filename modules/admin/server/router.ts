import { createTRPCRouter } from "@/trpc/init";
import { categoriesRouter } from "./categories-router";

export const adminRouter = createTRPCRouter({
  categories: categoriesRouter,
});
