"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Header } from "../components/categories-tags/header";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { GeneralDisplayError } from "@/modules/shared/components/GeneralDisplayError";
import { TRPCError } from "@trpc/server";
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
  });

  const { data: tags } = useSuspenseQuery({
    ...trpc.admin.tags.list.queryOptions(),
  });

  return (
    <div className="mt-6">
      <Header categories={categories} tags={tags} />
    </div>
  );
};
