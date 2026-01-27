"use client";

import { Input } from "@/components/ui/input";
import { GeneralDisplayError } from "@/modules/shared/components/GeneralDisplayError";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { FaSearch } from "react-icons/fa";
import { CreateColorDialog } from "../components/colors/create-color-dialog";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ColorRow } from "../components/colors/color-row";

export const ColorsSection = () => {
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
        <ColorsSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const ColorsSectionSuspense = () => {
  const trpc = useTRPC();
  const { data: colors } = useSuspenseQuery(
    trpc.admin.colors.list.queryOptions(),
  );

  return (
    <div className="w-full mt-6">
      <div className="flex justify-between">
        <div className="relative w-100">
          <Input className="w-full pl-10" placeholder="Search categories..." />

          <FaSearch className="size-4 text-gray-500 absolute left-3.5 top-2.5" />
        </div>

        <CreateColorDialog />
      </div>

      <div className="mt-6 p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Name</TableHead>
              <TableHead className="text-muted-foreground">Slug</TableHead>
              <TableHead className="text-muted-foreground">Color</TableHead>
              <TableHead className="text-muted-foreground">Hex</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {colors.map((color) => (
              <ColorRow key={color.id} color={color} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
