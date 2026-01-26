"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Header } from "../components/categories-tags/header";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { GeneralDisplayError } from "@/modules/shared/components/GeneralDisplayError";

const ADMIN_REF_STALE = 5 * 60 * 1000; // 5 minutes

export const CategoriesTagsSection = () => {
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
        <CategoriesTagsSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const CategoriesTagsSectionSuspense = () => {
  const trpc = useTRPC();

  const { data: categories } = useSuspenseQuery({
    ...trpc.admin.categories.list.queryOptions({}),
    staleTime: ADMIN_REF_STALE,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const { data: tags } = useSuspenseQuery({
    ...trpc.admin.tags.list.queryOptions(),
    staleTime: ADMIN_REF_STALE,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return (
    <div className="mt-6">
      <Header categories={categories} tags={tags} />
    </div>
  );
};
