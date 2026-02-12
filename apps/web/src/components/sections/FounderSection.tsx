"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

/* ========================================
   FOUNDER SECTION
   Brand story and founder introduction
======================================== */

export function FounderSection() {
  return (
    <section className="py-24 bg-[#fffff1] overflow-hidden max-w-screen-2xl mx-auto">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=80"
                alt="Ravneet - Founder of Offhanded"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            
            {/* Decorative Element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-brand-200 rounded-3xl -z-10" />
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-brand-100 rounded-full -z-10" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="badge-accent mb-4 inline-block">Our Story</span>
            
            <h2 className="font-display text-display-sm md:text-display-md text-neutral-900 mb-6">
              From Science to Soul: The Offhanded Journey
            </h2>
            
            <div className="space-y-4 text-body-lg text-neutral-600 leading-relaxed">
              <p>
                Hi, I'm <strong className="text-neutral-900">Ravneet</strong>, the founder of Offhanded. 
                My journey began at a crossroads — after years in science, I craved something deeper, 
                more meaningful, something that could touch people's lives.
              </p>
              
              <p>
                That's when Offhanded was born. What started as a personal pursuit of creative healing 
                has grown into a community of <strong className="text-neutral-900">600+ participants</strong> 
                who've discovered the joy of meditative art.
              </p>
              
              <p>
                Every workshop is designed to be a safe space — where age, skill level, and background 
                don't matter. What matters is the experience: the calm, the creativity, and the connection.
              </p>
            </div>

            <div className="mt-8">
              <Link href="/about" className="btn-primary">
                Read Our Full Story →
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
