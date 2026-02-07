"use client";

import { useCart } from "@/modules/cart/api/cart-queries";
import { GeneralDisplayError } from "@/modules/shared/components/GeneralDisplayError";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { OrderSummary } from "../components/order-summary";
import { ArrowLeft, CreditCard, Lock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { centsToDollars } from "@/modules/admin/ui/utils/helpers";
import { Separator } from "@/components/ui/separator";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useCreateCheckoutSession } from "../../api/checkout-mutations";

export const CheckoutSection = () => {
  return (
    <Suspense fallback="Loading">
      <ErrorBoundary
        FallbackComponent={({ error, resetErrorBoundary }) => (
          <GeneralDisplayError
            error={error}
            resetErrorBoundary={resetErrorBoundary}
          />
        )}
      >
        <CheckoutSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const CheckoutSectionSuspense = () => {
  const trpc = useTRPC();

  const { data: cartData } = useCart();
  const { data: summary } = useSuspenseQuery(
    trpc.checkout.getSummary.queryOptions(),
  );

  const cartItems = cartData.items;
  const { subtotalCents, shippingCents, taxCents, discountCents, totalCents } =
    summary.totals;

  const { mutate: createCheckout, isPending } = useCreateCheckoutSession();

  const handleCheckout = () => {
    createCheckout({
      successUrl: `${window.location.origin}/checkout/success`,
      cancelUrl: `${window.location.origin}/checkout`,
    });
  };

  return (
    <>
      <Link href="/">
        <div className="py-6 flex gap-4 items-center cursor-pointer hover:underline">
          <ArrowLeft className="size-4" />
          <p>Back to Shopping</p>
        </div>
      </Link>

      <div className="flex flex-col md:flex-row gap-6">
        <OrderSummary cartItems={cartItems} />

        <div className="w-[30%] shadow-sm border rounded-md bg-white p-6">
          <h1 className="font-bold text-2xl mb-4">Payment</h1>

          <div className="space-y-4 text-muted-foreground">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{centsToDollars(subtotalCents)}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>
                {shippingCents === 0 ? "Free" : centsToDollars(shippingCents)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Tax</span>
              <span>{centsToDollars(taxCents)}</span>
            </div>

            {discountCents > 0 && (
              <div className="flex justify-between">
                <span>Discount</span>
                <span>-{centsToDollars(discountCents)}</span>
              </div>
            )}
          </div>

          <Separator className="my-6" />

          <div className="flex justify-between items-center mb-10">
            <h1 className="font-bold text-xl">Total</h1>

            <p className="font-bold text-xl">${centsToDollars(totalCents)}</p>
          </div>

          <Button
            variant="primary"
            className="w-full py-6 text-lg"
            disabled={isPending}
            onClick={handleCheckout}
          >
            <CreditCard className="size-4" />
            Pay with Stripe
          </Button>

          <div className="flex items-center gap-2 mt-4 text-muted-foreground justify-center">
            <Lock className="size-4" />
            <p>Payments are secure and encrypted</p>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 py-3 px-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-1.5">
              <div className="h-8 w-12 bg-[#635BFF] rounded flex items-center justify-center">
                <span className="text-white text-sm font-bold tracking-tight">
                  stripe
                </span>
              </div>

              <span className="text-sm text-muted-foreground">
                Secure checkout
              </span>
            </div>
          </div>

          <p className="text-center mt-6 text-muted-foreground">
            Free shipping on orders over $100
          </p>
        </div>
      </div>
    </>
  );
};
