import { Skeleton } from "@/components/ui/skeleton";

export const ProductCardSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="relative aspect-3/4 overflow-hidden rounded-lg bg-muted">
        <Skeleton className="absolute inset-0" />

        <div className="absolute inset-x-0 bottom-0 p-4">
          <Skeleton className="h-9 w-full rounded-md" />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
};

export const FeaturedProductsSkeleton = ({ count = 8 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6 mt-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};
