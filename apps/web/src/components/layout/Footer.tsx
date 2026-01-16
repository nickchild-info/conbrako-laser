import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Flame, ArrowRight } from "lucide-react";

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
    <footer className="bg-soot border-t-2 border-smoke relative" role="contentinfo" aria-label="Site footer">
      {/* Fire accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 fire-gradient" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-2 gap-10 lg:grid-cols-6">
            {/* Brand column - spans 2 cols */}
            <div className="col-span-2">
              <Link href="/" className="inline-block group">
                <Image
                  src="/images/koosdoos-logo.png"
                  alt="KoosDoos Fire Pits"
                  width={160}
                  height={45}
                  className="h-12 w-auto transition-transform group-hover:scale-105"
                />
              </Link>
              <p className="mt-6 text-stone leading-relaxed max-w-sm">
                Premium laser-cut steel fire pits. Built tough. Burns harder.
                Made in South Africa for South Africans.
              </p>

              {/* Contact info */}
              <div className="mt-8 space-y-4">
                <a
                  href="mailto:info@koosdoos.co.za"
                  className="flex items-center gap-3 text-stone hover:text-ember transition-colors group"
                >
                  <div className="w-10 h-10 bg-charcoal border border-smoke group-hover:border-ember flex items-center justify-center transition-colors">
                    <Mail className="h-4 w-4 text-ember" />
                  </div>
                  <span className="text-sm">info@koosdoos.co.za</span>
                </a>
                <a
                  href="tel:+27123456789"
                  className="flex items-center gap-3 text-stone hover:text-ember transition-colors group"
                >
                  <div className="w-10 h-10 bg-charcoal border border-smoke group-hover:border-ember flex items-center justify-center transition-colors">
                    <Phone className="h-4 w-4 text-ember" />
                  </div>
                  <span className="text-sm">+27 12 345 6789</span>
                </a>
                <div className="flex items-center gap-3 text-stone">
                  <div className="w-10 h-10 bg-charcoal border border-smoke flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-ember" />
                  </div>
                  <span className="text-sm">Pretoria, Gauteng, South Africa</span>
                </div>
              </div>
            </div>

            {/* Shop links */}
            <nav aria-labelledby="footer-shop-heading">
              <h3 id="footer-shop-heading" className="font-display text-lg text-white-hot mb-6">
                Shop
              </h3>
              <ul className="space-y-4">
                {footerLinks.shop.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-stone hover:text-ember transition-colors underline-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-ember"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Support links */}
            <nav aria-labelledby="footer-support-heading">
              <h3 id="footer-support-heading" className="font-display text-lg text-white-hot mb-6">
                Support
              </h3>
              <ul className="space-y-4">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-stone hover:text-ember transition-colors underline-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-ember"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Company links */}
            <nav aria-labelledby="footer-company-heading">
              <h3 id="footer-company-heading" className="font-display text-lg text-white-hot mb-6">
                Company
              </h3>
              <ul className="space-y-4">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-stone hover:text-ember transition-colors underline-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-ember"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Newsletter */}
            <div className="col-span-2 lg:col-span-1">
              <h3 id="newsletter-heading" className="font-display text-lg text-white-hot mb-6">
                Stay In The Loop
              </h3>
              <p className="text-sm text-stone mb-6 leading-relaxed">
                New products, deals, and braai tips. No spam, just fire.
              </p>
              <form className="space-y-3" aria-labelledby="newsletter-heading">
                <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  autoComplete="email"
                  className="w-full px-4 py-3 bg-charcoal border-2 border-smoke text-white-hot placeholder:text-ash text-sm focus:outline-none focus:ring-0 focus:border-ember transition-colors"
                  aria-describedby="newsletter-description"
                />
                <span id="newsletter-description" className="sr-only">Enter your email to subscribe to our newsletter</span>
                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-ember hover:bg-flame text-white-hot font-bold text-sm uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-white-hot focus:ring-offset-2 focus:ring-offset-soot inline-flex items-center justify-center gap-2 btn-lift"
                >
                  Subscribe
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t-2 border-smoke py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-ash">
            <Flame className="h-4 w-4 text-ember" />
            <p className="text-sm">
              &copy; {new Date().getFullYear()} KoosDoos Fire Pits. All rights reserved.
            </p>
          </div>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-ash hover:text-ember transition-colors"
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
