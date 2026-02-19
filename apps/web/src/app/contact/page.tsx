"use client";

import { Header, Footer } from "@/components";
import { motion } from "framer-motion";

/* ========================================
   CONTACT PAGE
   Contact form and information
======================================== */

const contactMethods = [
  {
    icon: "📧",
    title: "Email Us",
    description: "We'll respond within 24 hours",
    value: "hello@offhanded.in",
    href: "mailto:hello@offhanded.in",
  },
  {
    icon: "📱",
    title: "WhatsApp",
    description: "Quick responses for urgent queries",
    value: "+91 98765 43210",
    href: "https://wa.me/919876543210",
  },
  {
    icon: "📍",
    title: "Location",
    description: "Workshops across Delhi NCR",
    value: "Delhi, Gurugram, Noida",
    href: null,
  },
];

export default function ContactPage() {
  return (
    <>
      <Header />
      
      <main className="pt-24">
        {/* Header Section */}
        <section className="py-24 bg-brand-50 max-w-screen-2xl mx-auto">
          <div className="container-custom text-center">
            <span className="badge-accent mb-4 inline-block">Get in Touch</span>
            <h1 className="font-display text-display-md text-neutral-900 mb-6">
              Let's Create Together
            </h1>
            <p className="text-body-lg text-neutral-600 max-w-xl mx-auto">
              Have questions about workshops, want to book a private event, or just want to say hi? 
              We'd love to hear from you.
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-24 bg-white max-w-screen-2xl mx-auto">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              {/* Contact Methods */}
              <div>
                <h2 className="font-display text-heading-lg text-neutral-900 mb-8">
                  Ways to Reach Us
                </h2>

                <div className="space-y-6">
                  {contactMethods.map((method, index) => (
                    <motion.div
                      key={method.title}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4 p-6 rounded-2xl bg-neutral-50 hover:bg-brand-50 transition-colors"
                    >
                      <div className="text-3xl">{method.icon}</div>
                      <div>
                        <h3 className="font-semibold text-neutral-900">{method.title}</h3>
                        <p className="text-body-sm text-neutral-500 mb-1">{method.description}</p>
                        {method.href ? (
                          <a
                            href={method.href}
                            className="text-brand-600 hover:text-brand-700 font-medium"
                          >
                            {method.value}
                          </a>
                        ) : (
                          <span className="text-neutral-700">{method.value}</span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Private Events */}
                <div className="mt-8 p-6 rounded-2xl bg-neutral-900 text-white">
                  <h3 className="font-display text-heading-md mb-2">
                    Planning a Private Event?
                  </h3>
                  <p className="text-neutral-300 mb-4">
                    We organize corporate events, kitty parties, birthday celebrations, 
                    and baby showers. Let's make it special.
                  </p>
                  <a href="mailto:events@offhanded.in" className="btn-accent">
                    Inquire Now →
                  </a>
                </div>
              </div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-heading-lg text-neutral-900 mb-8">
                  Send Us a Message
                </h2>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-body-sm font-medium text-neutral-700 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-body-sm font-medium text-neutral-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        className="input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-body-sm font-medium text-neutral-700 mb-2">
                      Subject
                    </label>
                    <select className="input">
                      <option>General Inquiry</option>
                      <option>Workshop Question</option>
                      <option>Private Event Booking</option>
                      <option>Corporate Event</option>
                      <option>Partnership</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-body-sm font-medium text-neutral-700 mb-2">
                      Message
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Tell us how we can help..."
                      className="input resize-none"
                    />
                  </div>

                  <button type="submit" className="btn-primary w-full">
                    Send Message →
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
