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
import { useQueryState } from "nuqs";
import { parseAsString, parseAsInteger } from "nuqs";
import { useDebouncedValue } from "@/modules/shared/hooks/use-debounced-value";

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

  const [q, setQ] = useQueryState("q", parseAsString.withDefault(""));
  const [status, setStatus] = useQueryState(
    "status",
    parseAsString.withDefault("all"),
  );
  const [department, setDepartment] = useQueryState("dept", parseAsString);
  const [limit, setLimit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(20),
  );
  const [cursor, setCursor] = useQueryState("cursor", parseAsString);

  const debouncedQ = useDebouncedValue(q, 300);

  const { data } = useSuspenseQuery({
    ...trpc.admin.products.list.queryOptions({
      q: debouncedQ || undefined,
      status: status as "all" | "active" | "draft",
      department:
        (department as "MEN" | "WOMEN" | "KIDS" | "UNISEX" | undefined) ||
        undefined,
      limit,
      cursor: cursor ?? undefined,
    }),
  });

  const products = data.items;

  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.active === true).length;
  const totalInventory = products.reduce((productAcc, product) => {
    const productInventory = product.variants.reduce(
      (variantAcc, variant) => variant.inventory + variantAcc,
      0,
    );

    return productInventory + productAcc;
  }, 0);

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <InventoryCard title="Total Products" value={totalProducts} />
        <InventoryCard title="Active" value={activeProducts} />
        <InventoryCard title="Total Inventory" value={totalInventory} />
        <InventoryCard title="Total Products" value={totalProducts} />
      </div>

      <InventoryFilter
        q={q}
        onQChange={(v) => {
          setCursor(null);
          setQ(v);
        }}
        status={status as "all" | "active" | "draft"}
        onStatusChange={(v) => {
          setCursor(null);
          setStatus(v);
        }}
        department={department ?? ""}
        onDepartmentChange={(v) => {
          setCursor(null);
          setDepartment(v || null);
        }}
      />

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
