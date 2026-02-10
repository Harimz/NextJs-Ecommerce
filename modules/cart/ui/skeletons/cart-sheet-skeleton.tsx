"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export const CartSheetSkeleton = () => {
  return (
    <Sheet open>
      <SheetContent className="flex flex-col w-full sm:max-w-lg p-6">
        <SheetHeader className="space-y-2.5 pb-6">
          <SheetTitle className="flex items-center gap-2 font-display text-xl">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-5 w-24" />
          </SheetTitle>
        </SheetHeader>

        <div className="pb-2 text-sm text-muted-foreground">
          <Skeleton className="h-4 w-20" />
        </div>

        <div className="flex-1 -mx-6 px-6 overflow-hidden">
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <CartItemRowSkeleton key={i} />
            ))}
          </div>
        </div>

        <div className="pt-6 space-y-4">
          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>

            <div className="flex justify-between text-sm">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>

            <Separator />

            <div className="flex justify-between font-medium">
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>

          {/* buttons */}
          <div className="space-y-2">
            <Skeleton className="h-11 w-full rounded-md" />
            <Skeleton className="h-11 w-full rounded-md" />
          </div>

          <div className="flex justify-center">
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const CartItemRowSkeleton = () => {
  return (
    <div className="flex gap-4">
      <Skeleton className="aspect-[3/4] w-20 flex-shrink-0 rounded-md" />

      <div className="flex flex-1 flex-col">
        <div className="flex justify-between gap-4">
          <div className="min-w-0 space-y-2">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-4 w-28" />
          </div>

          <Skeleton className="h-8 w-8 rounded-md" />
        </div>

        <div className="flex items-end justify-between mt-auto pt-2">
          <div className="flex items-center border rounded-md overflow-hidden">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8 rounded-none" />
            <Skeleton className="h-8 w-8" />
          </div>

          <div className="text-right space-y-2">
            <Skeleton className="h-4 w-16 ml-auto" />
            <Skeleton className="h-3 w-20 ml-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};
