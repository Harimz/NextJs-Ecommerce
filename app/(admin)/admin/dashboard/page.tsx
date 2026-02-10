import { requireAdmin } from "@/lib/guards";
import { AdminDashboardView } from "@/modules/admin/ui/views/dashboard-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const AdminDashboard = async () => {
  await requireAdmin();
  const qc = getQueryClient();

  void qc.prefetchQuery(trpc.admin.analytics.kpis.queryOptions({ days: 30 }));
  void qc.prefetchQuery(
    trpc.admin.analytics.revenueOverview.queryOptions({ days: 30 }),
  );
  void qc.prefetchQuery(
    trpc.admin.analytics.recentOrders.queryOptions({ limit: 10 }),
  );
  void qc.prefetchQuery(
    trpc.admin.analytics.salesByDepartment.queryOptions({ days: 30 }),
  );

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <AdminDashboardView />
    </HydrationBoundary>
  );
};

export default AdminDashboard;
