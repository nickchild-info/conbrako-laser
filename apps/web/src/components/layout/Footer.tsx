import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  shop: [
    { name: "Fire Pits", href: "/collections/fire-pits" },
    { name: "Personalise", href: "/personalise" },
    { name: "Best Sellers", href: "/collections/best-sellers" },
    { name: "New Arrivals", href: "/collections/new-arrivals" },
  ],
  support: [
    { name: "Assembly Guide", href: "/pages/assembly" },
    { name: "Shipping & Delivery", href: "/pages/shipping" },
    { name: "Returns & Warranty", href: "/pages/returns" },
    { name: "FAQs", href: "/pages/faq" },
  ],
  company: [
    { name: "Our Story", href: "/pages/about" },
    { name: "Contact Us", href: "/pages/contact" },
    { name: "Trade & Bulk Orders", href: "/pages/trade" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/pages/privacy" },
    { name: "Terms & Conditions", href: "/pages/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-soot border-t border-smoke" role="contentinfo" aria-label="Site footer">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-5">
            {/* Brand column */}
            <div className="col-span-2 lg:col-span-1">
              <Link href="/" className="inline-block">
                <Image
                  src="/images/koosdoos-logo.png"
                  alt="KoosDoos Fire Pits"
                  width={140}
                  height={40}
                  className="h-10 w-auto"
                />
              </Link>
              <p className="mt-4 text-sm text-stone leading-relaxed">
                Premium laser-cut steel fire pits. Built tough. Burns harder.
              </p>
              <div className="mt-6 space-y-3 text-sm text-stone">
                <a
                  href="mailto:info@koosdoos.co.za"
                  className="flex items-center gap-2 hover:text-white-hot transition-colors"
                >
                  <Mail className="h-4 w-4 text-ember" />
                  info@koosdoos.co.za
                </a>
                <a
                  href="tel:+27123456789"
                  className="flex items-center gap-2 hover:text-white-hot transition-colors"
                >
                  <Phone className="h-4 w-4 text-ember" />
                  +27 12 345 6789
                </a>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-ember flex-shrink-0 mt-0.5" />
                  <span>Pretoria, Gauteng, South Africa</span>
                </div>
              </div>
            </div>

            {/* Shop links */}
            <nav aria-labelledby="footer-shop-heading">
              <h3 id="footer-shop-heading" className="font-display text-lg text-white-hot mb-4">Shop</h3>
              <ul className="space-y-3">
                {footerLinks.shop.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-stone hover:text-white-hot transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ember"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Support links */}
            <nav aria-labelledby="footer-support-heading">
              <h3 id="footer-support-heading" className="font-display text-lg text-white-hot mb-4">
                Support
              </h3>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-stone hover:text-white-hot transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ember"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Company links */}
            <nav aria-labelledby="footer-company-heading">
              <h3 id="footer-company-heading" className="font-display text-lg text-white-hot mb-4">
                Company
              </h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-stone hover:text-white-hot transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ember"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Newsletter */}
            <div className="col-span-2 lg:col-span-1">
              <h3 id="newsletter-heading" className="font-display text-lg text-white-hot mb-4">
                Stay In The Loop
              </h3>
              <p className="text-sm text-stone mb-4">
                New products, deals, and braai tips. No spam, just fire.
              </p>
              <form className="flex flex-col gap-3" aria-labelledby="newsletter-heading">
                <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  autoComplete="email"
                  className="w-full px-4 py-2 bg-charcoal border border-steel-grey text-white-hot placeholder:text-ash text-sm focus:outline-none focus:ring-2 focus:ring-ember focus:border-ember transition-colors"
                  aria-describedby="newsletter-description"
                />
                <span id="newsletter-description" className="sr-only">Enter your email to subscribe to our newsletter</span>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-ember hover:bg-flame text-white-hot font-medium text-sm uppercase tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-white-hot focus:ring-offset-2 focus:ring-offset-soot"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-smoke py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ash">
            &copy; {new Date().getFullYear()} KoosDoos Fire Pits. All rights reserved.
          </p>
          <div className="flex gap-4">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-xs text-ash hover:text-stone transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
