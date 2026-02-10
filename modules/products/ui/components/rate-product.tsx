import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit, Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import { UserProductReview } from "../../domains/product-reviews-schema";
import toast from "react-hot-toast";
import { StarRating } from "./star-rating";

interface RateProductProps {
  productId: string;
  userReview: UserProductReview | null;
  averageRating: number;
  ratingDistribution: {
    stars: number;
    count: number;
    percentage: number;
  }[];
  totalReviews: number;
}

const UserReviewDisplay = ({
  review,
  onEdit,
}: {
  review: UserProductReview;
  onEdit: () => void;
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Your Review</h3>
        <Button type="button" variant="outline" size="icon" onClick={onEdit}>
          <Edit />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <StarRating rating={review?.rating ?? 0} size="sm" />
        <span className="text-sm text-muted-foreground">
          {review?.rating} / 5
        </span>
      </div>

      {review?.title && <p className="font-medium">{review.title}</p>}
      {review?.body && (
        <p className="text-sm text-muted-foreground">{review.body}</p>
      )}
    </div>
  );
};

export const RateProduct = ({
  productId,
  userReview,
  averageRating,
  ratingDistribution,
  totalReviews,
}: RateProductProps) => {
  const hasReview = !!userReview;

  const [mode, setMode] = useState<"view" | "edit">(
    hasReview ? "view" : "edit",
  );

  const [userRating, setUserRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewContent, setReviewContent] = useState("");

  const queryClient = useQueryClient();
  const trpc = useTRPC();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMode(userReview ? "view" : "edit");
  }, [userReview]);

  useEffect(() => {
    if (mode !== "edit") return;

    if (userReview) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUserRating(userReview.rating ?? 0);
      setReviewTitle(userReview.title ?? "");
      setReviewContent(userReview.body ?? "");
    } else {
      setUserRating(0);
      setReviewTitle("");
      setReviewContent("");
    }
  }, [mode, userReview]);

  const { mutate: upsertReview, isPending } = useMutation(
    trpc.productReviews.upsert.mutationOptions({
      onSuccess: async () => {
        toast.success("Your review has been recorded");

        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.productReviews.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.productReviews.mine.queryKey({ productId }),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.products.details.queryKey(),
          }),
        ]);

        setMode("view");
      },

      onError: (err) => {
        toast.error(err.message || "Something went wrong");
      },
    }),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (userRating < 1) {
      toast.error("Please select a rating (1–5 stars).");
      return;
    }

    upsertReview({
      productId,
      rating: userRating,
      title: reviewTitle.trim() || null,
      body: reviewContent.trim() || null,
    });
  };

  return (
    <section className="w-full md:w-[30%]">
      <div className="bg-secondary/30 rounded-lg p-6">
        <div className="text-center mb-6">
          <div className="text-5xl font-bold mb-2">
            {!!averageRating ? averageRating.toFixed(1) : 0.0}
          </div>
          <StarRating rating={Math.round(averageRating)} size="md" />
          <p className="text-sm text-muted-foreground mt-2">
            Based on {totalReviews} reviews
          </p>
        </div>

        <div className="space-y-2">
          {ratingDistribution.map(({ stars, count, percentage }) => (
            <div key={stars} className="flex items-center gap-3">
              <span className="text-sm w-3">{stars}</span>
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground w-6">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 p-6 border rounded-lg">
        {hasReview && mode === "view" ? (
          <UserReviewDisplay
            review={userReview}
            onEdit={() => setMode("edit")}
          />
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">
                {hasReview ? "Update Your Review" : "Write a Review"}
              </h3>

              {hasReview && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setMode("view")}
                  disabled={isPending}
                >
                  Cancel
                </Button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">
                  Your Rating
                </label>
                <StarRating
                  rating={userRating}
                  onRatingChange={setUserRating}
                  interactive
                  size="md"
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">
                  Review Title
                </label>
                <Input
                  placeholder="Summarize your experience"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">
                  Your Review
                </label>
                <Textarea
                  placeholder="Share your thoughts about this product..."
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  rows={4}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                variant="primary"
                disabled={isPending}
              >
                {isPending
                  ? "Saving..."
                  : hasReview
                    ? "Save Changes"
                    : "Submit Review"}
              </Button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};
