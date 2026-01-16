"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Truck,
  Shield,
  Wrench,
  Flame,
  Palette,
  ChevronLeft,
  ChevronRight,
  Star,
  Quote,
} from "lucide-react";
import { ProductCard } from "@/components/product";
import { Button } from "@/components/ui";
import { useCart } from "@/lib/cart-context";
import { Product } from "@/types";

interface HomePageClientProps {
  featuredProducts: Product[];
}

const features = [
  {
    icon: Flame,
    title: "Laser-Cut Precision",
    description: "Intricate designs cut from premium steel",
  },
  {
    icon: Wrench,
    title: "Tool-Free Assembly",
    description: "Flat-pack to fire pit in under 5 minutes",
  },
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over R2,500",
  },
  {
    icon: Shield,
    title: "Built To Last",
    description: "3-4mm steel that outlasts everything",
  },
];

const testimonials = [
  {
    id: 1,
    name: "Johan van der Merwe",
    location: "Pretoria, Gauteng",
    rating: 5,
    text: "Best braai accessory I've ever bought. The Medium KoosDoos is perfect for our family gatherings. Assembled it in 3 minutes flat and the heat output is incredible. Already planning to order another for the farm.",
    product: "KoosDoos Medium",
  },
  {
    id: 2,
    name: "Sarah Botha",
    location: "Stellenbosch, Western Cape",
    rating: 5,
    text: "Got the personalised fire pit with our lodge logo for the guest area. Absolute showstopper. Guests ask about it constantly. The quality of the laser cutting is seriously impressive.",
    product: "KoosDoos Personalised",
  },
  {
    id: 3,
    name: "Mike Thompson",
    location: "Durban, KZN",
    rating: 5,
    text: "Bought the XL for our rugby club. It's a beast. We've had it going for 6 hours straight on game days and it just keeps delivering. Tough as nails and looks amazing with the rust patina developing.",
    product: "KoosDoos XL",
  },
  {
    id: 4,
    name: "Annika Pretorius",
    location: "Bloemfontein, Free State",
    rating: 5,
    text: "Finally a fire pit that doesn't rust through after one winter! Two years in and our KoosDoos still looks and performs like new. The flat-pack design also made it easy to take camping.",
    product: "KoosDoos Large",
  },
  {
    id: 5,
    name: "David Nkosi",
    location: "Johannesburg, Gauteng",
    rating: 5,
    text: "I was skeptical about the price but this thing is worth every cent. The steel is thick, the design is clever, and it looks way better than those cheap imports. Should've bought one years ago.",
    product: "KoosDoos Medium",
  },
];

export function HomePageClient({ featuredProducts }: HomePageClientProps) {
  const { addItem } = useCart();
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const nextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setTestimonialIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background with hero image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero/hero-bg.jpg"
            alt="KoosDoos fire pit with flames"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-charcoal/70" />
          {/* Decorative fire gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-ember/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <span className="inline-block px-4 py-1 bg-ember text-white-hot text-sm font-bold uppercase tracking-wider mb-6">
            Premium Fire Pits
          </span>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-8xl text-white-hot mb-6 leading-none">
            Built Tough.
            <br />
            <span className="text-ember">Burns Harder.</span>
          </h1>

          <p className="text-xl sm:text-2xl text-stone max-w-2xl mx-auto mb-10">
            Laser-cut steel fire pits. Flat-pack design. Rugged construction.
            <span className="block mt-2 text-sand font-medium">
              Not for sissies.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/collections/fire-pits">
              <Button size="lg" className="w-full sm:w-auto">
                Shop Fire Pits
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/personalise">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Personalise Yours
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-steel-grey rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-ember rounded-full" />
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-soot border-y border-smoke">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-smoke">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="py-8 px-4 text-center first:pl-0 last:pr-0"
              >
                <feature.icon className="h-8 w-8 text-ember mx-auto mb-3" />
                <h3 className="font-display text-lg text-white-hot mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-stone">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products - Size Range */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-ember text-sm font-bold uppercase tracking-wider">
                Choose Your Size
              </span>
              <h2 className="font-display text-4xl sm:text-5xl text-white-hot mt-2">
                Fire Pits
              </h2>
            </div>
            <Link
              href="/collections/fire-pits"
              className="hidden sm:flex items-center gap-2 text-stone hover:text-white-hot transition-colors text-sm uppercase tracking-wide"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addItem}
              />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/collections/fire-pits">
              <Button variant="secondary">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Personalise Section */}
      <section className="py-16 lg:py-24 bg-soot">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <span className="text-ember text-sm font-bold uppercase tracking-wider">
                Make It Yours
              </span>
              <h2 className="font-display text-4xl sm:text-5xl text-white-hot mt-2 mb-6">
                Personalised
                <br />
                Fire Pits
              </h2>
              <div className="space-y-4 text-stone">
                <p>
                  Create a one-of-a-kind fire pit with your own custom design.
                  Upload your logo, family crest, or choose from our library of
                  South African-inspired templates.
                </p>
                <p>
                  Perfect for businesses, sports clubs, game lodges, or as a
                  truly unique gift. Our team reviews every design to ensure
                  perfect laser-cut results.
                </p>
                <p className="text-sand font-medium">
                  Your design. Your fire pit. Your story.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link href="/personalise">
                  <Button>
                    <Palette className="mr-2 h-4 w-4" />
                    Start Designing
                  </Button>
                </Link>
                <Link href="/personalise#templates">
                  <Button variant="secondary">Browse Templates</Button>
                </Link>
              </div>
            </div>
            <div className="order-1 lg:order-2 relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square bg-charcoal border border-smoke flex items-center justify-center">
                  <div className="text-center p-4">
                    <div className="w-16 h-16 mx-auto mb-2 border-2 border-ember rounded-full flex items-center justify-center">
                      <span className="font-display text-2xl text-ember">
                        ?
                      </span>
                    </div>
                    <span className="text-xs text-stone">Your Logo Here</span>
                  </div>
                </div>
                <div className="aspect-square bg-charcoal border border-smoke flex items-center justify-center">
                  <Flame className="h-16 w-16 text-ember/50" />
                </div>
                <div className="aspect-square bg-charcoal border border-smoke flex items-center justify-center">
                  <span className="font-display text-3xl text-steel-grey">
                    RSA
                  </span>
                </div>
                <div className="aspect-square bg-charcoal border border-smoke flex items-center justify-center">
                  <div className="text-center">
                    <span className="font-display text-xl text-stone">
                      SMITH
                    </span>
                    <span className="block text-xs text-ash">Family</span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 px-4 py-2 bg-ember">
                <span className="text-sm font-bold text-white-hot">
                  FROM R2,999
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-ember text-sm font-bold uppercase tracking-wider">
                Our Story
              </span>
              <h2 className="font-display text-4xl sm:text-5xl text-white-hot mt-2 mb-6">
                Steel Guts.
                <br />
                Real Fire.
              </h2>
              <div className="space-y-4 text-stone">
                <p>
                  KoosDoos was born from a simple idea: fire pits should be as
                  tough as the people who use them. We&apos;re tired of flimsy
                  imports that rust after one rainy season.
                </p>
                <p>
                  Every KoosDoos fire pit is laser-cut from premium South
                  African steel. Our flat-pack design means no tools, no
                  fuss—just unfold, slot together, and light up.
                </p>
                <p className="text-sand font-medium">
                  From Pretoria with fire. Built to outlast you.
                </p>
              </div>
              <Link href="/pages/about" className="inline-block mt-8">
                <Button variant="outline">
                  Read Our Story
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="relative aspect-square bg-charcoal border border-smoke overflow-hidden">
              <Image
                src="/images/koosdoos-logo.png"
                alt="KoosDoos Fire Pits"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                loading="lazy"
                className="object-contain p-12"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 lg:py-24 bg-soot">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-ember text-sm font-bold uppercase tracking-wider">
              What Our Customers Say
            </span>
            <h2 className="font-display text-4xl sm:text-5xl text-white-hot mt-2">
              Real Fire. Real People.
            </h2>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Testimonial Card */}
            <div className="bg-charcoal border border-smoke p-8 lg:p-12">
              <Quote className="h-10 w-10 text-ember/30 mb-6" />

              <p className="text-lg lg:text-xl text-stone leading-relaxed mb-8">
                {testimonials[testimonialIndex].text}
              </p>

              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(testimonials[testimonialIndex].rating)].map(
                      (_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-ember text-ember"
                        />
                      )
                    )}
                  </div>
                  <p className="font-display text-lg text-white-hot">
                    {testimonials[testimonialIndex].name}
                  </p>
                  <p className="text-sm text-ash">
                    {testimonials[testimonialIndex].location}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-ash uppercase tracking-wider mb-1">
                    Purchased
                  </p>
                  <p className="text-sm text-ember font-medium">
                    {testimonials[testimonialIndex].product}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={prevTestimonial}
                className="p-3 border border-smoke hover:border-ember text-stone hover:text-white-hot transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {/* Dots */}
              <div className="flex items-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setTestimonialIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === testimonialIndex
                        ? "bg-ember"
                        : "bg-steel-grey hover:bg-stone"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="p-3 border border-smoke hover:border-ember text-stone hover:text-white-hot transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Trust indicator */}
            <p className="text-center text-sm text-ash mt-8">
              Based on 500+ verified customer reviews
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-ember">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-4xl sm:text-5xl text-white-hot mb-4">
            Ready To Light It Up?
          </h2>
          <p className="text-xl text-white-hot/80 mb-8">
            Join the KoosDoos family. Free shipping on orders over R2,500.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/collections/fire-pits">
              <Button
                size="lg"
                className="bg-charcoal hover:bg-soot text-white-hot"
              >
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/personalise">
              <Button
                size="lg"
                variant="outline"
                className="border-white-hot text-white-hot hover:bg-white-hot hover:text-ember"
              >
                Personalise
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
