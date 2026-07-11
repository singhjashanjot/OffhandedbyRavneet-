"use client";

import { useState } from "react";
import { Header, Footer } from "@/components";
import { PhoneInput } from "@/components/ui";
import { motion } from "framer-motion";
import { submitEnquiryAction } from "@/lib/actions/enquiry";

/* ========================================
   CONTACT PAGE
   Contact form and information
======================================== */

const contactMethods = [
  {
    icon: "📧",
    title: "Email Us",
    description: "We'll respond within 24 hours",
    links: [
      { text: "offhandedbyravneet@gmail.com", url: "mailto:offhandedbyravneet@gmail.com" }
    ],
  },
  {
    icon: "📱",
    title: "WhatsApp & Call",
    description: "Quick responses for queries",
    links: [
      { text: "+91 9855801521", url: "https://wa.me/919855801521" },
      { text: "+91 9855642084", url: "https://wa.me/919855642084" }
    ],
  },
  {
    icon: "📍",
    title: "Location",
    description: "Based in Jalandhar",
    links: [
      { text: "Punjab, India", url: "" }
    ],
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });
  const [countryCode, setCountryCode] = useState("+91");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await submitEnquiryAction({
        name: formData.name,
        email: formData.email,
        phone: formData.phone ? `${countryCode}${formData.phone}` : "",
        subject: formData.subject,
        message: formData.message,
      });
      if (res.success) {
        setIsSubmitted(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "General Inquiry",
          message: "",
        });
      } else {
        alert(res.error || "Failed to send message. Please try again.");
      }
    } catch (error: any) {
      alert("Failed to submit enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      
      <main className="pt-24 min-h-screen text-offhanded-deep selection:bg-offhanded-forest selection:text-white overflow-x-hidden font-display relative">
        {/* Header Section */}
        <section className="py-24 bg-transparent max-w-screen-2xl mx-auto relative z-10">
          <div className="container-custom text-center">
            <span className="badge-accent mb-4 inline-block">Get in Touch</span>
            <h1 className="font-display font-light text-display-md text-neutral-900 mb-6">
              Let's Create Together
            </h1>
            <p className="text-body-lg text-neutral-600 max-w-xl mx-auto">
              Have questions about workshops, want to book a private event, or just want to say hi? 
              We'd love to hear from you.
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-24 bg-transparent max-w-screen-2xl mx-auto relative z-10">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              {/* Contact Methods */}
              <div>
                <h2 className="font-display font-light text-heading-lg text-neutral-900 mb-8">
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
                      className="flex gap-4 p-6 rounded-2xl bg-[#FFFFF5]/60 backdrop-blur-sm border border-neutral-100 hover:bg-[#FFFFF5] transition-colors"
                    >
                      <div className="text-3xl">{method.icon}</div>
                      <div>
                        <h3 className="font-display font-light text-neutral-900">{method.title}</h3>
                        <p className="text-body-sm text-neutral-500 mb-1">{method.description}</p>
                        <div className="flex flex-col gap-1">
                          {method.links.map((link) => (
                            link.url ? (
                              <a
                                key={link.text}
                                href={link.url}
                                className="text-brand-600 hover:text-brand-700 font-medium"
                              >
                                {link.text}
                              </a>
                            ) : (
                              <span key={link.text} className="text-neutral-700 font-medium">{link.text}</span>
                            )
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Private Events */}
                <div className="mt-8 p-6 rounded-2xl bg-[#2c3627] text-white">
                  <h3 className="font-display font-light text-heading-md mb-2">
                    Planning a Private Event?
                  </h3>
                  <p className="text-neutral-300 mb-4">
                    We organize corporate events, kitty parties, birthday celebrations, 
                    and baby showers. Let's make it special.
                  </p>
                  <a href="mailto:offhandedbyravneet@gmail.com" className="btn-accent">
                    Inquire Now →
                  </a>
                </div>
              </div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-full"
              >
                {isSubmitted ? (
                  <div className="bg-[#FFFFF5]/60 backdrop-blur-sm p-10 md:p-12 rounded-3xl border border-neutral-200 text-center w-full">
                    <div className="w-20 h-20 bg-[#B2C0AD]/30 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-4xl">✨</span>
                    </div>
                    <h2 className="font-display font-light text-[#2c3627] text-2xl md:text-3xl mb-4">
                      Thank You!
                    </h2>
                    <p className="text-[#2c3627]/80 text-base leading-relaxed mb-6 font-light">
                      Thanks for your enquiry! Our team will contact you asap.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="btn-primary w-full"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="font-display font-light text-heading-lg text-neutral-900 mb-8">
                      Send Us a Message
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-body-sm font-medium text-neutral-700 mb-2">
                            Your Name
                          </label>
                          <input
                            type="text"
                            placeholder="John Doe"
                            className="input"
                            value={formData.name}
                            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                            required
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
                            value={formData.email}
                            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-body-sm font-medium text-neutral-700 mb-2">
                          Phone Number <span className="text-neutral-400 font-normal">(Optional)</span>
                        </label>
                        <PhoneInput
                          value={formData.phone}
                          onChange={(value) => setFormData((prev) => ({ ...prev, phone: value }))}
                          countryCode={countryCode}
                          onCountryCodeChange={setCountryCode}
                          placeholder="98765 43210"
                          required={false}
                        />
                      </div>

                      <div>
                        <label className="block text-body-sm font-medium text-neutral-700 mb-2">
                          Subject
                        </label>
                        <select 
                          className="input"
                          value={formData.subject}
                          onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                          required
                        >
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
                          value={formData.message}
                          onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                          required
                        />
                      </div>

                      <button type="submit" className="btn-primary w-full" disabled={loading}>
                        {loading ? "Sending..." : "Send Message →"}
                      </button>
                    </form>
                  </>
                )}
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
