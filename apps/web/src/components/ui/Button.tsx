import { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium uppercase tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
          {
            // Variants
            "bg-ember text-white-hot hover:bg-flame focus-visible:ring-ember": variant === "primary",
            "bg-soot text-white-hot border border-steel-grey hover:border-stone focus-visible:ring-steel-grey":
              variant === "secondary",
            "text-stone hover:text-white-hot hover:bg-smoke focus-visible:ring-stone":
              variant === "ghost",
            "border border-ember text-ember hover:bg-ember hover:text-white-hot focus-visible:ring-ember":
              variant === "outline",
            // Sizes
            "text-xs px-3 py-1.5": size === "sm",
            "text-sm px-4 py-2": size === "md",
            "text-base px-6 py-3": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
