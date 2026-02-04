import React, { useMemo } from "react";
import { RateProduct } from "./rate-product";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { StarRating } from "./star-rating";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Edit, MoreVertical, Trash } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import toast from "react-hot-toast";
import { formatReviewDate } from "@/modules/shared/utils/helpers";
import { ProductReviewsSkeleton } from "../skeletons/product-reviews-skeleton";

interface Props {
  productId: string;
}

export const ProductReviews = ({ productId }: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data, isLoading: loadingReviews } = useQuery(
    trpc.productReviews.list.queryOptions({ productId }),
  );

  const { data: userReview, isLoading: loadingReview } = useQuery(
    trpc.productReviews.mine.queryOptions({ productId }),
  );

  const { mutate: deleteReview } = useMutation(
    trpc.productReviews.remove.mutationOptions({
      onSuccess: () => {
        toast.success("Successfully deleted review");

        queryClient.invalidateQueries({
          queryKey: trpc.productReviews.list.queryKey({ productId }),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.productReviews.mine.queryKey({ productId }),
        });
      },
      onError: (err) => {
        toast.error(err.message || "Could not delete review");
      },
    }),
  );

  if (loadingReviews || loadingReview) return <ProductReviewsSkeleton />;

  const productReviews = data?.items ?? [];

  const averageRating =
    productReviews.reduce((acc, r) => acc + r.rating, 0) /
    productReviews.length;

  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: productReviews.filter((r) => r.rating === stars).length,
    percentage:
      (productReviews.filter((r) => r.rating === stars).length /
        productReviews.length) *
      100,
  }));

  return (
    <div className="mb-20">
      <h1 className="text-2xl md:text-4xl font-bold my-10">Customer Reviews</h1>

      <div className="flex flex-col md:flex-row gap-10 w-full">
        <RateProduct
          productId={productId}
          userReview={userReview ?? null}
          averageRating={averageRating}
          ratingDistribution={ratingDistribution}
          totalReviews={productReviews.length}
        />

        <div className="flex-1">
          <div className="space-y-6">
            {productReviews
              .filter((p) => !!p.body)
              .map((review, index) => (
                <div key={review.id}>
                  <div className="flex gap-4">
                    <div className="relative h-12 w-12">
                      <Image
                        src={review.user?.image ?? ""}
                        alt={review.user?.name ?? ""}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="font-medium">{review.user?.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <StarRating rating={review.rating} size="sm" />
                            <span className="text-sm text-muted-foreground">
                              {formatReviewDate(review.createdAt)}
                            </span>
                          </div>
                        </div>

                        {review?.user?.id == userReview?.userId && (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              align="center"
                              className="w-30 flex flex-col gap-2"
                            >
                              <div className="items-center flex gap-2 cursor-pointer">
                                <Edit className="size-4" />
                                <p className="mt-1">Edit</p>
                              </div>
                              <div
                                className="items-center flex gap-2 cursor-pointer"
                                onClick={() => deleteReview({ productId })}
                              >
                                <Trash className="size-4" />
                                <p className="mt-1">Delete</p>
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}
                      </div>

                      <h5 className="font-medium mt-3">{review.title}</h5>
                      <p className="text-muted-foreground mt-1">
                        {review.body}
                      </p>
                    </div>
                  </div>

                  {index < productReviews.length - 1 && (
                    <Separator className="mt-6" />
                  )}
                </div>
              ))}
          </div>

          {productReviews.length > 5 && (
            <div className="mt-8 text-center">
              <Button variant="outline">Load More Reviews</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
