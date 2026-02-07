import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Package } from "lucide-react";

export const CheckoutSuccessSkeleton = () => {
  return (
    <div className="py-10">
      <div className="flex flex-col items-center gap-2">
        <Skeleton className="h-20 w-20 rounded-full" />
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-4 w-[28rem]" />
        <Skeleton className="h-4 w-80" />
      </div>

      <div className="bg-white rounded-sm p-6 border shadow-xs mt-10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="space-y-2 text-center md:text-start">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-7 w-64" />
          </div>

          <div className="flex items-center gap-4 flex-col md:flex-row text-center md:text-start mt-10 md:mt-0">
            <Skeleton className="h-4 w-72" />
          </div>
        </div>

        <div className="bg-muted/50 p-4 rounded-sm mt-6 flex items-center gap-4">
          <Skeleton className="h-6 w-6 rounded" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-52" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-sm p-6 border shadow-xs mt-6">
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-6 w-46" />
        </div>

        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="flex gap-4 py-3">
            <Skeleton className="relative aspect-[3/4] h-20 md:h-30 rounded-md" />

            <div className="flex justify-between w-full gap-4">
              <div className="space-y-2 w-full">
                <Skeleton className="h-5 w-56" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-24" />
              </div>

              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        ))}

        <Separator className="my-6" />

        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-7 w-28" />
        </div>
      </div>

      <div className="bg-white rounded-sm p-6 border shadow-xs mt-10">
        <Skeleton className="h-6 w-40 mb-3" />
        <Skeleton className="h-4 w-72" />
        <Skeleton className="h-4 w-64 mt-2" />
        <Skeleton className="h-4 w-52 mt-2" />
        <Skeleton className="h-4 w-40 mt-2" />
      </div>

      <div className="flex items-center justify-center gap-4 mt-6">
        <Skeleton className="h-10 w-44" />
        <Skeleton className="h-10 w-44" />
      </div>
    </div>
  );
};
