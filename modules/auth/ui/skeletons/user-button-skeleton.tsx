import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export const UserButtonSkeleton = () => {
  return (
    <div className="flex gap-4 items-center">
      <Skeleton className="h-10 w-10 rounded-full" />

      <div className="space-y-1">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>

      <Skeleton className="h-4 w-4 rounded-sm" />
    </div>
  );
};
