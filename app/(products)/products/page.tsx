import { departmentEnum, productTypeEnum } from "@/db/schema";
import { ProductsView } from "@/modules/products/ui/views/products-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React from "react";

const ProductsPage = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const sp = await searchParams;

  const input = {
    q: typeof sp.q === "string" ? sp.q : undefined,
    departments: toEnumArray(sp.departments, departmentEnum.enumValues),
    productTypes: toEnumArray(sp.productTypes, productTypeEnum.enumValues),
    onSale: sp.onSale === "true",
    minPriceCents: sp.minPrice ? Number(sp.minPrice) : 0,
    maxPriceCents: sp.maxPrice ? Number(sp.maxPrice) : 50000,
    sort: isSort(sp.sort) ? sp.sort : "newest",
    cursor: null,
    limit: 24,
  };

  const qc = getQueryClient();
  void qc.prefetchQuery(trpc.products.list.queryOptions(input));

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <ProductsView />
    </HydrationBoundary>
  );
};

export default ProductsPage;

function toArr(v: string | string[] | undefined): string[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

function toEnumArray<T extends readonly string[]>(
  v: string | string[] | undefined,
  allowed: T,
): T[number][] {
  const set = new Set(allowed);
  return toArr(v).filter((x): x is T[number] => set.has(x));
}

function isSort(
  v: unknown,
): v is "newest" | "price-asc" | "price-desc" | "rating" {
  return (
    v === "newest" || v === "price-asc" || v === "price-desc" || v === "rating"
  );
}
