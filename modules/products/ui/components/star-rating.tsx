import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
  size?: "sm" | "md";
}

export const StarRating = ({
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
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground/40",
              )}
            />
          </button>
        );
      })}
    </div>
  );
};
