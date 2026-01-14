import { cn } from "@/lib/utils";
import { Badge as BadgeType } from "@/types";

interface BadgeProps {
  badge: BadgeType;
  className?: string;
}

const badgeConfig: Record<
  BadgeType,
  { label: string; className: string }
> = {
  new: {
    label: "NEW",
    className: "bg-flame text-white-hot",
  },
  sale: {
    label: "SALE",
    className: "bg-ember text-white-hot",
  },
  "best-seller": {
    label: "BEST SELLER",
    className: "bg-sand text-charcoal",
  },
  limited: {
    label: "LIMITED",
    className: "bg-steel-grey text-white-hot",
  },
};

export function Badge({ badge, className }: BadgeProps) {
  const config = badgeConfig[badge];

  return (
    <span
      className={cn(
        "inline-block px-2 py-0.5 text-xs font-bold uppercase tracking-wider",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
