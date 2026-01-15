import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Wrench, Clock, CheckCircle, AlertTriangle, Package, Flame } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "Assembly Guide",
  description:
    "Easy 5-minute assembly guide for your KoosDoos Fire Pit. No tools required. Step-by-step instructions to get your fire pit ready for your first braai.",
};

const assemblySteps = [
  {
    step: 1,
    title: "Unpack Your Fire Pit",
    description:
      "Remove all panels from the packaging. You should have 4 side panels, 1 base panel, and any decorative inserts. Check that all pieces are present and undamaged.",
    tip: "Lay out all pieces on a flat surface to verify you have everything before starting.",
  },
  {
    step: 2,
    title: "Identify the Panels",
    description:
      "Each panel has interlocking tabs and slots. The base panel has slots on all four edges. Side panels have tabs on the bottom and interlocking edges.",
    tip: "Look for the KoosDoos logo - it should face outward on the front panel.",
  },
  {
    step: 3,
    title: "Assemble the Base",
    description:
      "Place the base panel on your desired location. Ensure the surface is flat, stable, and away from any flammable materials. The base should sit firmly on the ground.",
    tip: "Position your fire pit at least 3 metres from buildings, fences, and overhanging branches.",
  },
  {
    step: 4,
    title: "Attach the Side Panels",
    description:
      "Insert the first side panel by sliding the bottom tabs into the base slots. Hold it upright and attach the second panel, interlocking the edges. Continue with remaining panels.",
    tip: "Work around the fire pit in one direction - it makes interlocking easier.",
  },
  {
    step: 5,
    title: "Final Check",
    description:
      "Ensure all panels are firmly interlocked and the structure is stable. Give it a gentle shake - there should be no wobbling. Your KoosDoos fire pit is now ready to use!",
    tip: "If any panel feels loose, remove it and re-seat it ensuring tabs are fully engaged.",
  },
];

const safetyTips = [
  "Never leave a fire unattended",
  "Keep children and pets at a safe distance",
  "Have water or a fire extinguisher nearby",
  "Don't use accelerants like petrol or paraffin",
  "Allow the fire pit to cool completely before moving",
  "Don't place on wooden decks without a heat shield",
  "Check local fire regulations and burn bans",
  "Only burn seasoned wood - avoid treated timber",
];

export default function AssemblyPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-charcoal border-b border-smoke">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumbs items={[{ label: "Assembly Guide" }]} />

          <div className="py-8 lg:py-16 max-w-3xl">
            <span className="inline-block px-4 py-1 bg-ember text-white-hot text-sm font-bold uppercase tracking-wider mb-6">
              Get Started
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white-hot mb-6 leading-tight">
              Assembly
              <br />
              <span className="text-ember">Guide</span>
            </h1>
            <p className="text-lg text-stone leading-relaxed">
              Your KoosDoos fire pit assembles in just 5 minutes with no tools required.
              Follow these simple steps to get your fire pit ready for your first braai.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-soot border-b border-smoke">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-charcoal border border-smoke mb-3">
                <Clock className="h-6 w-6 text-ember" />
              </div>
              <p className="font-display text-2xl text-white-hot">5 min</p>
              <p className="text-sm text-stone">Assembly Time</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-charcoal border border-smoke mb-3">
                <Wrench className="h-6 w-6 text-ember" />
              </div>
              <p className="font-display text-2xl text-white-hot">Zero</p>
              <p className="text-sm text-stone">Tools Required</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-charcoal border border-smoke mb-3">
                <Package className="h-6 w-6 text-ember" />
              </div>
              <p className="font-display text-2xl text-white-hot">5</p>
              <p className="text-sm text-stone">Panels Total</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-charcoal border border-smoke mb-3">
                <Flame className="h-6 w-6 text-ember" />
              </div>
              <p className="font-display text-2xl text-white-hot">Ready</p>
              <p className="text-sm text-stone">To Braai</p>
            </div>
          </div>
        </div>
      </section>

      {/* Assembly Steps */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-ember text-sm font-bold uppercase tracking-wider">
              Step by Step
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-white-hot mt-2 mb-4">
              Assembly Instructions
            </h2>
            <p className="text-stone max-w-2xl mx-auto">
              Follow these 5 simple steps to assemble your KoosDoos fire pit.
              No tools, no fuss, just fire.
            </p>
          </div>

          <div className="space-y-8">
            {assemblySteps.map((step) => (
              <div
                key={step.step}
                className="bg-soot border border-smoke p-6 lg:p-8"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center justify-center w-14 h-14 bg-ember text-white-hot font-display text-2xl">
                      {step.step}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-xl text-white-hot mb-3">
                      {step.title}
                    </h3>
                    <p className="text-stone mb-4">{step.description}</p>
                    <div className="flex items-start gap-3 bg-charcoal border border-smoke p-4">
                      <CheckCircle className="h-5 w-5 text-ember flex-shrink-0 mt-0.5" />
                      <p className="text-sand text-sm">
                        <strong>Pro Tip:</strong> {step.tip}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section className="py-16 lg:py-24 bg-soot">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <span className="text-ember text-sm font-bold uppercase tracking-wider">
                Stay Safe
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-white-hot mt-2 mb-6">
                Fire Safety Tips
              </h2>
              <p className="text-stone mb-8">
                Your KoosDoos fire pit is built tough, but fire always demands respect.
                Follow these guidelines for safe and enjoyable use.
              </p>

              <div className="bg-charcoal border border-ember/50 p-6 mb-6">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="h-6 w-6 text-ember flex-shrink-0" />
                  <div>
                    <h3 className="font-display text-lg text-white-hot mb-2">
                      Important Warning
                    </h3>
                    <p className="text-stone text-sm">
                      The fire pit and surrounding area will become extremely hot during use.
                      Keep all flammable materials at a safe distance and never touch the
                      fire pit while in use or until completely cooled.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-charcoal border border-smoke p-8">
              <h3 className="font-display text-xl text-white-hot mb-6">
                Safety Checklist
              </h3>
              <ul className="space-y-4">
                {safetyTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-ember flex-shrink-0 mt-0.5" />
                    <span className="text-stone">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* First Fire Tips */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-ember text-sm font-bold uppercase tracking-wider">
              Getting Started
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-white-hot mt-2 mb-4">
              Your First Fire
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-soot border border-smoke p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-charcoal border border-smoke mb-4">
                <span className="font-display text-xl text-ember">1</span>
              </div>
              <h3 className="font-display text-lg text-white-hot mb-2">
                Start Small
              </h3>
              <p className="text-stone text-sm">
                Begin with a small fire using kindling and dry wood. Let the fire pit
                heat up gradually on its first use.
              </p>
            </div>

            <div className="bg-soot border border-smoke p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-charcoal border border-smoke mb-4">
                <span className="font-display text-xl text-ember">2</span>
              </div>
              <h3 className="font-display text-lg text-white-hot mb-2">
                Expect Discolouration
              </h3>
              <p className="text-stone text-sm">
                The steel will develop a natural patina with use. This is normal and
                adds character to your fire pit.
              </p>
            </div>

            <div className="bg-soot border border-smoke p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-charcoal border border-smoke mb-4">
                <span className="font-display text-xl text-ember">3</span>
              </div>
              <h3 className="font-display text-lg text-white-hot mb-2">
                Enjoy Responsibly
              </h3>
              <p className="text-stone text-sm">
                Gather your mates, crack open a cold one, and enjoy the fire.
                That&apos;s what it&apos;s all about.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-ember">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-4xl sm:text-5xl text-white-hot mb-4">
            Need More Help?
          </h2>
          <p className="text-xl text-white-hot/80 mb-8">
            Our team is here to assist. Reach out if you have any questions about assembly or use.
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
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
