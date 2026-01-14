import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail, Phone, MapPin, Clock, Send, MessageSquare, HelpCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with KoosDoos Fire Pits. We're here to help with orders, custom designs, warranty claims, and any questions about our fire pits.",
};

const contactMethods = [
  {
    icon: Mail,
    title: "Email Us",
    description: "For general enquiries and support",
    contact: "hello@koosdoos.co.za",
    action: "mailto:hello@koosdoos.co.za",
  },
  {
    icon: Phone,
    title: "Call Us",
    description: "Mon-Fri, 8am-5pm SAST",
    contact: "012 345 6789",
    action: "tel:+27123456789",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    description: "By appointment only",
    contact: "Pretoria, Gauteng",
    action: null,
  },
];

const supportTopics = [
  {
    icon: MessageSquare,
    title: "Sales Enquiries",
    description: "Questions about our fire pits, pricing, bulk orders, or custom designs.",
    email: "sales@koosdoos.co.za",
  },
  {
    icon: HelpCircle,
    title: "Customer Support",
    description: "Order tracking, delivery issues, product questions, or general help.",
    email: "support@koosdoos.co.za",
  },
  {
    icon: Clock,
    title: "Warranty Claims",
    description: "Submit warranty claims or get help with defective products.",
    email: "warranty@koosdoos.co.za",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-charcoal border-b border-smoke">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumbs items={[{ label: "Contact" }]} />

          <div className="py-8 lg:py-16 max-w-3xl">
            <span className="inline-block px-4 py-1 bg-ember text-white-hot text-sm font-bold uppercase tracking-wider mb-6">
              Get In Touch
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white-hot mb-6 leading-tight">
              We&apos;re Here
              <br />
              <span className="text-ember">To Help</span>
            </h1>
            <p className="text-lg text-stone leading-relaxed">
              Have a question about our fire pits? Want to discuss a custom design? Need help with
              an order? Our team is ready to assist you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 lg:py-24 bg-soot">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {contactMethods.map((method) => (
              <div
                key={method.title}
                className="bg-charcoal border border-smoke p-8 text-center hover:border-ember transition-colors"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-soot border border-smoke mb-6">
                  <method.icon className="h-7 w-7 text-ember" />
                </div>
                <h3 className="font-display text-xl text-white-hot mb-2">
                  {method.title}
                </h3>
                <p className="text-sm text-stone mb-4">{method.description}</p>
                {method.action ? (
                  <a
                    href={method.action}
                    className="text-ember hover:text-white-hot font-medium transition-colors"
                  >
                    {method.contact}
                  </a>
                ) : (
                  <span className="text-sand font-medium">{method.contact}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <span className="text-ember text-sm font-bold uppercase tracking-wider">
                Send a Message
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-white-hot mt-2 mb-4">
                Contact Form
              </h2>
              <p className="text-stone mb-8">
                Fill out the form below and we&apos;ll get back to you within 24 hours.
              </p>

              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-sand mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full bg-soot border border-smoke text-white-hot px-4 py-3 focus:outline-none focus:border-ember transition-colors"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-sand mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full bg-soot border border-smoke text-white-hot px-4 py-3 focus:outline-none focus:border-ember transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-sand mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full bg-soot border border-smoke text-white-hot px-4 py-3 focus:outline-none focus:border-ember transition-colors"
                      placeholder="012 345 6789"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-sand mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      className="w-full bg-soot border border-smoke text-white-hot px-4 py-3 focus:outline-none focus:border-ember transition-colors"
                    >
                      <option value="">Select a topic</option>
                      <option value="sales">Sales Enquiry</option>
                      <option value="order">Order Question</option>
                      <option value="custom">Custom Design</option>
                      <option value="warranty">Warranty Claim</option>
                      <option value="support">General Support</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="order-number" className="block text-sm font-medium text-sand mb-2">
                    Order Number (if applicable)
                  </label>
                  <input
                    type="text"
                    id="order-number"
                    name="order-number"
                    className="w-full bg-soot border border-smoke text-white-hot px-4 py-3 focus:outline-none focus:border-ember transition-colors"
                    placeholder="KD-123456"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-sand mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    className="w-full bg-soot border border-smoke text-white-hot px-4 py-3 focus:outline-none focus:border-ember transition-colors resize-none"
                    placeholder="Tell us how we can help..."
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="bg-ember hover:bg-ember/90 text-white-hot w-full sm:w-auto"
                >
                  Send Message
                  <Send className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </div>

            {/* Support Topics */}
            <div>
              <span className="text-ember text-sm font-bold uppercase tracking-wider">
                Direct Contact
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-white-hot mt-2 mb-4">
                Contact the Right Team
              </h2>
              <p className="text-stone mb-8">
                For faster assistance, email the team that handles your type of enquiry directly.
              </p>

              <div className="space-y-6">
                {supportTopics.map((topic) => (
                  <div
                    key={topic.title}
                    className="bg-soot border border-smoke p-6 hover:border-ember transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="inline-flex items-center justify-center w-10 h-10 bg-charcoal border border-smoke flex-shrink-0">
                        <topic.icon className="h-5 w-5 text-ember" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg text-white-hot mb-1">
                          {topic.title}
                        </h3>
                        <p className="text-sm text-stone mb-3">{topic.description}</p>
                        <a
                          href={`mailto:${topic.email}`}
                          className="text-ember hover:text-white-hot text-sm font-medium transition-colors"
                        >
                          {topic.email}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Business Hours */}
              <div className="mt-8 bg-charcoal border border-smoke p-6">
                <h3 className="font-display text-lg text-white-hot mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-ember" />
                  Business Hours
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-stone">Monday - Friday</span>
                    <span className="text-sand">08:00 - 17:00</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-stone">Saturday</span>
                    <span className="text-sand">09:00 - 13:00</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-stone">Sunday & Public Holidays</span>
                    <span className="text-sand">Closed</span>
                  </li>
                </ul>
                <p className="text-xs text-stone mt-4">
                  All times are South African Standard Time (SAST/UTC+2)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Response Time Section */}
      <section className="py-16 lg:py-24 bg-soot">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-charcoal border border-ember p-8 lg:p-12">
            <div className="text-center">
              <span className="inline-block px-4 py-1 bg-ember/20 border border-ember text-ember text-sm font-bold uppercase tracking-wider mb-6">
                Our Promise
              </span>
              <h2 className="font-display text-2xl sm:text-3xl text-white-hot mb-4">
                Response Times
              </h2>
              <p className="text-stone mb-6 max-w-2xl mx-auto">
                We pride ourselves on responsive customer service. Here&apos;s what you can expect:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
                <div>
                  <span className="font-display text-3xl text-ember">24hrs</span>
                  <p className="text-sm text-stone mt-2">Email response time</p>
                </div>
                <div>
                  <span className="font-display text-3xl text-ember">Same Day</span>
                  <p className="text-sm text-stone mt-2">Phone call backs</p>
                </div>
                <div>
                  <span className="font-display text-3xl text-ember">48hrs</span>
                  <p className="text-sm text-stone mt-2">Warranty claim processing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Link Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-ember text-sm font-bold uppercase tracking-wider">
              Quick Answers
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-white-hot mt-2 mb-4">
              Check Our FAQ First
            </h2>
            <p className="text-stone max-w-2xl mx-auto">
              Many common questions are answered in our FAQ section. You might find what you&apos;re
              looking for without waiting for a response.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/pages/faq#ordering-delivery"
              className="bg-soot border border-smoke p-6 text-center hover:border-ember transition-colors group"
            >
              <h3 className="font-display text-lg text-white-hot mb-2 group-hover:text-ember transition-colors">
                Ordering & Delivery
              </h3>
              <p className="text-sm text-stone">
                Shipping times, costs, and tracking your order
              </p>
            </Link>
            <Link
              href="/pages/faq#product-assembly"
              className="bg-soot border border-smoke p-6 text-center hover:border-ember transition-colors group"
            >
              <h3 className="font-display text-lg text-white-hot mb-2 group-hover:text-ember transition-colors">
                Product & Assembly
              </h3>
              <p className="text-sm text-stone">
                Dimensions, materials, and setup instructions
              </p>
            </Link>
            <Link
              href="/pages/faq#custom-designs"
              className="bg-soot border border-smoke p-6 text-center hover:border-ember transition-colors group"
            >
              <h3 className="font-display text-lg text-white-hot mb-2 group-hover:text-ember transition-colors">
                Custom Designs
              </h3>
              <p className="text-sm text-stone">
                File formats, pricing, and design process
              </p>
            </Link>
            <Link
              href="/pages/faq#warranty-returns"
              className="bg-soot border border-smoke p-6 text-center hover:border-ember transition-colors group"
            >
              <h3 className="font-display text-lg text-white-hot mb-2 group-hover:text-ember transition-colors">
                Warranty & Returns
              </h3>
              <p className="text-sm text-stone">
                Coverage, claims, and return policy
              </p>
            </Link>
          </div>

          <div className="text-center mt-8">
            <Link href="/pages/faq">
              <Button variant="outline" className="border-smoke hover:border-ember">
                View All FAQs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-ember">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-4xl sm:text-5xl text-white-hot mb-4">
            Ready to Get Your Fire Pit?
          </h2>
          <p className="text-xl text-white-hot/80 mb-8">
            Browse our collection and find the perfect fire pit for your space.
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
