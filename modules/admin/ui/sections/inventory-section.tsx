"use client";

import { GeneralDisplayError } from "@/modules/shared/components/GeneralDisplayError";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { InventoryCard } from "../components/inventory/inventory-card";
import { InventoryFilter } from "../components/inventory/inventory-filter";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InventoryRow } from "../components/inventory/inventory-row";

export const InventorySection = () => {
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
        <InventorySectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const InventorySectionSuspense = () => {
  const trpc = useTRPC();
  const { data: products } = useSuspenseQuery({
    ...trpc.admin.products.list.queryOptions(),
  });

  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.active === true).length;
  const totalInventory = products.reduce((productAcc, product) => {
    const productInventory = product.variants.reduce(
      (variantAcc, variant) => variant.inventory + variantAcc,
      0,
    );

    return productInventory + productAcc;
  }, 0);

  console.log(totalInventory);

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <InventoryCard title="Total Products" value={totalProducts} />
        <InventoryCard title="Active" value={activeProducts} />
        <InventoryCard title="Total Inventory" value={totalInventory} />
        <InventoryCard title="Total Products" value={totalProducts} />
      </div>

      <InventoryFilter />

      <Table className="mt-6">
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Inventory</TableHead>
            <TableHead>Variants</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.map((product) => (
            <InventoryRow key={product.id} product={product} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
