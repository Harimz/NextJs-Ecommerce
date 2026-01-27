"use client";

import { Input } from "@/components/ui/input";
import { GeneralDisplayError } from "@/modules/shared/components/GeneralDisplayError";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { FaSearch } from "react-icons/fa";
import { CreateSizeDialog } from "../components/sizes/create-size-dialog";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SizeRow } from "../components/sizes/size-row";

export const SizesSection = () => {
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
        <SizesSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const SizesSectionSuspense = () => {
  const trpc = useTRPC();

  const { data: sizes } = useSuspenseQuery(
    trpc.admin.sizes.list.queryOptions(),
  );

  return (
    <div className="w-full mt-6">
      <div className="flex justify-between">
        <div className="relative w-100">
          <Input className="w-full pl-10" placeholder="Search sizes..." />

          <FaSearch className="size-4 text-gray-500 absolute left-3.5 top-2.5" />
        </div>

        <CreateSizeDialog />
      </div>

      <div className="mt-6 p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Label</TableHead>
              <TableHead className="text-muted-foreground">Category</TableHead>
              <TableHead className="text-muted-foreground">Code</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {sizes.map((size) => (
              <SizeRow key={size.id} size={size} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
