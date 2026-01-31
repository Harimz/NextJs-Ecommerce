"use client";

import { GeneralDisplayError } from "@/modules/shared/components/GeneralDisplayError";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ProductCard } from "../components/product-card";
import { FeaturedProductsSkeleton } from "../skeletons/products-skeleton";
import { motion } from "motion/react";

export const FeaturedSection = () => {
  return (
    <Suspense fallback={<FeaturedProductsSkeleton />}>
      <ErrorBoundary
        FallbackComponent={({ error, resetErrorBoundary }) => (
          <GeneralDisplayError
            error={error}
            resetErrorBoundary={resetErrorBoundary}
          />
        )}
      >
        <FeaturedSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

export const FeaturedSectionSuspense = () => {
  const trpc = useTRPC();
  const { data: products } = useSuspenseQuery(
    trpc.home.products.featured.queryOptions(),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6 mt-6"
    >
      {products.map((product, i) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut", delay: i * 0.04 }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
};
