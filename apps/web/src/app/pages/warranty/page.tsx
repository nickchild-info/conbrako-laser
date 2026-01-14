import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Clock, Wrench, CheckCircle, AlertCircle, FileText, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "Warranty",
  description:
    "KoosDoos Fire Pits come with a comprehensive 2-year warranty. Learn what's covered, how to make a claim, and our commitment to quality.",
};

const warrantyFeatures = [
  {
    icon: ShieldCheck,
    title: "2-Year Coverage",
    description: "Full warranty protection for 24 months from your purchase date.",
  },
  {
    icon: Wrench,
    title: "Free Repairs",
    description: "We'll repair or replace any defective parts at no cost to you.",
  },
  {
    icon: Clock,
    title: "Fast Response",
    description: "Warranty claims processed within 48 hours of submission.",
  },
  {
    icon: FileText,
    title: "Simple Process",
    description: "Easy online claim submission with quick turnaround times.",
  },
];

const claimSteps = [
  {
    step: 1,
    title: "Document the Issue",
    description: "Take clear photos or videos showing the defect or damage to your fire pit.",
  },
  {
    step: 2,
    title: "Submit Your Claim",
    description: "Email warranty@koosdoos.co.za with your order number, photos, and description of the issue.",
  },
  {
    step: 3,
    title: "Review & Approval",
    description: "Our team will review your claim within 48 hours and confirm coverage.",
  },
  {
    step: 4,
    title: "Resolution",
    description: "We'll send replacement parts, arrange repair, or provide a replacement unit as needed.",
  },
];

export default function WarrantyPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-charcoal border-b border-smoke">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumbs items={[{ label: "Warranty" }]} />

          <div className="py-8 lg:py-16 max-w-3xl">
            <span className="inline-block px-4 py-1 bg-ember text-white-hot text-sm font-bold uppercase tracking-wider mb-6">
              2-Year Warranty
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white-hot mb-6 leading-tight">
              Built to Last,
              <br />
              <span className="text-ember">Backed by Us</span>
            </h1>
            <p className="text-lg text-stone leading-relaxed">
              Every KoosDoos Fire Pit is crafted from heavy-duty steel and built to withstand years of
              use. We stand behind our work with a comprehensive 2-year warranty.
            </p>
          </div>
        </div>
      </section>

      {/* Warranty Features */}
      <section className="py-16 lg:py-24 bg-soot">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {warrantyFeatures.map((feature) => (
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

      {/* Warranty Coverage Details */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-ember text-sm font-bold uppercase tracking-wider">
              Coverage Details
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-white-hot mt-2 mb-4">
              What&apos;s Covered
            </h2>
            <p className="text-stone max-w-2xl mx-auto">
              Our warranty covers manufacturing defects and material failures. Here&apos;s
              everything you need to know about your coverage.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Covered */}
            <div className="bg-soot border border-smoke p-8">
              <h3 className="font-display text-xl text-white-hot mb-6 flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-ember" />
                Covered by Warranty
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-ember mt-2 flex-shrink-0" />
                  <span className="text-stone">
                    <strong className="text-sand">Manufacturing defects</strong> in materials or workmanship
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-ember mt-2 flex-shrink-0" />
                  <span className="text-stone">
                    <strong className="text-sand">Structural failures</strong> including welds, joints, and panel integrity
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-ember mt-2 flex-shrink-0" />
                  <span className="text-stone">
                    <strong className="text-sand">Paint and finish defects</strong> such as premature peeling or flaking
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-ember mt-2 flex-shrink-0" />
                  <span className="text-stone">
                    <strong className="text-sand">Hardware failures</strong> including bolts, hinges, and assembly components
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-ember mt-2 flex-shrink-0" />
                  <span className="text-stone">
                    <strong className="text-sand">Laser-cut design integrity</strong> on personalised panels
                  </span>
                </li>
              </ul>
            </div>

            {/* Not Covered */}
            <div className="bg-soot border border-smoke p-8">
              <h3 className="font-display text-xl text-white-hot mb-6 flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-ember" />
                Not Covered by Warranty
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-ember mt-2 flex-shrink-0" />
                  <span className="text-stone">
                    <strong className="text-sand">Normal wear and tear</strong> from regular use and exposure to elements
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-ember mt-2 flex-shrink-0" />
                  <span className="text-stone">
                    <strong className="text-sand">Surface rust</strong> - this is natural patina that protects the steel
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-ember mt-2 flex-shrink-0" />
                  <span className="text-stone">
                    <strong className="text-sand">Damage from misuse</strong> including overloading or improper fuel
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-ember mt-2 flex-shrink-0" />
                  <span className="text-stone">
                    <strong className="text-sand">Modifications</strong> or alterations made after purchase
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-ember mt-2 flex-shrink-0" />
                  <span className="text-stone">
                    <strong className="text-sand">Commercial use</strong> - warranty applies to residential use only
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* About Rust Section */}
      <section className="py-16 lg:py-24 bg-soot">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-charcoal border border-ember p-8 lg:p-12">
            <div className="text-center">
              <span className="inline-block px-4 py-1 bg-ember/20 border border-ember text-ember text-sm font-bold uppercase tracking-wider mb-6">
                Good to Know
              </span>
              <h2 className="font-display text-2xl sm:text-3xl text-white-hot mb-4">
                About Rust & Patina
              </h2>
              <p className="text-stone mb-6 max-w-2xl mx-auto">
                Our fire pits are made from raw steel and will develop a natural rust patina over time.
                This is not a defect - it&apos;s a feature! The rust layer actually protects the steel
                from further corrosion and gives your fire pit that authentic, rugged look.
              </p>
              <p className="text-sand text-sm">
                Tip: If you prefer to prevent rust, apply a high-heat resistant spray after each use.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Make a Claim */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-ember text-sm font-bold uppercase tracking-wider">
              Claim Process
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-white-hot mt-2">
              How to Make a Warranty Claim
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {claimSteps.map((item, index) => (
              <div key={item.step} className="relative">
                <div className="bg-soot border border-smoke p-6 text-center h-full">
                  <span className="inline-flex items-center justify-center w-10 h-10 bg-ember text-white-hot font-display text-lg mb-4">
                    {item.step}
                  </span>
                  <h3 className="font-display text-lg text-white-hot mb-2">{item.title}</h3>
                  <p className="text-sm text-stone">{item.description}</p>
                </div>
                {index < claimSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-ember" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Warranty Registration */}
      <section className="py-16 lg:py-24 bg-soot">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-ember text-sm font-bold uppercase tracking-wider">
              Registration
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-white-hot mt-2 mb-4">
              Register Your Fire Pit
            </h2>
            <p className="text-stone max-w-2xl mx-auto">
              While your warranty is automatically active from the date of purchase, registering your
              product helps us serve you faster if you ever need support.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-charcoal border border-smoke p-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-soot border border-smoke mb-4">
                <FileText className="h-6 w-6 text-ember" />
              </div>
              <h3 className="font-display text-lg text-white-hot mb-3">Keep Your Receipt</h3>
              <p className="text-stone text-sm">
                Your order confirmation email serves as proof of purchase. Keep it safe
                for warranty claims. We also maintain records of all orders.
              </p>
            </div>

            <div className="bg-charcoal border border-smoke p-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-soot border border-smoke mb-4">
                <Clock className="h-6 w-6 text-ember" />
              </div>
              <h3 className="font-display text-lg text-white-hot mb-3">Warranty Period</h3>
              <p className="text-stone text-sm">
                Your 2-year warranty starts from the delivery date, not the order date.
                Coverage extends for exactly 24 months from when you received your fire pit.
              </p>
            </div>

            <div className="bg-charcoal border border-smoke p-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-soot border border-smoke mb-4">
                <Phone className="h-6 w-6 text-ember" />
              </div>
              <h3 className="font-display text-lg text-white-hot mb-3">Get Support</h3>
              <p className="text-stone text-sm">
                Questions about your warranty? Contact us at warranty@koosdoos.co.za
                or call 012 345 6789. We&apos;re here to help Monday to Friday, 8am-5pm.
              </p>
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
              Important Warranty Notes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-ember mt-2 flex-shrink-0" />
                  <span className="text-stone">
                    Warranty is valid only for the original purchaser and is non-transferable
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-ember mt-2 flex-shrink-0" />
                  <span className="text-stone">
                    Replacement parts will be shipped free of charge within South Africa
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-ember mt-2 flex-shrink-0" />
                  <span className="text-stone">
                    We may request the defective part to be returned for quality assessment
                  </span>
                </li>
              </ul>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-ember mt-2 flex-shrink-0" />
                  <span className="text-stone">
                    For full unit replacements, the original fire pit must be returned
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-ember mt-2 flex-shrink-0" />
                  <span className="text-stone">
                    Custom/personalised fire pits have the same warranty as standard models
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-ember mt-2 flex-shrink-0" />
                  <span className="text-stone">
                    Our warranty is in addition to, not in place of, your consumer rights
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
            Questions About Your Warranty?
          </h2>
          <p className="text-xl text-white-hot/80 mb-8">
            Our support team is ready to help with any warranty questions or claims.
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
