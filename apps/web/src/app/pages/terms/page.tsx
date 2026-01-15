import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText, ShoppingCart, Truck, Shield, AlertCircle, Scale, Clock } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "KoosDoos Fire Pits terms and conditions - read our terms of service, purchase conditions, and policies for shopping with us.",
};

const keyTerms = [
  {
    icon: ShoppingCart,
    title: "Order Acceptance",
    description:
      "All orders are subject to acceptance and availability. We reserve the right to refuse any order at our discretion.",
  },
  {
    icon: Truck,
    title: "Delivery Terms",
    description:
      "Delivery times are estimates only. Risk passes to you upon delivery. Please inspect items immediately upon receipt.",
  },
  {
    icon: Shield,
    title: "Warranty Coverage",
    description:
      "All products include a 2-year warranty against manufacturing defects. Terms and exclusions apply.",
  },
  {
    icon: Scale,
    title: "Governing Law",
    description:
      "These terms are governed by South African law. Any disputes will be resolved in South African courts.",
  },
];

const sections = [
  {
    id: "definitions",
    title: "1. Definitions",
    content: [
      '"KoosDoos", "we", "us", or "our" refers to KoosDoos Fire Pits (Pty) Ltd.',
      '"Customer", "you", or "your" refers to any person placing an order or using our website.',
      '"Products" refers to the fire pits, accessories, and custom design services offered for sale.',
      '"Website" refers to www.koosdoos.co.za and all associated pages.',
      '"Order" refers to a request to purchase Products submitted through our Website.',
    ],
  },
  {
    id: "acceptance",
    title: "2. Acceptance of Terms",
    content: [
      "By accessing our Website or placing an Order, you agree to be bound by these Terms and Conditions.",
      "If you do not agree to these terms, please do not use our Website or place any orders.",
      "We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the Website.",
      "Continued use of the Website after changes constitutes acceptance of the modified terms.",
    ],
  },
  {
    id: "orders",
    title: "3. Orders & Pricing",
    content: [
      "All prices are displayed in South African Rand (ZAR) and include VAT at the current rate.",
      "Prices are subject to change without notice. The price charged will be the price at the time of order confirmation.",
      "We reserve the right to refuse or cancel any order for any reason, including but not limited to product availability, pricing errors, or suspected fraud.",
      "An order is only accepted when we send you an order confirmation email. Until then, no contract exists between us.",
      "In the event of a pricing error, we will contact you to confirm whether you wish to proceed at the correct price.",
    ],
  },
  {
    id: "payment",
    title: "4. Payment Terms",
    content: [
      "Payment must be made in full at the time of order through our secure checkout process.",
      "We accept major credit cards, debit cards, and other payment methods as indicated on our Website.",
      "All payment processing is handled securely by Stripe. We do not store your full card details.",
      "Orders will not be dispatched until payment has been received and verified.",
      "If your payment is declined, your order will be cancelled and you will be notified.",
    ],
  },
  {
    id: "delivery",
    title: "5. Delivery & Shipping",
    content: [
      "We deliver throughout South Africa. Delivery times vary by region and are estimates only.",
      "Standard delivery is 3-7 business days for major centres. Remote areas may take longer.",
      "Free shipping is offered on orders over R2,500. Standard shipping fee is R150 for orders under this threshold.",
      "Risk of loss and damage passes to you upon delivery. Please inspect your order immediately.",
      "If you are not available to receive delivery, the courier may attempt redelivery or leave the package in a safe location.",
      "Any delivery delays due to circumstances beyond our control (weather, strikes, etc.) do not entitle you to cancel your order.",
    ],
  },
  {
    id: "returns",
    title: "6. Returns & Refunds",
    content: [
      "You may return standard products within 30 days of delivery if they are unused and in original packaging.",
      "Custom or personalised products cannot be returned unless they are defective or damaged.",
      "To initiate a return, contact us at support@koosdoos.co.za with your order number.",
      "Return shipping costs are the responsibility of the customer unless the return is due to our error.",
      "Refunds will be processed within 10 business days of receiving the returned item.",
      "Refunds will be credited to the original payment method used for the purchase.",
    ],
  },
  {
    id: "warranty",
    title: "7. Product Warranty",
    content: [
      "All KoosDoos fire pits come with a 2-year warranty against manufacturing defects.",
      "The warranty covers defects in materials and workmanship under normal use conditions.",
      "The warranty does not cover: normal wear and tear, surface rust (a natural characteristic of steel), damage from misuse, modifications, or use with prohibited fuels.",
      "Commercial use of products may void the warranty. Contact us for commercial warranty terms.",
      "To make a warranty claim, contact us with photos of the defect and your proof of purchase.",
    ],
  },
  {
    id: "custom",
    title: "8. Custom & Personalised Products",
    content: [
      "Custom design orders are non-refundable once production has commenced.",
      "You must have the rights to any designs, logos, or images you submit for personalisation.",
      "We reserve the right to refuse any custom design that infringes intellectual property rights or is offensive.",
      "Custom orders may take 2-3 weeks longer than standard orders for production.",
      "We will provide a digital proof for approval before production. Changes after approval may incur additional charges.",
      "By submitting a custom design, you grant us permission to use the design for production purposes only.",
    ],
  },
  {
    id: "ip",
    title: "9. Intellectual Property",
    content: [
      "All content on this Website, including logos, images, text, and designs, is the property of KoosDoos Fire Pits.",
      "You may not reproduce, distribute, or use any content from this Website without our written permission.",
      "Our product designs and templates are protected by copyright. Purchasing a product does not grant you intellectual property rights.",
      "Any user-generated content you submit (reviews, photos) may be used by us for marketing purposes.",
    ],
  },
  {
    id: "liability",
    title: "10. Limitation of Liability",
    content: [
      "To the maximum extent permitted by law, KoosDoos Fire Pits shall not be liable for any indirect, incidental, or consequential damages.",
      "Our total liability for any claim arising from your order shall not exceed the amount you paid for the relevant products.",
      "We are not liable for any injury or damage caused by improper use of our products.",
      "Fire pits should only be used outdoors in well-ventilated areas, following all safety instructions provided.",
      "We recommend adult supervision at all times when fire pits are in use, especially around children and pets.",
    ],
  },
  {
    id: "conduct",
    title: "11. User Conduct",
    content: [
      "You agree to use our Website only for lawful purposes and in accordance with these terms.",
      "You must not use our Website in any way that could damage, disable, or impair the Website.",
      "You must not attempt to gain unauthorised access to any part of our Website or systems.",
      "You must not use our Website to transmit any malicious code, spam, or harmful content.",
      "We reserve the right to terminate your access to the Website for any violation of these terms.",
    ],
  },
  {
    id: "privacy",
    title: "12. Privacy & Data Protection",
    content: [
      "Your use of our Website is also governed by our Privacy Policy, which is incorporated into these terms.",
      "We collect and process your personal information in accordance with POPIA (Protection of Personal Information Act).",
      "By placing an order, you consent to the collection and use of your information as described in our Privacy Policy.",
      'For full details on how we handle your data, please read our <a href="/pages/privacy" class="text-ember hover:underline">Privacy Policy</a>.',
    ],
  },
  {
    id: "disputes",
    title: "13. Dispute Resolution",
    content: [
      "If you have a complaint, please contact us first at support@koosdoos.co.za. We aim to resolve all issues promptly.",
      "If we cannot resolve the matter informally, either party may refer the dispute to mediation.",
      "These terms are governed by the laws of South Africa, and the South African courts will have exclusive jurisdiction.",
      "Nothing in these terms affects your statutory rights under the Consumer Protection Act.",
    ],
  },
  {
    id: "general",
    title: "14. General Provisions",
    content: [
      "If any provision of these terms is found to be invalid, the remaining provisions will continue in effect.",
      "Our failure to enforce any provision does not constitute a waiver of our right to enforce it later.",
      "These terms constitute the entire agreement between you and KoosDoos regarding your use of the Website and purchase of products.",
      "We may assign or transfer our rights under these terms to any third party without notice.",
      "You may not assign your rights under these terms without our written consent.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-charcoal border-b border-smoke">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumbs items={[{ label: "Terms & Conditions" }]} />

          <div className="py-8 lg:py-16 max-w-4xl">
            <span className="inline-block px-4 py-1 bg-ember text-white-hot text-sm font-bold uppercase tracking-wider mb-6">
              Terms & Conditions
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white-hot mb-6 leading-tight">
              Terms of
              <br />
              <span className="text-ember">Service</span>
            </h1>
            <p className="text-lg text-stone leading-relaxed mb-4">
              Please read these terms and conditions carefully before using our website or placing an order.
              By using our services, you agree to be bound by these terms.
            </p>
            <p className="text-stone">
              <strong className="text-sand">Last updated:</strong> January 2026
            </p>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="bg-ember/10 border-b border-ember/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            <FileText className="h-5 w-5 text-ember flex-shrink-0" />
            <span className="text-sand text-sm font-medium flex-shrink-0">Quick Links:</span>
            <div className="flex gap-2 flex-nowrap">
              {sections.slice(0, 7).map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="text-xs text-stone hover:text-ember whitespace-nowrap px-2 py-1 bg-charcoal/50 hover:bg-charcoal transition-colors"
                >
                  {section.title.split(". ")[1]}
                </a>
              ))}
              <span className="text-stone text-xs px-2 py-1">...</span>
            </div>
          </div>
        </div>
      </section>

      {/* Key Terms Summary */}
      <section className="py-16 lg:py-24 bg-soot">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-ember text-sm font-bold uppercase tracking-wider">
              Summary
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-white-hot mt-2 mb-4">
              Key Terms at a Glance
            </h2>
            <p className="text-stone max-w-2xl mx-auto">
              Here are the most important points from our terms. Please read the full terms below for complete details.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyTerms.map((term) => (
              <div
                key={term.title}
                className="bg-charcoal border border-smoke p-6 text-center hover:border-ember transition-colors"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-soot border border-smoke mb-4">
                  <term.icon className="h-6 w-6 text-ember" />
                </div>
                <h3 className="font-display text-lg text-white-hot mb-2">
                  {term.title}
                </h3>
                <p className="text-sm text-stone">{term.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full Terms Sections */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {sections.map((section) => (
              <div
                key={section.id}
                id={section.id}
                className="scroll-mt-24"
              >
                <h2 className="font-display text-2xl text-white-hot mb-6 pb-3 border-b border-smoke">
                  {section.title}
                </h2>
                <ul className="space-y-3">
                  {section.content.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-stone">
                      <span className="text-ember mt-1 flex-shrink-0">•</span>
                      <span dangerouslySetInnerHTML={{ __html: item }} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consumer Rights Notice */}
      <section className="py-16 lg:py-24 bg-soot">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-charcoal border border-smoke p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-8 w-8 text-ember" />
                  <span className="text-ember text-sm font-bold uppercase tracking-wider">
                    Consumer Protection
                  </span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl text-white-hot mb-4">
                  Your Consumer Rights
                </h2>
                <p className="text-stone mb-6">
                  Nothing in these terms affects your statutory rights under the South African Consumer Protection Act (CPA).
                  You have the right to:
                </p>
                <ul className="space-y-2 text-stone">
                  <li className="flex items-start gap-2">
                    <span className="text-ember mt-1">•</span>
                    Safe, good quality goods that are fit for purpose
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ember mt-1">•</span>
                    Clear and accurate information about products and prices
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ember mt-1">•</span>
                    Fair and honest dealing without deceptive practices
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ember mt-1">•</span>
                    A cooling-off period for direct marketing purchases
                  </li>
                </ul>
              </div>
              <div className="bg-soot border border-smoke p-6">
                <h3 className="font-display text-lg text-white-hot mb-4">
                  Need Help Understanding Your Rights?
                </h3>
                <p className="text-stone text-sm mb-4">
                  For more information about consumer rights in South Africa, visit the National Consumer Commission.
                </p>
                <a
                  href="https://www.thencc.gov.za"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ember hover:underline text-sm"
                >
                  www.thencc.gov.za
                </a>
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
                  Questions About These Terms?
                </h2>
                <p className="text-stone mb-6">
                  If you have any questions about these terms and conditions or need clarification on any point,
                  please don't hesitate to contact us.
                </p>
                <div className="space-y-2 text-stone">
                  <p>
                    <strong className="text-sand">Email:</strong>{" "}
                    <a href="mailto:support@koosdoos.co.za" className="text-ember hover:underline">
                      support@koosdoos.co.za
                    </a>
                  </p>
                  <p>
                    <strong className="text-sand">Phone:</strong>{" "}
                    <a href="tel:+27123456789" className="text-ember hover:underline">
                      +27 12 345 6789
                    </a>
                  </p>
                  <p>
                    <strong className="text-sand">Business Hours:</strong> Mon-Fri 8am-5pm SAST
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4 lg:items-end">
                <div className="flex items-center gap-3 text-stone">
                  <Clock className="h-5 w-5 text-ember" />
                  <span className="text-sm">We respond within 24 hours</span>
                </div>
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
            Ready to Shop?
          </h2>
          <p className="text-xl text-white-hot/80 mb-8">
            By placing an order, you agree to these terms and conditions. Happy shopping!
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
            <Link href="/pages/privacy">
              <Button
                size="lg"
                variant="outline"
                className="border-white-hot text-white-hot hover:bg-white-hot hover:text-ember"
              >
                View Privacy Policy
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
