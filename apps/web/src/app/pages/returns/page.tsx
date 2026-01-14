import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, RotateCcw, Clock, CheckCircle, AlertCircle, Package, ShieldCheck, HelpCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "Returns & Refunds",
  description:
    "Easy 30-day returns on all KoosDoos Fire Pits. Learn about our hassle-free return policy, refund process, and how to initiate a return.",
};

const returnFeatures = [
  {
    icon: Clock,
    title: "30-Day Returns",
    description: "Return any unused product within 30 days of delivery for a full refund.",
  },
  {
    icon: RotateCcw,
    title: "Easy Process",
    description: "Simple return process with prepaid shipping labels for eligible returns.",
  },
  {
    icon: ShieldCheck,
    title: "Full Refund",
    description: "Get your money back within 5-7 business days of receiving the return.",
  },
  {
    icon: HelpCircle,
    title: "Support Team",
    description: "Our team is here to help with any questions about returns or exchanges.",
  },
];

const returnSteps = [
  {
    step: 1,
    title: "Contact Us",
    description: "Email us at returns@koosdoos.co.za or call 012 345 6789 with your order number.",
  },
  {
    step: 2,
    title: "Get Approval",
    description: "We'll review your request and send you a Return Merchandise Authorization (RMA) number.",
  },
  {
    step: 3,
    title: "Pack & Ship",
    description: "Pack the item in original packaging and attach the prepaid shipping label we provide.",
  },
  {
    step: 4,
    title: "Refund Processed",
    description: "Once we receive and inspect the return, your refund will be processed within 5-7 days.",
  },
];

export default function ReturnsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-charcoal border-b border-smoke">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumbs items={[{ label: "Returns & Refunds" }]} />

          <div className="py-8 lg:py-16 max-w-3xl">
            <span className="inline-block px-4 py-1 bg-ember text-white-hot text-sm font-bold uppercase tracking-wider mb-6">
              Easy Returns
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white-hot mb-6 leading-tight">
              Returns &
              <br />
              <span className="text-ember">Refunds</span>
            </h1>
            <p className="text-lg text-stone leading-relaxed">
              Not happy with your purchase? No problem. We offer hassle-free returns within 30 days
              of delivery. Your satisfaction is our priority.
            </p>
          </div>
        </div>
      </section>

      {/* Return Features */}
      <section className="py-16 lg:py-24 bg-soot">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {returnFeatures.map((feature) => (
              <div
                key={feature.title}
                className="bg-charcoal border border-smoke p-6 text-center hover:border-ember transition-colors"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-soot border border-smoke mb-4">
                  <feature.icon className="h-6 w-6 text-ember" />
                </div>
                <h3 className="font-display text-lg text-white-hot mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-stone">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Return Policy Details */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-ember text-sm font-bold uppercase tracking-wider">
              Our Policy
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-white-hot mt-2 mb-4">
              Return Policy Details
            </h2>
            <p className="text-stone max-w-2xl mx-auto">
              We want you to be completely satisfied with your KoosDoos Fire Pit. Here&apos;s
              everything you need to know about returns and refunds.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Eligible for Return */}
            <div className="bg-soot border border-smoke p-8">
              <h3 className="font-display text-xl text-white-hot mb-6 flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-ember" />
                Eligible for Return
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-ember mt-2 flex-shrink-0" />
                  <span className="text-stone">
                    <strong className="text-sand">Unused products</strong> in original condition and packaging
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-ember mt-2 flex-shrink-0" />
                  <span className="text-stone">
                    <strong className="text-sand">Within 30 days</strong> of delivery date
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-ember mt-2 flex-shrink-0" />
                  <span className="text-stone">
                    <strong className="text-sand">Damaged or defective</strong> items (report within 48 hours)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-ember mt-2 flex-shrink-0" />
                  <span className="text-stone">
                    <strong className="text-sand">Wrong item received</strong> - we&apos;ll cover all return costs
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-ember mt-2 flex-shrink-0" />
                  <span className="text-stone">
                    <strong className="text-sand">Standard products</strong> from our regular range
                  </span>
                </li>
              </ul>
            </div>

            {/* Not Eligible for Return */}
            <div className="bg-soot border border-smoke p-8">
              <h3 className="font-display text-xl text-white-hot mb-6 flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-ember" />
                Not Eligible for Return
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-ember mt-2 flex-shrink-0" />
                  <span className="text-stone">
                    <strong className="text-sand">Custom/personalised orders</strong> - these are made specifically for you
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-ember mt-2 flex-shrink-0" />
                  <span className="text-stone">
                    <strong className="text-sand">Used products</strong> or items showing signs of fire/heat exposure
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-ember mt-2 flex-shrink-0" />
                  <span className="text-stone">
                    <strong className="text-sand">Missing parts</strong> or items without original packaging
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-ember mt-2 flex-shrink-0" />
                  <span className="text-stone">
                    <strong className="text-sand">After 30 days</strong> from delivery date
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-ember mt-2 flex-shrink-0" />
                  <span className="text-stone">
                    <strong className="text-sand">Damage from misuse</strong> or improper handling
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How to Return */}
      <section className="py-16 lg:py-24 bg-soot">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-ember text-sm font-bold uppercase tracking-wider">
              Return Process
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-white-hot mt-2">
              How to Return an Item
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {returnSteps.map((item, index) => (
              <div key={item.step} className="relative">
                <div className="bg-charcoal border border-smoke p-6 text-center h-full">
                  <span className="inline-flex items-center justify-center w-10 h-10 bg-ember text-white-hot font-display text-lg mb-4">
                    {item.step}
                  </span>
                  <h3 className="font-display text-lg text-white-hot mb-2">{item.title}</h3>
                  <p className="text-sm text-stone">{item.description}</p>
                </div>
                {index < returnSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-ember" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Refund Information */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-ember text-sm font-bold uppercase tracking-wider">
              Refund Details
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-white-hot mt-2 mb-4">
              Refund Information
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-soot border border-smoke p-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-charcoal border border-smoke mb-4">
                <Package className="h-6 w-6 text-ember" />
              </div>
              <h3 className="font-display text-lg text-white-hot mb-3">Standard Returns</h3>
              <p className="text-stone text-sm mb-4">
                For change-of-mind returns, you&apos;ll receive a full refund of the product price.
                Original shipping costs are non-refundable.
              </p>
              <p className="text-sand text-sm">
                Return shipping: Customer pays unless item is defective
              </p>
            </div>

            <div className="bg-soot border border-smoke p-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-charcoal border border-smoke mb-4">
                <AlertCircle className="h-6 w-6 text-ember" />
              </div>
              <h3 className="font-display text-lg text-white-hot mb-3">Damaged/Defective Items</h3>
              <p className="text-stone text-sm mb-4">
                If your item arrived damaged or defective, we&apos;ll provide a full refund including
                original shipping costs, plus free return shipping.
              </p>
              <p className="text-sand text-sm">
                Report within 48 hours with photos for fastest resolution
              </p>
            </div>

            <div className="bg-soot border border-smoke p-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-charcoal border border-smoke mb-4">
                <Clock className="h-6 w-6 text-ember" />
              </div>
              <h3 className="font-display text-lg text-white-hot mb-3">Refund Timeline</h3>
              <p className="text-stone text-sm mb-4">
                Once we receive your return, we&apos;ll inspect it within 2 business days. Approved
                refunds are processed within 5-7 business days.
              </p>
              <p className="text-sand text-sm">
                Refund to original payment method (card, EFT, etc.)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Exchange Option */}
      <section className="py-16 lg:py-24 bg-soot">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-charcoal border border-ember p-8 lg:p-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-ember/10 border border-ember mb-6">
                <RotateCcw className="h-8 w-8 text-ember" />
              </div>
              <h2 className="font-display text-2xl sm:text-3xl text-white-hot mb-4">
                Prefer an Exchange?
              </h2>
              <p className="text-stone mb-6 max-w-2xl mx-auto">
                If you&apos;d like to exchange your fire pit for a different size, we can help!
                Simply contact us and we&apos;ll arrange the exchange. You&apos;ll only pay the
                price difference (if any) plus shipping for the new item.
              </p>
              <Link href="/pages/contact">
                <Button size="lg" className="bg-ember hover:bg-ember/80 text-white-hot">
                  Contact Us for Exchange
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-soot border border-smoke p-8">
            <h3 className="font-display text-xl text-white-hot mb-6 flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-ember" />
              Important Return Notes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-ember mt-2 flex-shrink-0" />
                  <span className="text-stone">
                    Please include your RMA number on the outside of the return package
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-ember mt-2 flex-shrink-0" />
                  <span className="text-stone">
                    Use the original packaging if possible to prevent damage during return shipping
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-ember mt-2 flex-shrink-0" />
                  <span className="text-stone">
                    Keep your return tracking number until your refund is processed
                  </span>
                </li>
              </ul>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-ember mt-2 flex-shrink-0" />
                  <span className="text-stone">
                    Refunds may take an additional 2-5 business days to appear in your account
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-ember mt-2 flex-shrink-0" />
                  <span className="text-stone">
                    For defective items, keep photos ready when contacting support
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-ember mt-2 flex-shrink-0" />
                  <span className="text-stone">
                    Warranty claims are handled separately - see our warranty page for details
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-ember">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-4xl sm:text-5xl text-white-hot mb-4">
            Need Help With a Return?
          </h2>
          <p className="text-xl text-white-hot/80 mb-8">
            Our team is ready to assist. Get in touch and we&apos;ll make it right.
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
            <Link href="/pages/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white-hot text-white-hot hover:bg-white-hot hover:text-ember"
              >
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
