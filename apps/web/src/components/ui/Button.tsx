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
          "inline-flex items-center justify-center font-bold uppercase tracking-wider transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group",
          {
            // Primary - Fire button with glow
            "bg-ember text-white-hot hover:bg-flame focus-visible:ring-ember btn-lift": variant === "primary",
            // Secondary - Steel button
            "bg-soot text-white-hot border-2 border-steel-grey hover:border-ember hover:text-ember focus-visible:ring-steel-grey":
              variant === "secondary",
            // Ghost - Subtle
            "text-stone hover:text-white-hot hover:bg-smoke/50 focus-visible:ring-stone":
              variant === "ghost",
            // Outline - Border emphasis
            "border-2 border-ember text-ember hover:bg-ember hover:text-white-hot focus-visible:ring-ember btn-lift":
              variant === "outline",
            // Sizes
            "text-xs px-4 py-2": size === "sm",
            "text-sm px-6 py-3": size === "md",
            "text-base px-8 py-4": size === "lg",
          },
          className
        )}
        {...props}
      >
        {/* Fire shine effect on primary buttons */}
        {variant === "primary" && (
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
        )}
        <span className="relative inline-flex items-center">{children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";
