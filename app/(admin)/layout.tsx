import { requireAdmin } from "@/lib/guards";
import { AdminSidebar } from "@/modules/admin/ui/components/sidebar/admin-sidebar";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React from "react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  await requireAdmin();

  const qc = getQueryClient();

  await qc.prefetchQuery(trpc.admin.categories.list.queryOptions({}));
  await qc.prefetchQuery(trpc.admin.tags.list.queryOptions());
  await qc.prefetchQuery(trpc.admin.colors.list.queryOptions());
  await qc.prefetchQuery(trpc.admin.sizes.list.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <main className="flex">
        <AdminSidebar />

        <div className="flex-1 bg-muted/50">{children}</div>
      </main>
    </HydrationBoundary>
  );
};

export default AdminLayout;
