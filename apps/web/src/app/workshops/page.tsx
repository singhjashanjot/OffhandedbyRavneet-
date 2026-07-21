import { Header, Footer } from "@/components";
import Link from "next/link";
import type { Metadata } from "next";
import { getActiveWorkshops } from "@/lib/queries/workshops";
import { formatPrice, formatDate } from "@/data";
import type { DbWorkshop } from "@/lib/adapters";

export const metadata: Metadata = {
  title: "Latest & Upcoming Art Workshops | Jalandhar, Punjab & India",
  description: "Book the latest art workshops, pottery classes, and premium textured painting experiences by Offhanded by Ravneet in Jalandhar, Punjab, and across India.",
};

// Always fetch fresh data so newly-created workshops show immediately
export const dynamic = "force-dynamic";

export default async function WorkshopsPage() {
  const workshops = (await getActiveWorkshops()) as DbWorkshop[];

  return (
    <>
      <div className="bg-transparent min-h-screen text-offhanded-deep selection:bg-offhanded-forest selection:text-white overflow-x-hidden font-display">
        <Header />

        <main className="relative pt-24 min-h-screen">
          <div className="absolute top-0 right-0 w-1/3 h-64 pointer-events-none overflow-hidden z-0">
            <svg
              className="line-art w-full h-full opacity-15"
              fill="none"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
              style={{ strokeDasharray: 1000, strokeDashoffset: 0 }}
            >
              <path
                d="M50,10 Q100,50 80,120 T180,180"
                stroke="#1B3022"
                strokeWidth="0.5"
              ></path>
              <path
                d="M30,40 Q120,20 150,100"
                stroke="#1B3022"
                strokeDasharray="2 2"
                strokeWidth="0.2"
              ></path>
            </svg>
          </div>
          <div className="absolute top-20 left-0 w-1/4 h-64 pointer-events-none overflow-hidden z-0">
            <svg
              className="line-art w-full h-full opacity-15"
              fill="none"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
              style={{ strokeDasharray: 1000, strokeDashoffset: 0 }}
            >
              <path
                d="M10,180 Q40,100 120,80 T190,20"
                stroke="#1B3022"
                strokeWidth="0.3"
              ></path>
              <circle
                cx="40"
                cy="40"
                r="30"
                stroke="#1B3022"
                strokeWidth="0.1"
              ></circle>
            </svg>
          </div>

          <section className="px-8 md:px-16 mb-12 relative z-10 top-12">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between border-b border-offhanded-forest/10 pb-10">
              <div>
                <span className="text-[10px] uppercase tracking-[0.5em] text-offhanded-forest/40 mb-3 block">
                  Curated Sessions
                </span>
                <h1 className="text-3xl md:text-5xl font-display font-light tracking-tight text-offhanded-forest">
                  Upcoming Workshops
                </h1>
              </div>
              <div className="text-[10px] uppercase tracking-[0.4em] text-offhanded-forest/60 mt-6 md:mt-0 font-medium">
                2026 Collection — Limited Availability
              </div>
            </div>
          </section>

          <section className="px-8 md:px-16 pb-24 relative z-10 ">
            {workshops.length === 0 ? (
              <div className="relative mt-8 bg-[#EEE7D0] border border-offhanded-forest/[0.08] rounded-3xl p-8 md:p-16 text-center max-w-4xl mx-auto overflow-hidden shadow-sm">
                {/* Animated Pottery Wheel */}
                <div className="mb-8 relative">
                  <svg viewBox="0 0 200 200" className="w-44 h-44 md:w-52 md:h-52 mx-auto drop-shadow-md">
                    {/* Rotating Pottery Wheel/Base */}
                    <ellipse cx="100" cy="150" rx="60" ry="15" fill="#E5D4C0" stroke="#C68B59" strokeWidth="2" />
                    <ellipse cx="100" cy="147" rx="55" ry="12" fill="#D2B48C" />
                    
                    {/* Pottery clay structure (Rotating & Morphing animation) */}
                    <g className="animate-spin origin-[100px_110px]" style={{ animationDuration: "8s" }}>
                      {/* Clay pot being formed */}
                      <path d="M 75,145 Q 60,110 80,90 Q 100,80 120,90 Q 140,110 125,145 Z" fill="#C59B76" opacity="0.9" />
                      {/* Wet highlight */}
                      <path d="M 85,100 Q 100,92 115,100" stroke="#FAF7F2" strokeWidth="2" fill="none" opacity="0.6" />
                    </g>

                    {/* Hands holding the clay (Gentle movement) */}
                    <g className="animate-pulse" style={{ animationDuration: "3s" }}>
                      {/* Left hand helper */}
                      <path d="M 40,130 Q 65,120 72,135" stroke="#E8E1D5" strokeWidth="6" strokeLinecap="round" fill="none" />
                      {/* Right hand helper */}
                      <path d="M 160,130 Q 135,120 128,135" stroke="#E8E1D5" strokeWidth="6" strokeLinecap="round" fill="none" />
                    </g>

                    {/* Sparkles / Studio magic */}
                    <circle cx="50" cy="70" r="3" fill="#D97706" className="animate-ping" style={{ animationDuration: "2s" }} />
                    <circle cx="150" cy="65" r="2.5" fill="#7D8F82" className="animate-ping" style={{ animationDelay: "1s", animationDuration: "2.5s" }} />
                    <circle cx="100" cy="50" r="2" fill="#C68B59" className="animate-pulse" />
                  </svg>
                </div>

                <span className="text-offhanded-forest/40 font-bold uppercase tracking-[0.3em] text-[10px] mb-3 block">Studio Curations</span>
                <h3 className="text-2xl md:text-3xl font-display font-light text-offhanded-forest mb-4 leading-tight">
                  New Art Workshops Coming Up Very Soon
                </h3>
                <p className="text-offhanded-forest/70 text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed mb-8">
                  We are currently behind the scenes preparing new immersive art experiences, clay shaping, and painting sessions. Ravneet is designing the next series of workshops right now!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                  <Link
                    href="/"
                    className="text-xs uppercase tracking-widest text-offhanded-forest/60 hover:text-offhanded-forest font-semibold transition-colors py-2 px-4"
                  >
                    Back to Home
                  </Link>
                  <Link
                    href="/products"
                    className="bg-[#C68B59]/10 text-[#C68B59] hover:bg-[#C68B59]/20 text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-xl transition-all"
                  >
                    Explore Art Products
                  </Link>
                </div>
              </div>
            ) : (
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                {workshops.map((workshop) => {
                  const formatTime = (time: string) => {
                    const [hours, minutes] = time.split(":");
                    const h = parseInt(hours, 10);
                    const ampm = h >= 12 ? "PM" : "AM";
                    const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
                    return `${displayH}:${minutes} ${ampm}`;
                  };

                  return (
                    <Link key={workshop.id} href={`/events/${workshop.id}`} className="block">
                      <div className="bg-[#EEE7D0] border border-offhanded-forest/[0.08] rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-700 group flex flex-col h-full">
                        <div className="aspect-[16/10] overflow-hidden rounded-xl mb-6">
                          <img
                            alt={workshop.title}
                            className="w-full h-full object-cover transition-all duration-1000 scale-100 group-hover:scale-105"
                            src={workshop.card_image || workshop.image || "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636491/IMG_5555_aevxtd.heic"}
                          />
                        </div>
                        <div className="flex flex-col flex-grow px-2">
                          <h3 className="text-2xl md:text-3xl font-display font-light text-offhanded-forest mb-6 tracking-tight">
                            {workshop.title}
                          </h3>
                          <div className="grid grid-cols-2 gap-y-6 mb-8 border-t border-offhanded-forest/[0.05] pt-6">
                            <div className="flex flex-col gap-1">
                              <span className="text-[11px] uppercase tracking-[0.2em] text-offhanded-forest/40">
                                Date
                              </span>
                              <span className="text-[14px] uppercase tracking-wider font-medium text-offhanded-forest">
                                {formatDate(workshop.date)}
                              </span>
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[11px] uppercase tracking-[0.2em] text-offhanded-forest/40">
                                Venue
                              </span>
                              <span className="text-[14px] uppercase tracking-wider font-medium text-offhanded-forest">
                                {workshop.venue_name}
                              </span>
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[11px] uppercase tracking-[0.2em] text-offhanded-forest/40">
                                Duration
                              </span>
                              <span className="text-[14px] uppercase tracking-wider font-medium text-offhanded-forest">
                                {workshop.duration || "2 Hours"}
                              </span>
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[11px] uppercase tracking-[0.2em] text-offhanded-forest/40">
                                Price
                              </span>
                              <span className="text-[14px] uppercase tracking-wider font-medium text-offhanded-forest">
                                {formatPrice(workshop.price)}
                              </span>
                            </div>
                          </div>

                          {/* Availability Badge */}
                          {workshop.available_slots <= 5 && (
                            <div className="mb-4">
                              <span className="text-[12px] uppercase tracking-wider font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded">
                                Only {workshop.available_slots} spots left
                              </span>
                            </div>
                          )}

                          <button className="mt-auto w-full py-4 border border-offhanded-forest/20 text-offhanded-forest uppercase text-[12px] tracking-[0.4em] font-semibold hover:bg-offhanded-forest hover:text-white transition-all duration-500 rounded-lg">
                            Reserve Seat
                          </button>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          <div className="fixed right-0 top-1/2 -translate-y-1/2 pr-6 z-0 pointer-events-none opacity-20 hidden lg:block">
            <span className="text-vertical uppercase tracking-[1em] text-[8px] text-offhanded-forest font-bold select-none" style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}>
              IMPERFECT BY DESIGN • OFFHANDED ATELIER
            </span>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
