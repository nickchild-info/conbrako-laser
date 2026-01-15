import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { PromoBlock } from "@/types";

interface PromoTileProps {
  promo: PromoBlock;
}

export function PromoTile({ promo }: PromoTileProps) {
  return (
    <div className="relative bg-soot border border-smoke overflow-hidden group">
      {/* Background image */}
      {promo.imageUrl && (
        <Image
          src={promo.imageUrl}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
          className="object-cover opacity-30 group-hover:opacity-40 transition-opacity"
        />
      )}

      {/* Content */}
      <div className="relative p-6 flex flex-col justify-center h-full min-h-[280px]">
        <div className="inline-block px-2 py-0.5 bg-ember text-white-hot text-xs font-bold uppercase tracking-wider mb-4 self-start">
          Featured
        </div>
        <h3 className="font-display text-2xl text-white-hot mb-2">
          {promo.title}
        </h3>
        <p className="text-stone text-sm mb-6 leading-relaxed">{promo.copy}</p>
        <Link
          href={promo.ctaUrl}
          className="inline-flex items-center gap-2 text-ember hover:text-flame transition-colors text-sm font-medium uppercase tracking-wide group/link"
        >
          {promo.ctaText}
          <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
        </Link>
      </div>

      {/* Decorative border */}
      <div className="absolute inset-0 border-2 border-ember/0 group-hover:border-ember/50 transition-colors pointer-events-none" />
    </div>
  );
}
