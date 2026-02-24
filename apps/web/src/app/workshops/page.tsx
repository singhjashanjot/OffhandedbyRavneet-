import { Header, Footer } from "@/components";
import Link from "next/link";
import type { Metadata } from "next";
import { getActiveWorkshops } from "@/lib/queries/workshops";
import { formatPrice, formatDate } from "@/data";
import type { DbWorkshop } from "@/lib/adapters";

export const metadata: Metadata = {
  title: "Offhanded | Upcoming Workshops",
  description: "Browse our upcoming art workshops. Pottery, canvas, rope painting, and more.",
};

export default async function WorkshopsPage() {
  const workshops = (await getActiveWorkshops()) as DbWorkshop[];

  return (
    <>
      <div className="bg-background-light min-h-screen text-offhanded-deep selection:bg-offhanded-forest selection:text-white overflow-x-hidden font-display">
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
                <h1 className="text-4xl md:text-5xl font-serif text-offhanded-forest italic">
                  Upcoming Workshops
                </h1>
              </div>
              <div className="text-[10px] uppercase tracking-[0.4em] text-offhanded-forest/60 mt-6 md:mt-0 font-medium">
                2026 Collection — Limited Availability
              </div>
            </div>
          </section>

          <section className="px-8 md:px-16 pb-24 relative z-10 ">
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
                    <div className="bg-[#FFFFF5] border border-offhanded-forest/[0.08] rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-700 group flex flex-col h-full">
                      <div className="aspect-[16/10] overflow-hidden rounded-xl mb-6">
                        <img
                          alt={workshop.title}
                          className="w-full h-full object-cover transition-all duration-1000 scale-100 group-hover:scale-105"
                          src={workshop.image || "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80"}
                        />
                      </div>
                      <div className="flex flex-col flex-grow px-2">
                        <h3 className="text-2xl font-serif text-offhanded-forest mb-8 tracking-tight italic">
                          {workshop.title}
                        </h3>
                        <div className="grid grid-cols-2 gap-y-8 mb-10 border-t border-offhanded-forest/[0.05] pt-8">
                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] uppercase tracking-[0.2em] text-offhanded-forest/40">
                              Date
                            </span>
                            <span className="text-[12px] uppercase tracking-wider font-medium text-offhanded-forest">
                              {formatDate(workshop.date)}
                            </span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] uppercase tracking-[0.2em] text-offhanded-forest/40">
                              Venue
                            </span>
                            <span className="text-[12px] uppercase tracking-wider font-medium text-offhanded-forest">
                              {workshop.venue_name}
                            </span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] uppercase tracking-[0.2em] text-offhanded-forest/40">
                              Duration
                            </span>
                            <span className="text-[12px] uppercase tracking-wider font-medium text-offhanded-forest">
                              {workshop.duration || "2 Hours"}
                            </span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] uppercase tracking-[0.2em] text-offhanded-forest/40">
                              Price
                            </span>
                            <span className="text-[12px] uppercase tracking-wider font-medium text-offhanded-forest">
                              {formatPrice(workshop.price)}
                            </span>
                          </div>
                        </div>

                        {/* Availability Badge */}
                        {workshop.available_slots <= 5 && (
                          <div className="mb-4">
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">
                              Only {workshop.available_slots} spots left
                            </span>
                          </div>
                        )}

                        <button className="mt-auto w-full py-4 border border-offhanded-forest/20 text-offhanded-forest uppercase text-[10px] tracking-[0.4em] font-semibold hover:bg-offhanded-forest hover:text-white transition-all duration-500 rounded-lg">
                          Reserve Seat
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
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
