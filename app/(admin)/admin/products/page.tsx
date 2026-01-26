import { requireAdmin } from "@/lib/guards";
import { ProductsView } from "@/modules/admin/ui/views/products-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React from "react";

const AdminProductsPage = async () => {
  await requireAdmin();
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(trpc.admin.categories.list.queryOptions({}));

  await queryClient.prefetchQuery(trpc.admin.tags.list.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductsView />
    </HydrationBoundary>
  );
};

export default AdminProductsPage;
