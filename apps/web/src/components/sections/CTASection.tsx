"use client";

import Link from "next/link";
import { motion } from "framer-motion";

/* ========================================
   CTA SECTION
   Call-to-action banner for conversions
======================================== */

interface CTASectionProps {
  className?: string;
}

export function CTASection({ className = "" }: CTASectionProps) {
  return (
    <section className={`py-12 bg-neutral-900 text-white relative overflow-hidden ${className}`}>
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-brand-600/10 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl opacity-50" />

      <div className="container-custom relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="font-display text-display-sm md:text-display-md mb-6 text-balance text-white">
            Ready to Start Your Creative Journey?
          </h2>
          
          <p className="text-body-lg text-neutral-300 mb-10 text-balance">
            Join 600+ others who've discovered the joy of mindful art. 
            Book your first workshop today and receive a special welcome gift.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/workshops" className="btn-accent btn-lg">
              Browse Workshops
            </Link>
            <Link 
              href="/contact" 
              className="btn bg-white/10 text-white border border-white/20 hover:bg-white/20 btn-lg"
            >
              Private Events →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
