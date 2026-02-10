import { Skeleton } from "@/components/ui/skeleton";

export const ProfileSkeleton = () => {
  return (
    <div className="mt-10 mb-20">
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-20" />
      </div>

      <div className="space-y-4 mt-6">
        {Array.from({ length: 3 }).map((_, orderIdx) => (
          <div
            key={orderIdx}
            className="border rounded-sm p-4 dark:bg-muted/25 space-y-4"
          >
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-4 w-32" />
              </div>

              <div className="flex items-center gap-4">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>

            <div className="space-y-6">
              {Array.from({ length: 2 }).map((_, itemIdx) => (
                <div
                  key={itemIdx}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-20 aspect-3/4 rounded-md" />

                    <div className="space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>

                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
