import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export const CheckoutSectionSkeleton = () => {
  return (
    <div className="w-full">
      <div className="py-6 flex gap-4 items-center">
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-4 w-36" />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 shadow-sm border rounded-md bg-white dark:bg-muted p-6">
          <Skeleton className="h-9 w-56 mb-6" />

          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="relative">
                  <Skeleton className="h-30 w-[90px] rounded-md" />
                  <Skeleton className="absolute -top-2 -right-2 h-7 w-7 rounded-full" />
                </div>

                <div className="w-full space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <Skeleton className="h-6 w-56" />
                    <Skeleton className="h-7 w-20" />
                  </div>

                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full md:w-[30%] shadow-sm border rounded-md bg-white dark:bg-muted p-6">
          <Skeleton className="h-8 w-28 mb-4" />

          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}

            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>

          <Separator className="my-6" />

          <div className="flex justify-between items-center mb-10">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-7 w-24" />
          </div>

          <div className="w-full">
            <div className="w-full h-14 rounded-md border flex items-center justify-center gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 justify-center">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-48" />
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 py-3 px-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-12 rounded" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Skeleton className="h-4 w-56" />
          </div>
        </div>
      </div>
    </div>
  );
};
