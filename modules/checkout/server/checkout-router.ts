import { createTRPCRouter, publicProcedure } from "@/trpc/init";
import { createCheckoutSessionInput } from "../domain/checkout-schema";
import {
  createOrderAndCheckoutSession,
  resolveCartForCheckout,
} from "./checkout-service";

export const checkoutRouter = createTRPCRouter({
  createCheckoutSession: publicProcedure
    .input(createCheckoutSessionInput)
    .mutation(async ({ ctx, input }) => {
      const result = await createOrderAndCheckoutSession({
        user: ctx?.session?.user ?? null,
        successUrl: input.successUrl,
        cancelUrl: input.cancelUrl,
      });

      return result;
    }),

  getSummary: publicProcedure.query(async ({ ctx }) => {
    const { cart, items, totals } = await resolveCartForCheckout(
      ctx.session?.user ?? null,
    );

    return {
      cart: { id: cart.id, currency: cart.currency },
      itemsCount: items.reduce((acc, it) => acc + it.quantity, 0),
      totals,
    };
  }),
});
