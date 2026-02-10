"use client";

import { GeneralDisplayError } from "@/modules/shared/components/GeneralDisplayError";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { OrderItemCard } from "../components/order-item-card";
import { ProfileSkeleton } from "../skeletons/order-history-skeleton";

export const OrderHistorySection = () => {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ErrorBoundary
        FallbackComponent={({ error, resetErrorBoundary }) => (
          <GeneralDisplayError
            error={error}
            resetErrorBoundary={resetErrorBoundary}
          />
        )}
      >
        <OrderHistorySectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const OrderHistorySectionSuspense = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.orders.getMine.queryOptions({}));

  return (
    <>
      <div className="mt-10 mb-20">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-2xl">Order History</h1>

          <p className="text-muted-foreground">{data.items.length} orders</p>
        </div>

        <div className="space-y-4 mt-6">
          {data.items.map((order) => (
            <OrderItemCard key={order.id} order={order} />
          ))}
        </div>
      </div>
    </>
  );
};
