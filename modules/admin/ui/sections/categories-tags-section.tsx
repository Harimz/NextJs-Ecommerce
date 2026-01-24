"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Header } from "../components/categories-tags/header";
export const CategoriesTagsSection = () => {
  return (
    <Suspense fallback="loading...">
      <ErrorBoundary fallback="Error..">
        <CategoriesTagsSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const CategoriesTagsSectionSuspense = () => {
  return (
    <div className="mt-6">
      <Header />
    </div>
  );
};
