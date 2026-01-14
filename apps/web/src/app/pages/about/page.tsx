import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flame, Wrench, Shield, Users, MapPin, Award } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Learn about KoosDoos Fire Pits - premium laser-cut steel fire pits designed and made in South Africa. Built tough for the serious braai enthusiast.",
};

const values = [
  {
    icon: Flame,
    title: "Built For Fire",
    description:
      "We design for one purpose: to make the best fire pit you'll ever own. Every curve, every slot, every detail serves that goal.",
  },
  {
    icon: Wrench,
    title: "No Nonsense",
    description:
      "Flat-pack. Tool-free. Ready in minutes. We stripped away everything that doesn't matter and perfected what does.",
  },
  {
    icon: Shield,
    title: "Tough As Nails",
    description:
      "3-4mm premium steel that handles whatever you throw at it. Rain, heat, the test of time - a KoosDoos just keeps burning.",
  },
  {
    icon: Users,
    title: "Family Owned",
    description:
      "We're not some faceless corporation. We're a South African family business that stands behind every fire pit we make.",
  },
];

const milestones = [
  {
    year: "2018",
    title: "The First Spark",
    description:
      "Frustrated with flimsy imports rusting after one season, we built our first prototype in a Pretoria garage.",
  },
  {
    year: "2019",
    title: "First Production Run",
    description:
      "After 15 prototypes and countless braais, we launched our first production run. Sold out in 3 weeks.",
  },
  {
    year: "2020",
    title: "Personalisation Launch",
    description:
      "We added custom laser-cutting capabilities, letting customers put their own designs on their fire pits.",
  },
  {
    year: "2022",
    title: "National Expansion",
    description:
      "From local Pretoria deliveries to shipping nationwide. KoosDoos fire pits now warm backyards across South Africa.",
  },
  {
    year: "2024",
    title: "10,000+ Fire Pits",
    description:
      "A proud milestone - over 10,000 KoosDoos fire pits delivered to happy customers across the country.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-charcoal border-b border-smoke">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumbs items={[{ label: "Our Story" }]} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-8 lg:py-16">
            <div>
              <span className="inline-block px-4 py-1 bg-ember text-white-hot text-sm font-bold uppercase tracking-wider mb-6">
                Our Story
              </span>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white-hot mb-6 leading-tight">
                Steel Guts.
                <br />
                <span className="text-ember">Real Fire.</span>
              </h1>
              <p className="text-lg text-stone leading-relaxed mb-6">
                KoosDoos was born from a simple frustration: every fire pit we bought rusted through
                after one winter. We knew we could do better. So we did.
              </p>
              <p className="text-stone leading-relaxed">
                From a garage in Pretoria to backyards across South Africa, we've built a reputation
                for fire pits that actually last. Thick steel. Smart design. No compromises.
              </p>
            </div>
            <div className="relative aspect-square bg-soot border border-smoke overflow-hidden">
              <Image
                src="/images/koosdoos-logo.png"
                alt="KoosDoos Fire Pits"
                fill
                className="object-contain p-12"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ember/20 to-transparent h-1/3" />
            </div>
          </div>
        </div>
      </section>

      {/* Origin Story Section */}
      <section className="py-16 lg:py-24 bg-soot">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-ember text-sm font-bold uppercase tracking-wider">
              Where It Started
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-white-hot mt-2 mb-6">
              From Frustration To Fire
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="bg-charcoal border border-smoke p-8">
              <h3 className="font-display text-xl text-white-hot mb-4">The Problem</h3>
              <p className="text-stone leading-relaxed mb-4">
                It started with yet another rusted-out fire pit. The third one in as many years.
                Thin steel, poor welds, and designs that looked good online but fell apart in
                the real world.
              </p>
              <p className="text-stone leading-relaxed">
                We'd spent good money on imports that promised "premium quality" but delivered
                anything but. There had to be a better way.
              </p>
            </div>

            <div className="bg-charcoal border border-smoke p-8">
              <h3 className="font-display text-xl text-white-hot mb-4">The Solution</h3>
              <p className="text-stone leading-relaxed mb-4">
                Armed with CAD software, a contact at a local steel supplier, and access to a
                laser cutter, we designed our first prototype. Thick steel. Flat-pack design
                that ships easily. Tool-free assembly.
              </p>
              <p className="text-stone leading-relaxed">
                After 15 iterations and countless backyard tests, KoosDoos was born. A fire pit
                built the way it should have been built all along.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-ember text-sm font-bold uppercase tracking-wider">
              What Drives Us
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-white-hot mt-2">
              Our Values
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-soot border border-smoke p-6 text-center hover:border-ember transition-colors"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-charcoal border border-smoke mb-4">
                  <value.icon className="h-6 w-6 text-ember" />
                </div>
                <h3 className="font-display text-lg text-white-hot mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-stone">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 lg:py-24 bg-soot">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-ember text-sm font-bold uppercase tracking-wider">
              Our Journey
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-white-hot mt-2">
              The KoosDoos Story
            </h2>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-smoke" />

            <div className="space-y-8 lg:space-y-0">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.year}
                  className={`relative lg:flex lg:items-center ${
                    index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  {/* Content */}
                  <div className="lg:w-1/2 lg:px-8">
                    <div
                      className={`bg-charcoal border border-smoke p-6 ${
                        index % 2 === 0 ? "lg:mr-4" : "lg:ml-4"
                      }`}
                    >
                      <span className="text-ember font-display text-2xl">
                        {milestone.year}
                      </span>
                      <h3 className="font-display text-lg text-white-hot mt-1 mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-sm text-stone">{milestone.description}</p>
                    </div>
                  </div>

                  {/* Timeline dot */}
                  <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-ember border-2 border-charcoal" />

                  {/* Empty space for alternating layout */}
                  <div className="hidden lg:block lg:w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Made in SA Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="h-6 w-6 text-ember" />
                <span className="text-ember text-sm font-bold uppercase tracking-wider">
                  Proudly South African
                </span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl text-white-hot mb-6">
                Designed & Made In Pretoria
              </h2>
              <div className="space-y-4 text-stone">
                <p>
                  Every KoosDoos fire pit is designed in Pretoria and manufactured right here
                  in South Africa. We work with local steel suppliers and laser cutting specialists
                  who share our commitment to quality.
                </p>
                <p>
                  This isn't just about supporting local - it's about control. By keeping
                  production close, we can ensure every fire pit meets our standards before
                  it reaches your backyard.
                </p>
                <p className="text-sand font-medium">
                  From Pretoria with fire. For braai lovers, by braai lovers.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-soot border border-smoke p-6 text-center">
                <Award className="h-8 w-8 text-ember mx-auto mb-3" />
                <span className="font-display text-3xl text-white-hot block">10,000+</span>
                <span className="text-sm text-stone">Fire Pits Delivered</span>
              </div>
              <div className="bg-soot border border-smoke p-6 text-center">
                <Shield className="h-8 w-8 text-ember mx-auto mb-3" />
                <span className="font-display text-3xl text-white-hot block">2 Year</span>
                <span className="text-sm text-stone">Warranty</span>
              </div>
              <div className="bg-soot border border-smoke p-6 text-center">
                <Users className="h-8 w-8 text-ember mx-auto mb-3" />
                <span className="font-display text-3xl text-white-hot block">4.9/5</span>
                <span className="text-sm text-stone">Customer Rating</span>
              </div>
              <div className="bg-soot border border-smoke p-6 text-center">
                <Flame className="h-8 w-8 text-ember mx-auto mb-3" />
                <span className="font-display text-3xl text-white-hot block">6 Years</span>
                <span className="text-sm text-stone">In Business</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-ember">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-4xl sm:text-5xl text-white-hot mb-4">
            Ready To Join The Family?
          </h2>
          <p className="text-xl text-white-hot/80 mb-8">
            Experience the difference a properly built fire pit makes. Free shipping on orders over R2,500.
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
                Get In Touch
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
