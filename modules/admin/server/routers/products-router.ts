import { adminProtectedProcedure, createTRPCRouter } from "@/trpc/init";
import { createProductInput } from "../../domains/products-schemas";

export const productsRouter = createTRPCRouter({
  create: adminProtectedProcedure
    .input(createProductInput)
    .mutation(async () => {}),
});
