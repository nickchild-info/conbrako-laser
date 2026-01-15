import Link from "next/link";
import { ArrowRight, Home, Search, Flame } from "lucide-react";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* 404 Graphic - 4 FLAME 4 */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span style={{ fontSize: '8rem', lineHeight: 1 }} className="font-display text-smoke select-none">
            4
          </span>
          <Flame style={{ width: '6rem', height: '6rem' }} className="text-ember" />
          <span style={{ fontSize: '8rem', lineHeight: 1 }} className="font-display text-smoke select-none">
            4
          </span>
        </div>

        {/* Message */}
        <h1 className="font-display text-3xl sm:text-4xl text-white-hot mb-4">
          Page Not Found
        </h1>
        <p className="text-stone text-lg mb-8 max-w-md mx-auto">
          Looks like this page went up in smoke. The page you&apos;re looking for
          doesn&apos;t exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/">
            <Button size="lg">
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Button>
          </Link>
          <Link href="/collections/fire-pits">
            <Button size="lg" variant="secondary">
              <Search className="mr-2 h-5 w-5" />
              Browse Fire Pits
            </Button>
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="bg-soot border border-smoke p-6 inline-block">
          <h2 className="font-display text-lg text-white-hot mb-4">
            Looking for something?
          </h2>
          <ul className="space-y-2 text-left">
            <li>
              <Link
                href="/collections/fire-pits"
                className="text-stone hover:text-ember transition-colors inline-flex items-center gap-2"
              >
                <ArrowRight className="h-4 w-4" />
                Shop Fire Pits
              </Link>
            </li>
            <li>
              <Link
                href="/personalise"
                className="text-stone hover:text-ember transition-colors inline-flex items-center gap-2"
              >
                <ArrowRight className="h-4 w-4" />
                Personalise Your Fire Pit
              </Link>
            </li>
            <li>
              <Link
                href="/pages/faq"
                className="text-stone hover:text-ember transition-colors inline-flex items-center gap-2"
              >
                <ArrowRight className="h-4 w-4" />
                Frequently Asked Questions
              </Link>
            </li>
            <li>
              <Link
                href="/pages/contact"
                className="text-stone hover:text-ember transition-colors inline-flex items-center gap-2"
              >
                <ArrowRight className="h-4 w-4" />
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
