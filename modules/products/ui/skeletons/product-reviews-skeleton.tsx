import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const ProductReviewsSkeleton = () => {
  return (
    <div className="mb-20">
      <Skeleton className="h-10 w-72 my-10" />

      <div className="flex flex-col md:flex-row gap-10 w-full">
        <section className="w-full md:w-[30%] space-y-6">
          <div className="bg-secondary/30 rounded-lg p-6">
            <div className="text-center mb-6 space-y-3">
              <Skeleton className="h-14 w-20 mx-auto" />
              <div className="flex justify-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-5 w-5 rounded" />
                ))}
              </div>
              <Skeleton className="h-4 w-32 mx-auto" />
            </div>

            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-4 w-6" />
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-2 flex-1 rounded-full" />
                  <Skeleton className="h-4 w-8" />
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 border rounded-lg space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-7 w-7 rounded" />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-24 w-full rounded-md" />
            </div>

            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </section>

        <div className="flex-1 space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="flex gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-40" />
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <Skeleton key={j} className="h-4 w-4 rounded" />
                          ))}
                        </div>
                        <Skeleton className="h-4 w-28" />
                      </div>
                    </div>
                    <Skeleton className="h-9 w-9 rounded-md" />
                  </div>

                  <Skeleton className="h-5 w-56" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-11/12" />
                    <Skeleton className="h-4 w-10/12" />
                  </div>
                </div>
              </div>

              {i < 2 && <Skeleton className="h-px w-full" />}
            </div>
          ))}

          <div className="mt-8 text-center">
            <Skeleton className="h-10 w-44 mx-auto rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};
