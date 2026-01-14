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
          "inline-flex items-center justify-center font-medium uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember disabled:pointer-events-none disabled:opacity-50",
          {
            // Variants
            "bg-ember text-white-hot hover:bg-flame": variant === "primary",
            "bg-soot text-white-hot border border-steel-grey hover:border-stone":
              variant === "secondary",
            "text-stone hover:text-white-hot hover:bg-smoke":
              variant === "ghost",
            "border border-ember text-ember hover:bg-ember hover:text-white-hot":
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
