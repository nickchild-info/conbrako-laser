import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Shield, Lock, Eye, Database, Mail, Cookie, AlertCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "KoosDoos Fire Pits privacy policy - learn how we collect, use, and protect your personal information when you shop with us.",
};

const dataCollected = [
  {
    category: "Personal Information",
    items: [
      "Name and surname",
      "Email address",
      "Phone number",
      "Delivery address",
      "Billing address",
    ],
  },
  {
    category: "Order Information",
    items: [
      "Products purchased",
      "Order history",
      "Payment method (last 4 digits only)",
      "Custom design files uploaded",
      "Communication preferences",
    ],
  },
  {
    category: "Technical Information",
    items: [
      "IP address",
      "Browser type and version",
      "Device information",
      "Pages visited on our site",
      "Time spent on pages",
    ],
  },
];

const dataUsage = [
  {
    icon: Shield,
    title: "Order Processing",
    description:
      "We use your personal and order information to process and fulfil your orders, including shipping and delivery.",
  },
  {
    icon: Mail,
    title: "Communication",
    description:
      "We use your contact details to send order confirmations, shipping updates, and respond to your enquiries.",
  },
  {
    icon: Eye,
    title: "Site Improvement",
    description:
      "Technical data helps us understand how visitors use our site so we can improve your shopping experience.",
  },
  {
    icon: Database,
    title: "Marketing (With Consent)",
    description:
      "With your permission, we may send promotional emails about new products, special offers, and fire pit tips.",
  },
];

const yourRights = [
  {
    title: "Access Your Data",
    description: "Request a copy of all personal information we hold about you.",
  },
  {
    title: "Correct Your Data",
    description: "Request corrections to any inaccurate or incomplete information.",
  },
  {
    title: "Delete Your Data",
    description: "Request deletion of your personal data (subject to legal requirements).",
  },
  {
    title: "Withdraw Consent",
    description: "Opt out of marketing communications at any time.",
  },
  {
    title: "Data Portability",
    description: "Receive your data in a commonly used, machine-readable format.",
  },
  {
    title: "Lodge a Complaint",
    description: "Contact the Information Regulator if you believe your rights have been violated.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-charcoal border-b border-smoke">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumbs items={[{ label: "Privacy Policy" }]} />

          <div className="py-8 lg:py-16 max-w-4xl">
            <span className="inline-block px-4 py-1 bg-ember text-white-hot text-sm font-bold uppercase tracking-wider mb-6">
              Privacy Policy
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white-hot mb-6 leading-tight">
              Your Privacy
              <br />
              <span className="text-ember">Matters To Us</span>
            </h1>
            <p className="text-lg text-stone leading-relaxed mb-4">
              At KoosDoos Fire Pits, we respect your privacy and are committed to protecting your
              personal information. This policy explains how we collect, use, and safeguard your data.
            </p>
            <p className="text-stone">
              <strong className="text-sand">Last updated:</strong> January 2026
            </p>
          </div>
        </div>
      </section>

      {/* POPIA Compliance Banner */}
      <section className="bg-ember/10 border-b border-ember/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-start gap-4">
            <Shield className="h-8 w-8 text-ember flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-display text-lg text-white-hot mb-1">
                POPIA Compliant
              </h3>
              <p className="text-stone text-sm">
                This privacy policy complies with South Africa's Protection of Personal Information Act (POPIA).
                We are committed to processing your personal information lawfully and transparently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Collect Section */}
      <section className="py-16 lg:py-24 bg-soot">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-ember text-sm font-bold uppercase tracking-wider">
              Information Collection
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-white-hot mt-2 mb-4">
              What Information We Collect
            </h2>
            <p className="text-stone max-w-2xl mx-auto">
              We only collect information that is necessary to provide you with our products and services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dataCollected.map((category) => (
              <div
                key={category.category}
                className="bg-charcoal border border-smoke p-6"
              >
                <h3 className="font-display text-lg text-white-hot mb-4">
                  {category.category}
                </h3>
                <ul className="space-y-2">
                  {category.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-stone text-sm">
                      <span className="text-ember mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Use Your Data Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-ember text-sm font-bold uppercase tracking-wider">
              Data Usage
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-white-hot mt-2 mb-4">
              How We Use Your Information
            </h2>
            <p className="text-stone max-w-2xl mx-auto">
              Your information is used to provide and improve our services. We never sell your data to third parties.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dataUsage.map((usage) => (
              <div
                key={usage.title}
                className="bg-soot border border-smoke p-6 text-center hover:border-ember transition-colors"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-charcoal border border-smoke mb-4">
                  <usage.icon className="h-6 w-6 text-ember" />
                </div>
                <h3 className="font-display text-lg text-white-hot mb-2">
                  {usage.title}
                </h3>
                <p className="text-sm text-stone">{usage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Sharing Section */}
      <section className="py-16 lg:py-24 bg-soot">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-ember text-sm font-bold uppercase tracking-wider">
                Third Parties
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-white-hot mt-2">
                Who We Share Your Data With
              </h2>
            </div>

            <div className="space-y-6">
              <div className="bg-charcoal border border-smoke p-6">
                <h3 className="font-display text-lg text-white-hot mb-3">Payment Processors</h3>
                <p className="text-stone text-sm">
                  We use Stripe to process payments securely. Your card details are handled directly by Stripe
                  and are never stored on our servers. View{" "}
                  <a
                    href="https://stripe.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ember hover:underline"
                  >
                    Stripe's Privacy Policy
                  </a>
                  .
                </p>
              </div>

              <div className="bg-charcoal border border-smoke p-6">
                <h3 className="font-display text-lg text-white-hot mb-3">Courier Services</h3>
                <p className="text-stone text-sm">
                  We share your delivery address and contact number with our courier partners to ensure
                  successful delivery of your order. This information is used solely for delivery purposes.
                </p>
              </div>

              <div className="bg-charcoal border border-smoke p-6">
                <h3 className="font-display text-lg text-white-hot mb-3">Analytics Services</h3>
                <p className="text-stone text-sm">
                  We use Google Analytics to understand how visitors use our website. This data is anonymised
                  and helps us improve our site. You can opt out using browser extensions or cookie settings.
                </p>
              </div>

              <div className="bg-charcoal border border-smoke p-6">
                <h3 className="font-display text-lg text-white-hot mb-3">Legal Requirements</h3>
                <p className="text-stone text-sm">
                  We may disclose your information if required by law, court order, or government request,
                  or to protect our rights, property, or safety, or that of our customers or others.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cookies Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Cookie className="h-6 w-6 text-ember" />
                <span className="text-ember text-sm font-bold uppercase tracking-wider">
                  Cookies
                </span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl text-white-hot mb-6">
                How We Use Cookies
              </h2>
              <div className="space-y-4 text-stone">
                <p>
                  Cookies are small text files stored on your device when you visit our website.
                  They help us provide you with a better experience.
                </p>
                <p>
                  You can control cookies through your browser settings. Note that disabling cookies
                  may affect some website functionality, such as remembering your cart items.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-soot border border-smoke p-4">
                <h4 className="font-display text-white-hot mb-2">Essential Cookies</h4>
                <p className="text-stone text-sm">
                  Required for the website to function. These cannot be disabled without affecting
                  core functionality like your shopping cart.
                </p>
              </div>
              <div className="bg-soot border border-smoke p-4">
                <h4 className="font-display text-white-hot mb-2">Functional Cookies</h4>
                <p className="text-stone text-sm">
                  Remember your preferences, such as language or region, to enhance your experience.
                </p>
              </div>
              <div className="bg-soot border border-smoke p-4">
                <h4 className="font-display text-white-hot mb-2">Analytics Cookies</h4>
                <p className="text-stone text-sm">
                  Help us understand how visitors use our site so we can make improvements.
                  This data is anonymised.
                </p>
              </div>
              <div className="bg-soot border border-smoke p-4">
                <h4 className="font-display text-white-hot mb-2">Marketing Cookies</h4>
                <p className="text-stone text-sm">
                  Used to show you relevant ads. These are only placed with your consent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Your Rights Section */}
      <section className="py-16 lg:py-24 bg-soot">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-ember text-sm font-bold uppercase tracking-wider">
              Your Rights
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-white-hot mt-2 mb-4">
              Your Data Protection Rights
            </h2>
            <p className="text-stone max-w-2xl mx-auto">
              Under POPIA and other applicable laws, you have the following rights regarding your personal information.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {yourRights.map((right) => (
              <div
                key={right.title}
                className="bg-charcoal border border-smoke p-6"
              >
                <h3 className="font-display text-lg text-white-hot mb-2">
                  {right.title}
                </h3>
                <p className="text-sm text-stone">{right.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Security Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Lock className="h-12 w-12 text-ember mx-auto mb-6" />
            <h2 className="font-display text-3xl sm:text-4xl text-white-hot mb-4">
              How We Protect Your Data
            </h2>
            <div className="space-y-4 text-stone text-left">
              <p>
                We implement appropriate technical and organisational measures to protect your
                personal information against unauthorised access, alteration, disclosure, or destruction.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-ember mt-1">•</span>
                  SSL/TLS encryption for all data transmitted to and from our website
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ember mt-1">•</span>
                  Secure payment processing through PCI-DSS compliant providers
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ember mt-1">•</span>
                  Regular security assessments and updates
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ember mt-1">•</span>
                  Access controls limiting who can view personal information
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ember mt-1">•</span>
                  Data retention policies to ensure we don't keep data longer than necessary
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Data Retention Section */}
      <section className="py-16 lg:py-24 bg-soot">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-ember text-sm font-bold uppercase tracking-wider">
                Data Retention
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-white-hot mt-2">
                How Long We Keep Your Data
              </h2>
            </div>

            <div className="space-y-4">
              <div className="bg-charcoal border border-smoke p-6 flex items-center gap-4">
                <div className="bg-ember text-white-hot font-display text-lg w-16 h-16 flex items-center justify-center flex-shrink-0">
                  7 yrs
                </div>
                <div>
                  <h4 className="font-display text-white-hot mb-1">Order & Transaction Records</h4>
                  <p className="text-stone text-sm">
                    Required for tax and legal purposes under South African law.
                  </p>
                </div>
              </div>
              <div className="bg-charcoal border border-smoke p-6 flex items-center gap-4">
                <div className="bg-ember text-white-hot font-display text-lg w-16 h-16 flex items-center justify-center flex-shrink-0">
                  2 yrs
                </div>
                <div>
                  <h4 className="font-display text-white-hot mb-1">Customer Support Communications</h4>
                  <p className="text-stone text-sm">
                    To provide warranty support and resolve any ongoing issues.
                  </p>
                </div>
              </div>
              <div className="bg-charcoal border border-smoke p-6 flex items-center gap-4">
                <div className="bg-ember text-white-hot font-display text-lg w-16 h-16 flex items-center justify-center flex-shrink-0">
                  30 days
                </div>
                <div>
                  <h4 className="font-display text-white-hot mb-1">Website Analytics</h4>
                  <p className="text-stone text-sm">
                    Anonymised usage data to help improve our website.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-charcoal border border-smoke p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <AlertCircle className="h-8 w-8 text-ember mb-4" />
                <h2 className="font-display text-2xl sm:text-3xl text-white-hot mb-4">
                  Questions About Your Privacy?
                </h2>
                <p className="text-stone mb-6">
                  If you have any questions about this privacy policy, want to exercise your data
                  rights, or have concerns about how we handle your information, please get in touch.
                </p>
                <div className="space-y-2 text-stone">
                  <p>
                    <strong className="text-sand">Email:</strong>{" "}
                    <a href="mailto:privacy@koosdoos.co.za" className="text-ember hover:underline">
                      privacy@koosdoos.co.za
                    </a>
                  </p>
                  <p>
                    <strong className="text-sand">Information Officer:</strong> KoosDoos Fire Pits
                  </p>
                  <p>
                    <strong className="text-sand">Address:</strong> Pretoria, South Africa
                  </p>
                </div>
              </div>
              <div className="lg:text-right">
                <Link href="/pages/contact">
                  <Button size="lg" className="bg-ember hover:bg-ember/90 text-white-hot">
                    Contact Us
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-ember">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-4xl sm:text-5xl text-white-hot mb-4">
            Shop With Confidence
          </h2>
          <p className="text-xl text-white-hot/80 mb-8">
            Your privacy and security are our priority. Browse our collection knowing your data is protected.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/collections/fire-pits">
              <Button
                size="lg"
                className="bg-charcoal hover:bg-soot text-white-hot"
              >
                Shop Fire Pits
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/pages/terms">
              <Button
                size="lg"
                variant="outline"
                className="border-white-hot text-white-hot hover:bg-white-hot hover:text-ember"
              >
                View Terms & Conditions
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
