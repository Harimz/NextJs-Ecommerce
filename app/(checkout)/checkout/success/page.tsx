import { CheckoutSuccessView } from "@/modules/orders/ui/views/checkout-success-view";
import { getQueryClient, trpc } from "@/trpc/server";
import React from "react";

const CheckoutSuccessPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    session_id: string;
  }>;
}) => {
  const { session_id } = await searchParams;

  const qc = getQueryClient();

  if (session_id) {
    void qc.prefetchQuery(
      trpc.orders.getByStripeSessionId.queryOptions({ sessionId: session_id }),
    );
  }

  return <CheckoutSuccessView sessionId={session_id} />;
};

export default CheckoutSuccessPage;
