"use client";

import { GeneralDisplayError } from "@/modules/shared/components/GeneralDisplayError";
import { useProductsFilter } from "../hooks/use-products-filter";
import { useTRPC } from "@/trpc/client";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { motion } from "motion/react";
import { ProductCard } from "../components/product-card";
import { DisplayProductsSkeleton } from "@/modules/home/ui/skeletons/display-products-skeleton";

export const FilteredProductsSection = () => {
  const { filters } = useProductsFilter();
  const trpc = useTRPC();

  const query = useQuery({
    ...trpc.products.list.queryOptions({
      q: filters.q || undefined,
      departments: filters.departments,
      productTypes: filters.productTypes,
      onSale: filters.onSale,
      minPriceCents: filters.minPrice,
      maxPriceCents: filters.maxPrice,
      sort: filters.sort,
      cursor: null,
      limit: 24,
    }),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

  if (query.isError) {
    return (
      <GeneralDisplayError
        error={query.error}
        resetErrorBoundary={() => query.refetch()}
      />
    );
  }

  const products = query.data?.items ?? [];

  return (
    <div className="w-full">
      {query.isFetching && <DisplayProductsSkeleton count={16} />}

      {products.length === 0 && (
        <p className="text-center text-muted-foreground mt-20">
          No products found
        </p>
      )}

      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={`grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6 mt-6 ${
          query.isFetching ? "opacity-60" : "opacity-100"
        }`}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </motion.div>
    </div>
  );
};
