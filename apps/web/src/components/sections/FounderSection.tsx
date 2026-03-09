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
    <section className="py-32 md:py-40 bg-[#fffff1] max-w-screen-2xl mx-auto">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 order-2 lg:order-1 flex justify-center lg:justify-end"
          >
            <div className="relative group w-[400px] p-8">
              {/* Subtle border frame */}
              <div className="absolute inset-0 border border-neutral-900/20 rounded-lg group-hover:-inset-2 transition-all duration-500" />

              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg shadow-2xl">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUNQ0aukkABh2ZilMljirFERmXNuIulq0vCmwI34mwY8oAEdChk51q_GdK1iIf85Ssr1K3uuF3mX7drqN3KA6gauFrm7AMRMCShrFyYj5uZ5GAsdUJj9tmBqtK9xDc4p37kqRKevDfzJtVZ43K0belrzFEppcYsawOvFNlcyIcDp1bJ29sAZ-TEB1gYR2NpLFCgxfCLDqn-eQC7BnmEcasB-meseN8B0oQg-grQLQ-NdaahytTc3OuoWaAZjDZX4QUQ5o8mu4iadFK"
                  alt="Portrait of Ravneet in a creative studio"
                  fill
                  sizes="400px"
                  className="object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                />
              </div>

              {/* Artistic caption */}
              <div className="mt-4 flex items-center gap-3">
                <div className="h-px w-8 bg-neutral-900/50" />
                <span className="text-xs uppercase tracking-[0.2em] text-neutral-700">
                  Ravneet, Founder
                </span>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 order-1 lg:order-2"
          >
            <span className="badge-accent mb-6 inline-block">Our Story</span>
            
            <h2 className="font-display font-light text-display-sm md:text-display-md text-neutral-900 mb-8">
              From Science to Soul: The Offhanded Journey
            </h2>
            
            <div className="space-y-6 text-body-lg text-neutral-600 leading-relaxed">
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

            <div className="mt-10">
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
