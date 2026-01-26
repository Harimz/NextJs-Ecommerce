import { requireAdmin } from "@/lib/guards";
import { CategoriesTagsView } from "@/modules/admin/ui/views/categories-tags-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React from "react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const AdminCategoriesTags = async () => {
  // await requireAdmin();

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(trpc.admin.categories.list.queryOptions({}));
  await queryClient.prefetchQuery(trpc.admin.tags.list.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CategoriesTagsView />
    </HydrationBoundary>
  );
};

export default AdminCategoriesTags;
