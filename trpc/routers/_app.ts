import { createTRPCRouter } from "../init";
import { adminRouter } from "@/modules/admin/server";
import { productsRouter } from "@/modules/products/server/routers/products-router";
import { productReviewsRouter } from "@/modules/products/server/routers/product-reviews-router";
import { cartRouter } from "@/modules/cart/server/cart-router";

export const appRouter = createTRPCRouter({
  admin: adminRouter,
  products: productsRouter,
  productReviews: productReviewsRouter,
  cart: cartRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
