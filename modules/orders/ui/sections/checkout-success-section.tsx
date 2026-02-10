"use client";

import { useClearCart } from "@/modules/cart/api/cart-mutations";
import { GeneralDisplayError } from "@/modules/shared/components/GeneralDisplayError";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { CircleCheckBig, Mail, Truck } from "lucide-react";
import { useEffect, useRef } from "react";
import { Orderitems } from "../components/order-items";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckoutSuccessSkeleton } from "../skeletons/checkout-success-skeleton";

export const CheckoutSuccessSection = ({
  sessionId,
}: {
  sessionId: string;
}) => {
  const trpc = useTRPC();
  const clearedRef = useRef(false);
  const clearCart = useClearCart();

  const q = useQuery({
    ...trpc.orders.getByStripeSessionId.queryOptions(
      { sessionId },
      { enabled: !!sessionId },
    ),
    refetchInterval: (query) =>
      query.state?.data?.order?.status === "paid" ? false : 1500,
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (!q.data) return;
    if (q.data.order.status !== "paid") return;
    if (clearedRef.current) return;

    clearedRef.current = true;
    clearCart.mutate();
  }, [q.data, clearCart]);

  if (q.isLoading || !q.data) return <CheckoutSuccessSkeleton />;

  if (q.isError) {
    return (
      <GeneralDisplayError
        error={q.error}
        resetErrorBoundary={() => q.refetch()}
      />
    );
  }

  const { order, items } = q.data;
  const isPaid = order.status === "paid";

  return (
    <div className="py-10">
      <div className="flex flex-col items-center gap-2">
        <div className="bg-green-200/40 rounded-full p-4">
          <CircleCheckBig
            className={`size-12 ${isPaid ? "text-green-500" : "text-muted-foreground"}`}
          />
        </div>

        <h1 className="font-bold text-3xl">
          {isPaid ? "Order Confirmed!" : "Awaiting Payment Confirmation..."}
        </h1>

        <p className="text-muted-foreground text-center">
          {isPaid
            ? "Thank you for your purchase. Your order has been received."
            : "We are processing your payment — one moment please..."}
        </p>
      </div>

      <div className="bg-white dark:bg-muted rounded-sm p-6 border shadow-xs mt-10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="space-y-2 text-center md:text-start">
            <p className="text-muted-foreground">Order Number</p>
            <h1 className="font-bold text-xl">{order.id}</h1>
          </div>

          <div className="flex items-center gap-4 text-muted-foreground flex-col md:flex-row text-center md:text-start mt-10 md:mt-0">
            <Mail className="size-4" />
            <p>
              {order.email
                ? `Confirmation sent to ${order.email}`
                : "Confirmation email pending…"}
            </p>
          </div>
        </div>

        <div className="bg-muted/50 p-4 rounded-sm mt-6 flex items-center gap-4">
          <Truck className="text-custom-primary" />
          <div>
            <h2 className="font-bold text-lg">Estimated Delivery</h2>
            <p className="text-muted-foreground">Feb 12 - Feb 15, 2027</p>
          </div>
        </div>
      </div>

      <Orderitems orderItems={items} orderDetails={order} />

      <div className="bg-white dark:bg-muted rounded-sm p-6 border shadow-xs mt-10">
        <h1 className="font-bold text-xl mb-2">Shipping Address</h1>

        {order.shippingLine1 ? (
          <>
            <p className="text-muted-foreground">{order.shippingLine1}</p>
            {order.shippingLine2 && (
              <p className="text-muted-foreground">{order.shippingLine2}</p>
            )}
            <p className="text-muted-foreground">
              {order.shippingCity ? `${order.shippingCity}, ` : ""}
              {order.shippingState}, {order.shippingPostal}
            </p>
            <p className="text-muted-foreground">{order.shippingCountry}</p>
          </>
        ) : (
          <p className="text-muted-foreground">Shipping address pending…</p>
        )}
      </div>

      <div className="flex items-center justify-center gap-4 mt-6">
        <Button variant="outline" asChild>
          <Link href="/profile">View Order History</Link>
        </Button>
        <Button variant="primary" asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
};
