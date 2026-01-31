"use client";

import { GeneralDisplayError } from "@/modules/shared/components/GeneralDisplayError";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ProductDisplayImages } from "../components/product-display-images";
import { ProductInfo } from "../components/product-info";

export const ProductDetailsSection = ({ slug }: { slug: string }) => {
  return (
    <Suspense fallback={"loading..."}>
      <ErrorBoundary
        FallbackComponent={({ error, resetErrorBoundary }) => (
          <GeneralDisplayError
            error={error}
            resetErrorBoundary={resetErrorBoundary}
          />
        )}
      >
        <ProductDetailsSectionSuspense slug={slug} />
      </ErrorBoundary>
    </Suspense>
  );
};

const ProductDetailsSectionSuspense = ({ slug }: { slug: string }) => {
  const trpc = useTRPC();
  const { data: product } = useSuspenseQuery(
    trpc.home.products.details.queryOptions({ slug }),
  );

  return (
    <div className="flex flex-col md:flex-row gap-6 mt-10">
      <div className="w-full md:w-1/2">
        <ProductDisplayImages images={product.images} />
      </div>

      <div className="w-full md:w-1/2">
        <ProductInfo product={product} />
      </div>
    </div>
  );
};
