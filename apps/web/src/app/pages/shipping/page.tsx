import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Truck, MapPin, Clock, Package, CheckCircle, AlertCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "Shipping Information",
  description:
    "Free shipping on orders over R2,500. Learn about KoosDoos Fire Pits delivery times, shipping costs, and coverage areas across South Africa.",
};

const shippingZones = [
  {
    zone: "Gauteng",
    cities: "Johannesburg, Pretoria, Centurion, Midrand, Sandton",
    delivery: "2-3 business days",
    cost: "R150",
  },
  {
    zone: "Western Cape",
    cities: "Cape Town, Stellenbosch, Paarl, Somerset West",
    delivery: "3-5 business days",
    cost: "R150",
  },
  {
    zone: "KwaZulu-Natal",
    cities: "Durban, Pietermaritzburg, Ballito, Umhlanga",
    delivery: "3-5 business days",
    cost: "R150",
  },
  {
    zone: "Eastern Cape",
    cities: "Port Elizabeth, East London, Gqeberha",
    delivery: "4-6 business days",
    cost: "R150",
  },
  {
    zone: "Other Provinces",
    cities: "Free State, Mpumalanga, Limpopo, North West, Northern Cape",
    delivery: "5-7 business days",
    cost: "R150",
  },
];

const shippingFeatures = [
  {
    icon: Truck,
    title: "Free Shipping Over R2,500",
    description: "Orders over R2,500 qualify for free delivery anywhere in South Africa.",
  },
  {
    icon: Package,
    title: "Flat-Pack Delivery",
    description: "All fire pits ship flat-packed for safe transport and easy handling.",
  },
  {
    icon: Clock,
    title: "Same-Day Dispatch",
    description: "Orders placed before 12pm are dispatched the same business day.",
  },
  {
    icon: MapPin,
    title: "Door-to-Door",
    description: "We deliver directly to your doorstep with tracking updates.",
  },
];

export default function ShippingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-charcoal border-b border-smoke">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumbs items={[{ label: "Shipping" }]} />

          <div className="py-8 lg:py-16 max-w-3xl">
            <span className="inline-block px-4 py-1 bg-ember text-white-hot text-sm font-bold uppercase tracking-wider mb-6">
              Delivery Info
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white-hot mb-6 leading-tight">
              Shipping
              <br />
              <span className="text-ember">Information</span>
            </h1>
            <p className="text-lg text-stone leading-relaxed">
              We ship nationwide across South Africa. Free delivery on orders over R2,500,
              or flat-rate R150 shipping for smaller orders.
            </p>
          </div>
        </div>
      </section>

      {/* Shipping Features */}
      <section className="py-16 lg:py-24 bg-soot">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {shippingFeatures.map((feature) => (
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

      {/* Shipping Rates Table */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-ember text-sm font-bold uppercase tracking-wider">
              Delivery Zones
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-white-hot mt-2 mb-4">
              Shipping Rates & Times
            </h2>
            <p className="text-stone max-w-2xl mx-auto">
              All orders ship from our warehouse in Pretoria. Delivery times are estimates
              and may vary during peak periods.
            </p>
          </div>

          {/* Free Shipping Banner */}
          <div className="bg-ember/10 border border-ember p-6 mb-8 flex items-center gap-4">
            <CheckCircle className="h-8 w-8 text-ember flex-shrink-0" />
            <div>
              <h3 className="font-display text-lg text-white-hot">
                Free Shipping on Orders Over R2,500
              </h3>
              <p className="text-stone text-sm">
                Your order qualifies for free delivery anywhere in South Africa.
              </p>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-hidden border border-smoke">
            <table className="w-full">
              <thead className="bg-soot">
                <tr>
                  <th className="text-left p-4 font-display text-white-hot">Region</th>
                  <th className="text-left p-4 font-display text-white-hot">Major Cities</th>
                  <th className="text-left p-4 font-display text-white-hot">Delivery Time</th>
                  <th className="text-left p-4 font-display text-white-hot">Shipping Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-smoke">
                {shippingZones.map((zone) => (
                  <tr key={zone.zone} className="bg-charcoal hover:bg-soot transition-colors">
                    <td className="p-4">
                      <span className="font-display text-white-hot">{zone.zone}</span>
                    </td>
                    <td className="p-4 text-stone text-sm">{zone.cities}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-2 text-sand">
                        <Clock className="h-4 w-4" />
                        {zone.delivery}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-ember font-bold">{zone.cost}</span>
                      <span className="text-stone text-sm ml-2">or FREE over R2,500</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {shippingZones.map((zone) => (
              <div key={zone.zone} className="bg-charcoal border border-smoke p-4">
                <h3 className="font-display text-lg text-white-hot mb-2">{zone.zone}</h3>
                <p className="text-stone text-sm mb-3">{zone.cities}</p>
                <div className="flex justify-between items-center">
                  <span className="inline-flex items-center gap-2 text-sand text-sm">
                    <Clock className="h-4 w-4" />
                    {zone.delivery}
                  </span>
                  <span className="text-ember font-bold">{zone.cost}</span>
                </div>
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
              Order Process
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-white-hot mt-2">
              How Shipping Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="relative">
              <div className="bg-charcoal border border-smoke p-6 text-center h-full">
                <span className="inline-flex items-center justify-center w-10 h-10 bg-ember text-white-hot font-display text-lg mb-4">
                  1
                </span>
                <h3 className="font-display text-lg text-white-hot mb-2">Order Placed</h3>
                <p className="text-sm text-stone">
                  Complete your order online. You&apos;ll receive an order confirmation email immediately.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-ember" />
            </div>

            <div className="relative">
              <div className="bg-charcoal border border-smoke p-6 text-center h-full">
                <span className="inline-flex items-center justify-center w-10 h-10 bg-ember text-white-hot font-display text-lg mb-4">
                  2
                </span>
                <h3 className="font-display text-lg text-white-hot mb-2">Dispatched</h3>
                <p className="text-sm text-stone">
                  Orders before 12pm ship same day. You&apos;ll get a tracking number via email.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-ember" />
            </div>

            <div className="relative">
              <div className="bg-charcoal border border-smoke p-6 text-center h-full">
                <span className="inline-flex items-center justify-center w-10 h-10 bg-ember text-white-hot font-display text-lg mb-4">
                  3
                </span>
                <h3 className="font-display text-lg text-white-hot mb-2">In Transit</h3>
                <p className="text-sm text-stone">
                  Track your order in real-time. Our courier will contact you before delivery.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-ember" />
            </div>

            <div className="bg-charcoal border border-smoke p-6 text-center h-full">
              <span className="inline-flex items-center justify-center w-10 h-10 bg-ember text-white-hot font-display text-lg mb-4">
                4
              </span>
              <h3 className="font-display text-lg text-white-hot mb-2">Delivered</h3>
              <p className="text-sm text-stone">
                Your fire pit arrives flat-packed. Assembly takes just 5 minutes with no tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Important Information */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Delivery Tips */}
            <div className="bg-soot border border-smoke p-8">
              <h3 className="font-display text-xl text-white-hot mb-6 flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-ember" />
                Delivery Tips
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-ember mt-2 flex-shrink-0" />
                  <span className="text-stone">
                    Ensure someone is available to receive the delivery. The courier will attempt contact before arrival.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-ember mt-2 flex-shrink-0" />
                  <span className="text-stone">
                    Check your package for any visible damage before signing. Report issues immediately.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-ember mt-2 flex-shrink-0" />
                  <span className="text-stone">
                    Keep your tracking number handy. You can track progress on the courier&apos;s website.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-ember mt-2 flex-shrink-0" />
                  <span className="text-stone">
                    Fire pits are heavy! The courier delivers to your door but won&apos;t carry items inside.
                  </span>
                </li>
              </ul>
            </div>

            {/* Important Notes */}
            <div className="bg-soot border border-smoke p-8">
              <h3 className="font-display text-xl text-white-hot mb-6 flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-ember" />
                Important Notes
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-ember mt-2 flex-shrink-0" />
                  <span className="text-stone">
                    <strong className="text-sand">Remote areas:</strong> Delivery to farms, estates, or remote locations may take longer and incur additional charges.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-ember mt-2 flex-shrink-0" />
                  <span className="text-stone">
                    <strong className="text-sand">Peak periods:</strong> During November-January, delivery times may be extended by 1-2 business days.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-ember mt-2 flex-shrink-0" />
                  <span className="text-stone">
                    <strong className="text-sand">Custom orders:</strong> Personalised fire pits have an additional 3-5 day production time before shipping.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-ember mt-2 flex-shrink-0" />
                  <span className="text-stone">
                    <strong className="text-sand">International:</strong> We currently ship to South Africa only. Contact us for export enquiries.
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
            Questions About Shipping?
          </h2>
          <p className="text-xl text-white-hot/80 mb-8">
            Our team is here to help. Get in touch and we&apos;ll sort you out.
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
