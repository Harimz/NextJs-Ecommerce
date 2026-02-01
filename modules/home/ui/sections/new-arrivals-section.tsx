"use client";

import { GeneralDisplayError } from "@/modules/shared/components/GeneralDisplayError";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { motion } from "motion/react";
import { ProductCard } from "../components/product-card";
import { DisplayProductsSkeleton } from "../skeletons/display-products-skeleton";

export const NewArrivalsSection = () => {
  return (
    <Suspense fallback={<DisplayProductsSkeleton />}>
      <ErrorBoundary
        FallbackComponent={({ error, resetErrorBoundary }) => (
          <GeneralDisplayError
            error={error}
            resetErrorBoundary={resetErrorBoundary}
          />
        )}
      >
        <NewArrivalsSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const NewArrivalsSectionSuspense = () => {
  const trpc = useTRPC();

  const { data: products } = useSuspenseQuery(
    trpc.home.products.newArrivals.queryOptions(),
  );

  const items = products.splice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6 mt-6"
    >
      {items.splice(0, 4).map((product, i) => (
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
