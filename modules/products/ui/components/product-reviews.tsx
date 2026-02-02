import React from "react";
import { RateProduct } from "./rate-product";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

interface Props {
  productId: string;
}

export const ProductReviews = ({ productId }: Props) => {
  const trpc = useTRPC();
  const { data: productReviews, isLoading: loadingReviews } = useQuery(
    trpc.productReviews.list.queryOptions({ productId }),
  );

  const { data: userReview, isLoading: loadingReview } = useQuery(
    trpc.productReviews.mine.queryOptions({ productId }),
  );

  if (loadingReviews || loadingReview) return "Loading...";

  console.log(productReviews);

  console.log(userReview);

  return (
    <>
      <h1 className="text-4xl font-bold my-10">Customer Reviews</h1>

      <div className="flex gap-10 w-full">
        <RateProduct productId={productId} userReview={userReview ?? null} />

        <div className="flex-1"></div>
      </div>
    </>
  );
};
