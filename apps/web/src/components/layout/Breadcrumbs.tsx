import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-2 text-sm text-stone">
        <li>
          <Link
            href="/"
            className="hover:text-white-hot transition-colors flex items-center"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-steel-grey" />
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-white-hot transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-white-hot">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
