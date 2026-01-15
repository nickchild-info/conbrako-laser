import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Users, Truck, Percent, Phone, Mail, CheckCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "Trade & Bulk Orders",
  description:
    "Wholesale pricing and bulk orders for resellers, landscapers, developers, and hospitality businesses. Partner with KoosDoos Fire Pits for premium outdoor products.",
};

const benefits = [
  {
    icon: Percent,
    title: "Wholesale Pricing",
    description:
      "Competitive trade pricing on all products. Volume discounts available for larger orders.",
  },
  {
    icon: Truck,
    title: "Priority Shipping",
    description:
      "Dedicated logistics support with priority dispatch and bulk delivery options.",
  },
  {
    icon: Users,
    title: "Dedicated Support",
    description:
      "Personal account manager to assist with orders, customisation, and technical queries.",
  },
  {
    icon: Building2,
    title: "Custom Branding",
    description:
      "Add your logo or custom designs to fire pits for your projects or resale.",
  },
];

const idealFor = [
  {
    title: "Retailers & Resellers",
    description:
      "Stock KoosDoos fire pits in your store. We provide marketing materials, product training, and competitive wholesale pricing.",
  },
  {
    title: "Landscapers & Architects",
    description:
      "Specify our fire pits for residential and commercial projects. Custom sizes and finishes available for unique installations.",
  },
  {
    title: "Property Developers",
    description:
      "Enhance your developments with premium outdoor living features. Bulk pricing for estates and housing projects.",
  },
  {
    title: "Hospitality & Events",
    description:
      "Restaurants, lodges, and event venues. Create unforgettable outdoor experiences with our robust fire pits.",
  },
  {
    title: "Corporate Gifting",
    description:
      "Memorable branded gifts for clients and employees. Custom laser-cut logos and packaging available.",
  },
  {
    title: "Export Partners",
    description:
      "Looking to distribute in your region? We're seeking partners across Africa and internationally.",
  },
];

export default function TradePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-charcoal border-b border-smoke">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumbs items={[{ label: "Trade & Bulk Orders" }]} />

          <div className="py-8 lg:py-16 max-w-3xl">
            <span className="inline-block px-4 py-1 bg-ember text-white-hot text-sm font-bold uppercase tracking-wider mb-6">
              Business Partners
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white-hot mb-6 leading-tight">
              Trade &
              <br />
              <span className="text-ember">Bulk Orders</span>
            </h1>
            <p className="text-lg text-stone leading-relaxed">
              Partner with KoosDoos for wholesale pricing, custom orders, and dedicated support.
              We supply retailers, landscapers, developers, and hospitality businesses across South Africa.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 lg:py-24 bg-soot">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-ember text-sm font-bold uppercase tracking-wider">
              Partner Benefits
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-white-hot mt-2 mb-4">
              Why Partner With Us
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-charcoal border border-smoke p-6 text-center hover:border-ember transition-colors"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-soot border border-smoke mb-4">
                  <benefit.icon className="h-6 w-6 text-ember" />
                </div>
                <h3 className="font-display text-lg text-white-hot mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-stone">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ideal For Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-ember text-sm font-bold uppercase tracking-wider">
              Who We Work With
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-white-hot mt-2 mb-4">
              Ideal For
            </h2>
            <p className="text-stone max-w-2xl mx-auto">
              We work with a range of businesses and professionals. If you don&apos;t see your
              industry listed, get in touch - we&apos;re always open to new partnerships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {idealFor.map((item) => (
              <div
                key={item.title}
                className="bg-soot border border-smoke p-6 hover:border-ember transition-colors"
              >
                <h3 className="font-display text-lg text-white-hot mb-3">
                  {item.title}
                </h3>
                <p className="text-stone text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-24 bg-soot">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-ember text-sm font-bold uppercase tracking-wider">
              Getting Started
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-white-hot mt-2">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-charcoal border border-smoke p-6 text-center">
              <span className="inline-flex items-center justify-center w-12 h-12 bg-ember text-white-hot font-display text-xl mb-4">
                1
              </span>
              <h3 className="font-display text-lg text-white-hot mb-2">
                Get In Touch
              </h3>
              <p className="text-stone text-sm">
                Contact us with your requirements. Tell us about your business and what you&apos;re
                looking for.
              </p>
            </div>

            <div className="bg-charcoal border border-smoke p-6 text-center">
              <span className="inline-flex items-center justify-center w-12 h-12 bg-ember text-white-hot font-display text-xl mb-4">
                2
              </span>
              <h3 className="font-display text-lg text-white-hot mb-2">
                Receive A Quote
              </h3>
              <p className="text-stone text-sm">
                We&apos;ll prepare a custom quote based on your volume, customisation needs,
                and delivery requirements.
              </p>
            </div>

            <div className="bg-charcoal border border-smoke p-6 text-center">
              <span className="inline-flex items-center justify-center w-12 h-12 bg-ember text-white-hot font-display text-xl mb-4">
                3
              </span>
              <h3 className="font-display text-lg text-white-hot mb-2">
                Start Ordering
              </h3>
              <p className="text-stone text-sm">
                Once approved, place orders through your dedicated account manager with
                priority processing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <span className="text-ember text-sm font-bold uppercase tracking-wider">
                Trade Account
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-white-hot mt-2 mb-6">
                Application Requirements
              </h2>
              <p className="text-stone mb-8">
                To apply for a trade account, please have the following information ready:
              </p>

              <ul className="space-y-4">
                {[
                  "Registered business name and registration number",
                  "VAT number (if VAT registered)",
                  "Physical and postal address",
                  "Primary contact details",
                  "Brief description of your business",
                  "Estimated monthly order volume",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-ember flex-shrink-0 mt-0.5" />
                    <span className="text-stone">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-soot border border-smoke p-8">
              <h3 className="font-display text-xl text-white-hot mb-6">
                Contact Our Trade Team
              </h3>
              <p className="text-stone mb-6">
                Ready to partner with KoosDoos? Get in touch with our trade team to discuss
                your requirements and receive a custom quote.
              </p>

              <div className="space-y-4 mb-8">
                <a
                  href="mailto:trade@koosdoos.co.za"
                  className="flex items-center gap-3 text-white-hot hover:text-ember transition-colors"
                >
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-charcoal border border-smoke">
                    <Mail className="h-5 w-5 text-ember" />
                  </div>
                  <div>
                    <p className="text-sm text-stone">Email</p>
                    <p className="font-medium">trade@koosdoos.co.za</p>
                  </div>
                </a>

                <a
                  href="tel:+27123456789"
                  className="flex items-center gap-3 text-white-hot hover:text-ember transition-colors"
                >
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-charcoal border border-smoke">
                    <Phone className="h-5 w-5 text-ember" />
                  </div>
                  <div>
                    <p className="text-sm text-stone">Phone</p>
                    <p className="font-medium">+27 12 345 6789</p>
                  </div>
                </a>
              </div>

              <Link href="/pages/contact">
                <Button className="w-full">
                  Send An Enquiry
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-ember">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-4xl sm:text-5xl text-white-hot mb-4">
            Ready To Partner?
          </h2>
          <p className="text-xl text-white-hot/80 mb-8">
            Join our growing network of trade partners across South Africa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pages/contact">
              <Button
                size="lg"
                className="bg-charcoal hover:bg-soot text-white-hot"
              >
                Apply For Trade Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/collections/fire-pits">
              <Button
                size="lg"
                variant="outline"
                className="border-white-hot text-white-hot hover:bg-white-hot hover:text-ember"
              >
                View Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
