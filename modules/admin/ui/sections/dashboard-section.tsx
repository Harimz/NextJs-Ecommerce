"use client";

import { GeneralDisplayError } from "@/modules/shared/components/GeneralDisplayError";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { AnalyticsCards } from "../components/dashboard/analytics-cards";
import { RevenueOverview } from "../components/dashboard/revenue-overview";
import { RecentOrdersAndSalesByDepartment } from "../components/dashboard/recent-orders-table";

export const DashboardSection = () => {
  return (
    <Suspense fallback="loading...">
      <ErrorBoundary
        FallbackComponent={({ error, resetErrorBoundary }) => (
          <GeneralDisplayError
            error={error}
            resetErrorBoundary={resetErrorBoundary}
          />
        )}
      >
        <DashboardSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const DashboardSectionSuspense = () => {
  const trpc = useTRPC();

  const { data: kpis } = useSuspenseQuery(
    trpc.admin.analytics.kpis.queryOptions({ days: 30 }),
  );
  const { data: revenueOverview } = useSuspenseQuery(
    trpc.admin.analytics.revenueOverview.queryOptions({ days: 30 }),
  );
  const { data: recentOrders } = useSuspenseQuery(
    trpc.admin.analytics.recentOrders.queryOptions({ limit: 10 }),
  );
  const { data: salesByDepartment } = useSuspenseQuery(
    trpc.admin.analytics.salesByDepartment.queryOptions({ days: 30 }),
  );

  console.log(revenueOverview);

  return (
    <div className="space-y-6">
      <AnalyticsCards kpis={kpis} />

      <RevenueOverview points={revenueOverview.points} />

      <RecentOrdersAndSalesByDepartment
        recentOrders={recentOrders}
        salesByDepartment={salesByDepartment}
      />
    </div>
  );
};
