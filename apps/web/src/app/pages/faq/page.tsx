import { Metadata } from "next";
import Link from "next/link";
import { ChevronDown, ArrowRight, HelpCircle, Package, Truck, Shield, Flame, Wrench, FileQuestion } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "FAQ - Frequently Asked Questions",
  description:
    "Find answers to common questions about KoosDoos Fire Pits - delivery, assembly, fuel types, warranty, custom designs, and more.",
};

const faqCategories = [
  {
    id: "ordering",
    title: "Ordering & Delivery",
    icon: Truck,
    faqs: [
      {
        question: "How long does delivery take?",
        answer:
          "Standard delivery takes 5-7 business days to most areas in South Africa. We ship nationwide from our Pretoria warehouse. Once your order is dispatched, you'll receive a tracking number via email.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "Currently, we only ship within South Africa. We're working on expanding to neighbouring countries - sign up for our newsletter to be notified when we do.",
      },
      {
        question: "What are the shipping costs?",
        answer:
          "Shipping is FREE on all orders over R2,500. For orders under R2,500, shipping is a flat rate of R150 anywhere in South Africa.",
      },
      {
        question: "Can I track my order?",
        answer:
          "Yes! Once your order ships, you'll receive an email with a tracking number. You can use this to track your delivery on our courier partner's website.",
      },
      {
        question: "What if my fire pit arrives damaged?",
        answer:
          "Contact us within 48 hours of delivery with photos of the damage. We'll arrange a replacement or refund at no cost to you. Our packaging is designed to protect your fire pit, but accidents can happen in transit.",
      },
    ],
  },
  {
    id: "product",
    title: "Product & Assembly",
    icon: Package,
    faqs: [
      {
        question: "How do I assemble my fire pit?",
        answer:
          "KoosDoos fire pits are designed for tool-free assembly. Simply slot the panels together - it takes about 5-10 minutes. Each fire pit includes illustrated assembly instructions, and you can also watch our assembly video on YouTube.",
      },
      {
        question: "What steel thickness are your fire pits?",
        answer:
          "Our fire pits use 3-4mm premium South African steel, depending on the size. This is significantly thicker than most imported fire pits, which is why ours last for years instead of rusting through after one season.",
      },
      {
        question: "What are the dimensions of each size?",
        answer:
          "Small: 400mm x 400mm x 400mm (seats 2-4). Medium: 500mm x 500mm x 500mm (seats 4-6). Large: 600mm x 600mm x 600mm (seats 6-8). XL: 800mm x 800mm x 600mm (seats 8-12). All measurements are approximate.",
      },
      {
        question: "Can I leave my fire pit outside?",
        answer:
          "Yes, our fire pits are designed for outdoor use. The steel will develop a natural patina over time, which many customers prefer. For best longevity, we recommend storing in a dry place when not in use or using a fire pit cover.",
      },
      {
        question: "How much does each fire pit weigh?",
        answer:
          "Small: ~15kg. Medium: ~22kg. Large: ~32kg. XL: ~45kg. The flat-pack design makes them easy to move and store, even though they're built from heavy-duty steel.",
      },
    ],
  },
  {
    id: "fire",
    title: "Fire & Usage",
    icon: Flame,
    faqs: [
      {
        question: "What fuel can I use?",
        answer:
          "Our fire pits work with wood, charcoal, or briquettes. For the best fire experience, we recommend dry hardwood like sekelbos, kameeldoring, or rooikrans. Avoid using treated or painted wood.",
      },
      {
        question: "Can I use my fire pit for cooking?",
        answer:
          "Yes! Many customers use their KoosDoos fire pits for braai. You can place a grid over the top for cooking. Our XL model is especially popular for cooking as it provides a large cooking surface.",
      },
      {
        question: "How hot does the fire pit get?",
        answer:
          "Very hot! The steel panels will get extremely hot during use. Always keep children and pets at a safe distance, and never touch the fire pit during or immediately after use. Allow it to cool completely before moving or storing.",
      },
      {
        question: "Can I use it on a wooden deck?",
        answer:
          "We recommend using a fire pit mat or placing on non-combustible surfaces. The base can radiate significant heat. If using on a deck, use a protective mat and ensure adequate clearance from railings and structures.",
      },
      {
        question: "Is there good airflow for the fire?",
        answer:
          "Absolutely. Our laser-cut designs aren't just for looks - the patterns are engineered to provide excellent airflow, resulting in a hotter, cleaner burn with less smoke.",
      },
    ],
  },
  {
    id: "custom",
    title: "Custom Designs",
    icon: Wrench,
    faqs: [
      {
        question: "Can I get a custom design?",
        answer:
          "Yes! We offer personalised fire pits with your choice of design. Choose from our template library or upload your own design. Visit our Personalise page to get started.",
      },
      {
        question: "What file formats do you accept?",
        answer:
          "We accept PNG, JPG, SVG, and DXF files. For best results, provide a high-resolution image or vector file. DXF files are ideal as they're already in the format we use for laser cutting.",
      },
      {
        question: "How long do custom orders take?",
        answer:
          "Custom orders typically take 7-10 business days to produce, plus delivery time. Complex designs may take slightly longer. We'll confirm the timeline when you place your order.",
      },
      {
        question: "Is there an extra cost for custom designs?",
        answer:
          "Our template designs are included at no extra cost. For fully custom designs using your own artwork, there may be a design fee depending on complexity. We'll provide a quote before proceeding.",
      },
      {
        question: "Can you replicate any design?",
        answer:
          "We can work with most designs, but some may need modification for laser cutting. Very fine details may not translate well. Our team will review your design and let you know if any adjustments are needed.",
      },
    ],
  },
  {
    id: "warranty",
    title: "Warranty & Returns",
    icon: Shield,
    faqs: [
      {
        question: "What warranty do you offer?",
        answer:
          "All KoosDoos fire pits come with a 2-year warranty against manufacturing defects. This covers structural issues, poor welds, and material defects. It does not cover normal wear, rust patina, or damage from misuse.",
      },
      {
        question: "Can I return my fire pit?",
        answer:
          "Yes, we offer a 30-day return policy for unused fire pits in original packaging. Custom/personalised fire pits cannot be returned unless there's a manufacturing defect. See our Returns page for full details.",
      },
      {
        question: "What if a panel is damaged?",
        answer:
          "Contact us with photos of the damage. If it's a manufacturing defect, we'll replace the panel free of charge. We keep replacement panels in stock for all our current models.",
      },
      {
        question: "Will my fire pit rust?",
        answer:
          "Over time, the steel will develop a rust patina - this is normal and many customers prefer this weathered look. It doesn't affect the structural integrity. Our 3-4mm steel is thick enough that surface rust won't cause issues for many years.",
      },
      {
        question: "How do I make a warranty claim?",
        answer:
          "Email us at support@koosdoos.co.za with your order number, photos of the issue, and a description of the problem. We'll respond within 24-48 hours with next steps.",
      },
    ],
  },
];

function FAQAccordion({ faqs }: { faqs: { question: string; answer: string }[] }) {
  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => (
        <details
          key={index}
          className="group bg-charcoal border border-smoke"
        >
          <summary className="flex items-center justify-between p-4 cursor-pointer list-none hover:bg-soot transition-colors">
            <span className="text-sand font-medium pr-4">{faq.question}</span>
            <ChevronDown className="h-5 w-5 text-ember flex-shrink-0 transition-transform group-open:rotate-180" />
          </summary>
          <div className="px-4 pb-4 pt-0">
            <p className="text-stone leading-relaxed">{faq.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-charcoal border-b border-smoke">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumbs items={[{ label: "FAQ" }]} />

          <div className="py-8 lg:py-12 max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle className="h-8 w-8 text-ember" />
              <span className="inline-block px-4 py-1 bg-ember text-white-hot text-sm font-bold uppercase tracking-wider">
                Help Centre
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl text-white-hot mb-6">
              Frequently Asked
              <br />
              <span className="text-ember">Questions</span>
            </h1>
            <p className="text-lg text-stone leading-relaxed">
              Got questions? We've got answers. Browse our FAQ sections below to find what you're
              looking for. Can't find what you need? Get in touch - we're happy to help.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="bg-soot border-b border-smoke py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {faqCategories.map((category) => (
              <a
                key={category.id}
                href={`#${category.id}`}
                className="flex items-center gap-2 px-4 py-2 bg-charcoal border border-smoke text-sand hover:border-ember hover:text-ember transition-colors"
              >
                <category.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{category.title}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {faqCategories.map((category) => (
              <div key={category.id} id={category.id} className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 bg-soot border border-smoke">
                    <category.icon className="h-5 w-5 text-ember" />
                  </div>
                  <h2 className="font-display text-2xl text-white-hot">
                    {category.title}
                  </h2>
                </div>
                <FAQAccordion faqs={category.faqs} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions Section */}
      <section className="py-16 bg-soot">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-charcoal border border-smoke p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-16 h-16 bg-ember">
                  <FileQuestion className="h-8 w-8 text-white-hot" />
                </div>
              </div>
              <div className="text-center lg:text-left flex-1">
                <h2 className="font-display text-2xl text-white-hot mb-2">
                  Still Have Questions?
                </h2>
                <p className="text-stone">
                  Can't find the answer you're looking for? Our team is here to help. Send us a
                  message and we'll get back to you within 24-48 hours.
                </p>
              </div>
              <div className="flex-shrink-0">
                <Link href="/pages/contact">
                  <Button className="bg-ember hover:bg-ember/90 text-white-hot">
                    Contact Us
                    <ArrowRight className="ml-2 h-4 w-4" />
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
            Ready To Order?
          </h2>
          <p className="text-xl text-white-hot/80 mb-8">
            Browse our range of premium steel fire pits. Free shipping on orders over R2,500.
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
            <Link href="/personalise">
              <Button
                size="lg"
                variant="outline"
                className="border-white-hot text-white-hot hover:bg-white-hot hover:text-ember"
              >
                Create Custom Design
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
