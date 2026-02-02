import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import React, { useState } from "react";
import { UserProductReview } from "../../domains/product-reviews-schema";
import toast from "react-hot-toast";

interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  helpful: number;
}

const dummyReviews: Review[] = [
  {
    id: "1",
    author: "Sarah M.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 5,
    date: "2 weeks ago",
    title: "Absolutely love it!",
    content:
      "The quality exceeded my expectations. The fabric is soft yet durable, and the fit is perfect. I've already ordered two more in different colors!",
    helpful: 24,
  },
  {
    id: "2",
    author: "James K.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    rating: 4,
    date: "1 month ago",
    title: "Great quality, runs slightly large",
    content:
      "Beautiful piece with excellent craftsmanship. The only reason I'm giving 4 stars is that it runs a bit large. I'd recommend sizing down if you prefer a more fitted look.",
    helpful: 18,
  },
  {
    id: "3",
    author: "Emily R.",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    rating: 5,
    date: "1 month ago",
    title: "My new favorite!",
    content:
      "I've been looking for something like this for ages. The color is exactly as shown in the photos, and it pairs well with everything in my wardrobe. Highly recommend!",
    helpful: 31,
  },
  {
    id: "4",
    author: "Michael T.",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    rating: 3,
    date: "2 months ago",
    title: "Good but not great",
    content:
      "The product is decent for the price. Material feels nice but I expected a bit more based on the description. Shipping was fast though!",
    helpful: 7,
  },
];

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
  size?: "sm" | "md";
}

const StarRating = ({
  rating,
  onRatingChange,
  interactive = false,
  size = "md",
}: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState(0);

  const starSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const starValue = i + 1;
        const isFilled = interactive
          ? starValue <= (hoverRating || rating)
          : starValue <= rating;

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            className={cn(
              "transition-colors",
              interactive && "cursor-pointer hover:scale-110",
            )}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            onClick={() => onRatingChange?.(starValue)}
          >
            <Star
              className={cn(
                starSize,
                isFilled
                  ? "fill-custom-primary text-custom-primary"
                  : "text-muted-foreground/40",
              )}
            />
          </button>
        );
      })}
    </div>
  );
};

interface RateProductProps {
  productId: string;
  userReview: UserProductReview | null;
}

export const RateProduct = ({ productId, userReview }: RateProductProps) => {
  const [userRating, setUserRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewContent, setReviewContent] = useState("");

  const averageRating =
    dummyReviews.reduce((acc, r) => acc + r.rating, 0) / dummyReviews.length;

  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: dummyReviews.filter((r) => r.rating === stars).length,
    percentage:
      (dummyReviews.filter((r) => r.rating === stars).length /
        dummyReviews.length) *
      100,
  }));
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const { mutate: upsertReview } = useMutation(
    trpc.productReviews.upsert.mutationOptions({
      onSuccess: () => {
        toast.success("Your review has been recorded");

        queryClient.invalidateQueries({
          queryKey: trpc.productReviews.list.queryKey(),
        });
      },

      onError: (err) => {
        toast.error(err.message || "Something went wrong");
      },
    }),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Just UI - no actual submission
    console.log({ userRating, reviewTitle, reviewContent, productId });

    upsertReview({
      productId,
      rating: userRating,
      title: reviewTitle,
      body: reviewContent,
    });
  };

  return (
    <section className="py-12 md:py-16">
      <div className="container">
        <h2 className="font-display text-2xl md:text-3xl font-semibold mb-8">
          Customer Reviews
        </h2>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Rating Summary */}
          <div className="lg:col-span-1">
            <div className="bg-secondary/30 rounded-lg p-6">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold mb-2">
                  {averageRating.toFixed(1)}
                </div>
                <StarRating rating={Math.round(averageRating)} size="md" />
                <p className="text-sm text-muted-foreground mt-2">
                  Based on {dummyReviews.length} reviews
                </p>
              </div>

              <div className="space-y-2">
                {ratingDistribution.map(({ stars, count, percentage }) => (
                  <div key={stars} className="flex items-center gap-3">
                    <span className="text-sm w-3">{stars}</span>
                    <Star className="h-4 w-4 fill-custom-primary text-custom-primary" />
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-custom-primary rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-6">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Write Review Form */}
            <div className="mt-6 p-6 border rounded-lg">
              <h3 className="font-medium mb-4">Write a Review</h3>
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

                <Button type="submit" className="w-full" variant="primary">
                  Submit Review
                </Button>
              </form>
            </div>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {dummyReviews.map((review, index) => (
                <div key={review.id}>
                  <div className="flex gap-4">
                    <img
                      src={review.avatar}
                      alt={review.author}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="font-medium">{review.author}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <StarRating rating={review.rating} size="sm" />
                            <span className="text-sm text-muted-foreground">
                              {review.date}
                            </span>
                          </div>
                        </div>
                      </div>

                      <h5 className="font-medium mt-3">{review.title}</h5>
                      <p className="text-muted-foreground mt-1">
                        {review.content}
                      </p>

                      <div className="flex items-center gap-4 mt-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground"
                        >
                          Helpful ({review.helpful})
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground"
                        >
                          Report
                        </Button>
                      </div>
                    </div>
                  </div>
                  {index < dummyReviews.length - 1 && (
                    <Separator className="mt-6" />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button variant="outline">Load More Reviews</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
