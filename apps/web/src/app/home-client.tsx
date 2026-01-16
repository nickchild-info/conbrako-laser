"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Truck,
  Shield,
  Flame,
  Package,
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
    icon: Package,
    title: "Flat-Pack Design",
    description: "Assemble in under 5 minutes, no tools",
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
    text: "Best braai accessory I've ever bought. The Medium KoosDoos is perfect for our family gatherings. Assembled it in 3 minutes flat and the heat output is incredible.",
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
    text: "Bought the XL for our rugby club. It's a beast. We've had it going for 6 hours straight on game days and it just keeps delivering. Tough as nails.",
    product: "KoosDoos XL",
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
    <div className="min-h-screen">
      {/* Hero Section - Dramatic full-viewport */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
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
          {/* Dramatic gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-charcoal/50" />
          {/* Fire glow at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-ember/20 to-transparent" />
        </div>

        {/* Noise texture */}
        <div className="absolute inset-0 noise-overlay pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-ember/20 border border-ember/50 text-ember text-sm font-bold uppercase tracking-wider mb-8 slide-up">
              <Flame className="h-4 w-4" />
              South African Made
            </div>

            {/* Main headline */}
            <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl text-white-hot mb-6 slide-up slide-up-delay-1 leading-none">
              Built Tough.
              <br />
              <span className="text-fire-gradient">Burns Harder.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl sm:text-2xl text-stone max-w-xl mb-10 slide-up slide-up-delay-2">
              Laser-cut steel fire pits. Flat-pack design. Rugged construction.
              <span className="block mt-2 text-sand font-medium">
                Not for sissies.
              </span>
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 slide-up slide-up-delay-3">
              <Link href="/collections/fire-pits">
                <Button size="lg" className="w-full sm:w-auto">
                  Shop Fire Pits
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/personalise">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <Flame className="mr-2 h-5 w-5" />
                  Personalise Yours
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-smoke/50 slide-up slide-up-delay-4">
              <div className="flex items-center gap-2 text-stone">
                <Truck className="h-5 w-5 text-ember" />
                <span className="text-sm">Free shipping over R2,500</span>
              </div>
              <div className="flex items-center gap-2 text-stone">
                <Shield className="h-5 w-5 text-ember" />
                <span className="text-sm">2 Year warranty</span>
              </div>
              <div className="flex items-center gap-2 text-stone">
                <Package className="h-5 w-5 text-ember" />
                <span className="text-sm">5 min assembly</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-stone animate-bounce">
          <span className="text-xs uppercase tracking-wider">Scroll</span>
          <ChevronRight className="h-4 w-4 rotate-90" />
        </div>
      </section>

      {/* Features Bar - Industrial style */}
      <section className="bg-soot border-y-2 border-smoke relative">
        <div className="absolute top-0 left-0 right-0 h-1 fire-gradient" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="py-10 px-6 text-center border-r border-smoke last:border-r-0 group hover:bg-charcoal/50 transition-colors"
              >
                <div className="w-14 h-14 mx-auto mb-4 bg-ember/10 border border-ember/30 flex items-center justify-center group-hover:bg-ember group-hover:border-ember transition-all">
                  <feature.icon className="h-7 w-7 text-ember group-hover:text-white-hot transition-colors" />
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

      {/* Featured Products */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <div>
              <span className="text-ember text-sm font-bold uppercase tracking-wider mb-3 block">
                Choose Your Size
              </span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white-hot">
                Fire Pits
              </h2>
            </div>
            <Link
              href="/collections/fire-pits"
              className="group inline-flex items-center gap-2 text-stone hover:text-ember transition-colors font-bold uppercase tracking-wider text-sm"
            >
              View All Products
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Products grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 stagger-children">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addItem}
              />
            ))}
          </div>

          <div className="mt-10 text-center lg:hidden">
            <Link href="/collections/fire-pits">
              <Button variant="secondary">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Personalise Section - Bold asymmetric */}
      <section className="py-20 lg:py-28 bg-soot relative overflow-hidden">
        {/* Diagonal accent */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-ember/5 transform skew-x-12 translate-x-1/4" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <span className="inline-flex items-center gap-2 text-ember text-sm font-bold uppercase tracking-wider mb-6">
                <Flame className="h-4 w-4" />
                Make It Yours
              </span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white-hot mb-6">
                Personalised
                <br />
                <span className="text-fire-gradient">Fire Pits</span>
              </h2>
              <div className="space-y-4 text-stone text-lg leading-relaxed">
                <p>
                  Create a one-of-a-kind fire pit with your own custom design.
                  Upload your logo, family crest, or choose from our library of
                  South African-inspired templates.
                </p>
                <p>
                  Perfect for businesses, sports clubs, game lodges, or as a
                  truly unique gift.
                </p>
                <p className="text-sand font-medium">
                  Your design. Your fire pit. Your story.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-10">
                <Link href="/personalise">
                  <Button size="lg">
                    Start Designing
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/personalise#templates">
                  <Button variant="secondary" size="lg">
                    Browse Templates
                  </Button>
                </Link>
              </div>
            </div>
            <div className="order-1 lg:order-2 relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square bg-charcoal border-2 border-smoke hover:border-ember transition-colors flex items-center justify-center group">
                  <div className="text-center p-4">
                    <div className="w-20 h-20 mx-auto mb-3 border-2 border-ember/50 group-hover:border-ember flex items-center justify-center transition-colors">
                      <span className="font-display text-3xl text-ember">?</span>
                    </div>
                    <span className="text-sm text-stone">Your Logo Here</span>
                  </div>
                </div>
                <div className="aspect-square bg-charcoal border-2 border-smoke hover:border-ember transition-colors flex items-center justify-center">
                  <Flame className="h-20 w-20 text-ember/40 flame-flicker" />
                </div>
                <div className="aspect-square bg-charcoal border-2 border-smoke hover:border-ember transition-colors flex items-center justify-center">
                  <span className="font-display text-4xl text-steel-grey">RSA</span>
                </div>
                <div className="aspect-square bg-charcoal border-2 border-smoke hover:border-ember transition-colors flex items-center justify-center">
                  <div className="text-center">
                    <span className="font-display text-2xl text-stone">SMITH</span>
                    <span className="block text-xs text-ash mt-1">Family</span>
                  </div>
                </div>
              </div>
              {/* Price tag */}
              <div className="absolute -bottom-4 -right-4 px-6 py-3 bg-ember fire-glow-subtle">
                <span className="text-sm font-bold text-white-hot">FROM R2,999</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-ember text-sm font-bold uppercase tracking-wider mb-3 block">
                Our Story
              </span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white-hot mb-6">
                Steel Guts.
                <br />
                <span className="text-fire-gradient">Real Fire.</span>
              </h2>
              <div className="space-y-4 text-stone text-lg leading-relaxed">
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
              <Link href="/pages/about" className="inline-block mt-10">
                <Button variant="outline" size="lg">
                  Read Our Story
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-square bg-charcoal border-2 border-smoke overflow-hidden">
                <Image
                  src="/images/koosdoos-logo.png"
                  alt="KoosDoos Fire Pits"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  loading="lazy"
                  className="object-contain p-16"
                />
              </div>
              {/* Corner accent */}
              <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[60px] border-l-transparent border-b-[60px] border-b-ember" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 lg:py-28 bg-soot">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-ember text-sm font-bold uppercase tracking-wider mb-3 block">
              What Customers Say
            </span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white-hot mb-4">
              Real Fire. Real People.
            </h2>
            <div className="flex items-center justify-center gap-2 text-ember">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-current" />
              ))}
              <span className="ml-2 text-white-hot font-bold">4.9/5</span>
              <span className="text-stone">from 500+ reviews</span>
            </div>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Testimonial Card */}
            <div className="bg-charcoal border-2 border-smoke p-10 lg:p-14">
              <Quote className="h-12 w-12 text-ember/30 mb-8" />

              <p className="text-xl lg:text-2xl text-white-hot leading-relaxed mb-10">
                &ldquo;{testimonials[testimonialIndex].text}&rdquo;
              </p>

              <div className="flex items-center justify-between flex-wrap gap-6">
                <div>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(testimonials[testimonialIndex].rating)].map(
                      (_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 fill-ember text-ember"
                        />
                      )
                    )}
                  </div>
                  <p className="font-display text-xl text-white-hot">
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
                  <p className="text-ember font-bold">
                    {testimonials[testimonialIndex].product}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-6 mt-10">
              <button
                onClick={prevTestimonial}
                className="p-3 border-2 border-smoke hover:border-ember hover:bg-ember text-stone hover:text-white-hot transition-all"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {/* Dots */}
              <div className="flex items-center gap-3">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setTestimonialIndex(index)}
                    className={`w-3 h-3 transition-all ${
                      index === testimonialIndex
                        ? "bg-ember scale-110"
                        : "bg-steel-grey hover:bg-stone"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="p-3 border-2 border-smoke hover:border-ember hover:bg-ember text-stone hover:text-white-hot transition-all"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Trust indicator */}
            <p className="text-center text-sm text-ash mt-10">
              Based on 500+ verified customer reviews
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 fire-gradient" />
        <div className="absolute inset-0 bg-gradient-to-b from-ember/80 to-flame/80" />

        {/* Noise texture */}
        <div className="absolute inset-0 noise-overlay pointer-events-none opacity-50" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Flame className="h-16 w-16 text-white-hot mx-auto mb-8 flame-flicker" />
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white-hot mb-6">
            Ready To Light It Up?
          </h2>
          <p className="text-xl text-white-hot/90 mb-10 max-w-2xl mx-auto">
            Join the KoosDoos family. Free shipping on orders over R2,500.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/collections/fire-pits">
              <Button
                size="lg"
                className="bg-charcoal hover:bg-soot text-white-hot border-0"
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
