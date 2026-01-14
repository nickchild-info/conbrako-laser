import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  count?: number;
  size?: "sm" | "md";
  showCount?: boolean;
}

export function StarRating({
  rating,
  count,
  size = "sm",
  showCount = true,
}: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              "transition-colors",
              size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4",
              i < fullStars
                ? "fill-ember text-ember"
                : i === fullStars && hasHalfStar
                ? "fill-ember/50 text-ember"
                : "fill-steel-grey/30 text-steel-grey"
            )}
          />
        ))}
      </div>
      {showCount && count !== undefined && (
        <span
          className={cn(
            "text-stone",
            size === "sm" ? "text-xs" : "text-sm"
          )}
        >
          ({count})
        </span>
      )}
    </div>
  );
}
