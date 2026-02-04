import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const ProductDetailsSkeleton = () => {
  return (
    <div className="flex flex-col md:flex-row gap-6 mt-10">
      <div className="flex-1 space-y-2">
        <Skeleton className="w-full aspect-[3/4] rounded-md" />
        <div className="flex gap-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-30 aspect-[3/4] rounded-sm" />
          ))}
        </div>
      </div>

      <div className="flex-1 space-y-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-3/4" />
        <div className="flex gap-1 items-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-4 rounded" />
          ))}
        </div>
        <Skeleton className="h-8 w-28" />
        <div className="space-y-2 pt-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-10/12" />
        </div>
        <Skeleton className="h-px w-full my-6" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex gap-3 items-center">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-12 rounded-full" />
          ))}
        </div>
        <div className="flex items-center justify-between mt-6">
          <Skeleton className="h-6 w-14" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="grid grid-cols-4 gap-3 mt-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-md" />
          ))}
        </div>
        <div className="mt-6 space-y-3">
          <Skeleton className="h-6 w-24" />
          <div className="flex gap-4 items-center">
            <Skeleton className="h-12 w-12 rounded-md" />
            <Skeleton className="h-10 w-20 rounded-md" />
            <Skeleton className="h-12 w-12 rounded-md" />
          </div>
        </div>

        <div className="mt-10 flex gap-4">
          <Skeleton className="h-12 flex-1 rounded-md" />
          <Skeleton className="h-12 w-12 rounded-md" />
        </div>
        <Skeleton className="h-4 w-1/2 mt-4" />
      </div>
    </div>
  );
};
