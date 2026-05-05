import { Header, Footer } from "@/components";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

/* ========================================
   ABOUT PAGE
   Brand story and team introduction
======================================== */

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Offhanded's mission, our founder Ravneet's story, and why we're passionate about bringing art to everyone.",
};

const stats = [
  { number: "600", label: "Participants Joined" },
  { number: "50", label: "Workshops Hosted" },
  { number: "15", label: "Art Disciplines" },
  { number: "1", label: "Year of Magic" },
];

export default function AboutPage() {
  return (
    <>
      <Header />

      <main className="flex-1 flex flex-col items-center pt-24">
        {/* Hero Section */}
        <section className="max-w-5xl w-full px-6 py-20 lg:py-32 flex flex-col items-center text-center">
          <span className="uppercase tracking-[0.3em] text-xs font-bold text-brand-300 mb-6">
            Est. 2023
          </span>
          <h1 className="font-display font-light text-5xl md:text-7xl leading-tight max-w-3xl text-[#2D3E30]">
           Where creativity meets calmness, and every creation tells a story.
          </h1>
        </section>

        {/* Core Pillars Section */}
        <section className="max-w-7xl w-full px-6 py-24 lg:py-32">
          <div className="flex flex-col gap-32">
            {/* Who We Are */}
            <div className="flex flex-col md:flex-row items-start gap-8 md:gap-24">
              <div className="w-full md:w-1/3 pt-2">
                <span className="text-brand-300 text-sm font-bold uppercase tracking-widest mb-4 block">
                  01 — Who We Are
                </span>
                <h3 className="font-display text-4xl md:text-5xl font-light leading-tight tracking-tight text-[#2D3E30]">
                  A collective of visionaries.
                </h3>
              </div>
              <div className="w-full md:w-1/2 md:ml-auto">
                <p className="font-sans text-[#2D3E30]/80 text-xl md:text-2xl font-light leading-relaxed">
                  We are a collective of creators, dreamers, and art enthusiasts who believe creativity isn’t a skill reserved for a few -it’s a vibe everyone carries within.
From beginners picking up a brush for the first time to experienced artists refining their flow, we welcome all.

                </p>
              </div>
            </div>

            {/* What We Do */}
            <div className="flex flex-col md:flex-row-reverse items-start gap-8 md:gap-24">
              <div className="w-full md:w-1/3 pt-2">
                <span className="text-brand-300 text-sm font-bold uppercase tracking-widest mb-4 block text-left md:text-right">
                  02 — What We Do
                </span>
                <h3 className="font-display text-4xl md:text-5xl font-light leading-tight tracking-tight text-[#2D3E30] text-left md:text-right">
                  Curating experience.
                </h3>
              </div>
              <div className="w-full md:w-1/2 md:mr-auto">
                <div className="font-sans text-[#2D3E30]/80 text-xl md:text-2xl font-light leading-relaxed text-left space-y-6">
                  <p>
                    We design and host premium art workshops that go beyond the
                    usual &quot;learn and leave&quot; format.
                  </p>

                  <div className="space-y-4">
                    <p>Think:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Hands-on, immersive sessions</li>
                      <li>Curated themes inspired by global art movements</li>
                      <li>High-quality, internationally sourced materials</li>
                      <li>Guided mentorship with a chill, no-pressure environment</li>
                    </ul>
                  </div>

                  <p>
                    Whether it&apos;s pottery, painting, texture art, or
                    experimental forms — we focus on the process as much as the
                    final piece. Because honestly, the magic is in the making.
                  </p>
                </div>
              </div>
            </div>

            {/* Philosophy */}
            <div className="flex flex-col md:flex-row items-start gap-8 md:gap-24">
              <div className="w-full md:w-1/3 pt-2">
                <span className="text-brand-300 text-sm font-bold uppercase tracking-widest mb-4 block">
                  03 — Philosophy
                </span>
                <h3 className="font-display text-4xl md:text-5xl font-light leading-tight tracking-tight text-[#2D3E30]">
                  The process is art.
                </h3>
              </div>
              <div className="w-full md:w-1/2 md:ml-auto">
                <div className="font-sans text-[#2D3E30]/80 text-xl md:text-2xl font-light leading-relaxed text-right space-y-6">
                  <p>We&apos;re here to:</p>
                  <ul className="list-disc space-y-2 pl-6 text-left md:pl-0 md:list-none">
                    <li className="md:text-right">Break the fear of &quot;not being good enough&quot;</li>
                    <li className="md:text-right">Turn creative curiosity into confidence</li>
                    <li className="md:text-right">Build a community where art feels accessible, not intimidating</li>
                  </ul>
                  <p>
                    In a fast-paced world, we offer a pause — a space where you
                    can unplug, get your hands messy, and reconnect with your
                    creative side.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Milestone Grid */}
        <section className="w-full py-32 border-y border-[#2D3E30]/10 mb-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-16">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`flex flex-col items-center text-center px-4 ${
                    index < stats.length - 1 ? "border-r border-[#2D3E30]/10" : ""
                  }`}
                >
                  <span className="font-display text-5xl md:text-7xl font-extralight text-[#2D3E30] mb-4 tracking-tighter">
                    {stat.number}
                    <span className="text-brand-300">+</span>
                  </span>
                  <p className="font-sans text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold text-[#2D3E30]/60">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The Curators Section */}
        <section className="max-w-7xl w-full px-6 py-24 flex flex-col gap-12">
          <div className="flex items-baseline justify-between border-b border-[#2D3E30]/10 pb-4">
            <h2 className="font-display text-4xl font-light text-[#2D3E30]">
              The Curators
            </h2>
            <span className="font-display font-light text-lg text-[#2D3E30]/60">
              Founded by Ravneet
            </span>
          </div>

          {/* Large Image */}
          <div className="w-full aspect-[21/9] bg-brand-300/20 overflow-hidden rounded-lg relative">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3XZyE1CmFiicskZuHNaAgwh1xcHkYblwayVAENloixtJvZdC4suxSjalZN1uzmRarvAYOZLIi3xZGd0--7-y_caBnCplalmqID23XdMduVlLzOHNOszeBYq4fri7TDOgd5zpyxrZiLU7hJZLjH64rXd0uZVlJi7IlyrpU9bqp4-fRxX3UZeHkECAcLiFkyLwOmJWQOBnnvmKIzBCw-T6gE-OdbLpLKDdQUPKfTu9R3Sy-QiQrP13VgcRchnzFizsVx_bELzgRHcHP"
              alt="Artists working around a large wooden table in a sunlit studio"
              fill
              className="object-cover grayscale opacity-80 mix-blend-multiply"
            />
          </div>

          {/* Collective Vision */}
          <div className="max-w-3xl mx-auto mt-8">
            <p className="font-sans text-2xl md:text-3xl font-light leading-relaxed text-[#2D3E30]/90 text-center">
              Our team is a tapestry of diverse backgrounds, united by a
              singular vision: to make art accessible as a form of meditation.
              We believe that everyone possesses an{" "}
              <span className="text-brand-300 font-medium">
                innate creative spark
              </span>{" "}
              that simply needs the right environment to flourish. Our
              collective expertise spans centuries-old techniques and
              contemporary aesthetics, ensuring every workshop is both a
              learning experience and a soulful journey.
            </p>
            <div className="mt-12 flex justify-center">
              <div className="w-16 h-[1px] bg-brand-300" />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full max-w-5xl px-6 py-32 text-center">
          <h2 className="font-display text-3xl font-light text-[#2D3E30] mb-10">
            Join our next gathering in the studio.
          </h2>
          <Link
            href="/workshops"
            className="inline-block px-12 py-4 rounded-full bg-brand-300 text-[#2D3E30] font-semibold uppercase tracking-widest text-sm hover:bg-[#2D3E30] hover:text-[#fffff1] transition-all"
          >
            View Upcoming Workshops
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}
