import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header, Footer } from "@/components";
import { upcomingWorkshops, formatPrice, formatDate } from "@/data/workshops";
import { workshopCategories } from "@/data/categories";

// Generate static params
export function generateStaticParams() {
  return upcomingWorkshops.map((workshop) => ({
    id: workshop.id,
  }));
}

export default function EventDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const workshop = upcomingWorkshops.find((w) => w.id === params.id);

  if (!workshop) {
    notFound();
  }

  // Get category data for extended content (gallery, descriptions)
  const category = workshopCategories.find((c) => c.id === workshop.categoryId);

  // Get related workshops (exclude current)
  const relatedWorkshops = upcomingWorkshops
    .filter((w) => w.id !== workshop.id)
    .slice(0, 3);

  return (
    <>
      <Header />
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-10 py-6 min-h-screen">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap gap-2 mb-6 pt-20 lg:pt-24">
          <Link href="/" className="text-neutral-500 hover:text-brand-600 transition-colors text-sm font-medium">Home</Link>
          <span className="text-neutral-400 text-sm">/</span>
          <Link href="/workshops" className="text-neutral-500 hover:text-brand-600 transition-colors text-sm font-medium">Workshops</Link>
          <span className="text-neutral-400 text-sm">/</span>
          <span className="text-neutral-900 font-medium text-sm">{workshop.title}</span>
        </nav>

        {/* Hero Section */}
        <section className="relative w-full rounded-2xl overflow-hidden h-[400px] md:h-[520px] mb-10 group">
          <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
            <Image
                src={workshop.image}
                alt={workshop.title}
                fill
                className="object-cover"
                priority
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full md:w-2/3 lg:w-1/2 z-10">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-brand-900 uppercase bg-brand-200 rounded-full">
                Workshop
            </span>
            <h1 className="text-white text-3xl md:text-5xl font-bold tracking-tight mb-2 leading-tight">
                {workshop.title}
            </h1>
            <p className="text-gray-200 text-lg md:text-xl font-light leading-relaxed">
                {category?.description || workshop.description}
            </p>
          </div>
        </section>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">
            
          {/* Left Column: Details */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            
            {/* About */}
            <section>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">About the Session</h2>
              <p className="text-neutral-600 text-lg leading-relaxed mb-4">
                {category?.longDescription || workshop.description}
              </p>
              <p className="text-neutral-600 text-lg leading-relaxed">
                 Guided by our expert instructors, this session is designed to help you disconnect from the digital world and reconnect with your creativity. Whether you're a beginner or an experienced artist, you'll find joy in the process of making.
              </p>
            </section>

            {/* What to Expect */}
            <section className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-8">
              <h3 className="text-xl font-bold text-neutral-900 mb-6">What to Expect</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                {category?.whatWeDo ? (
                    category.whatWeDo.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                             <div className="text-brand-600">
                                <CheckIcon />
                             </div>
                            <div>
                                <h4 className="font-semibold text-neutral-900 text-sm">{item}</h4>
                            </div>
                        </li>
                    ))
                ) : (
                    <>
                        <li className="flex items-start gap-3">
                            <span className="text-brand-500"><LeafIcon /></span>
                            <div>
                                <h4 className="font-semibold text-neutral-900">Mindfulness Focus</h4>
                                <p className="text-sm text-neutral-500 mt-1">Guided breathing & centering techniques.</p>
                            </div>
                        </li>
                         <li className="flex items-start gap-3">
                            <span className="text-brand-500"><MaterialsIcon /></span>
                            <div>
                                <h4 className="font-semibold text-neutral-900">All Materials</h4>
                                <p className="text-sm text-neutral-500 mt-1">Clay, tools, aprons, and firing included.</p>
                            </div>
                        </li>
                    </>
                )}
                 <li className="flex items-start gap-3">
                    <span className="text-brand-500"><CoffeeIcon /></span>
                    <div>
                        <h4 className="font-semibold text-neutral-900">Refreshments</h4>
                        <p className="text-sm text-neutral-500 mt-1">Herbal tea and light organic snacks.</p>
                    </div>
                </li>
                 <li className="flex items-start gap-3">
                    <span className="text-brand-500"><GroupIcon /></span>
                    <div>
                        <h4 className="font-semibold text-neutral-900">Small Group</h4>
                        <p className="text-sm text-neutral-500 mt-1">Limited seats for personal attention.</p>
                    </div>
                </li>
              </ul>
            </section>

            {/* Instructor Bio */}
            <section className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-brand-50 rounded-2xl p-6 md:p-8">
                <div className="shrink-0 relative">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-sm">
                        <Image 
                            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80" 
                            alt={workshop.instructor}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="absolute bottom-0 right-0 bg-brand-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Expert</div>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-neutral-900">{workshop.instructor}</h3>
                    <p className="text-brand-700 text-sm font-medium mb-3">Ceramic Artist & Therapist</p>
                    <p className="text-neutral-600 text-sm leading-relaxed">
                        {workshop.instructor} combines years of experience in fine arts with a passion for teaching. They believe in the healing power of creating with one's hands and guide students to find their own rhythm.
                    </p>
                </div>
            </section>

            {/* Gallery */}
            {category?.galleryImages && (
                <section>
                    <h3 className="text-xl font-bold text-neutral-900 mb-6">Gallery</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-48 md:h-64">
                         {category.galleryImages.slice(0, 3).map((img, idx) => (
                             <div 
                                key={idx} 
                                className={`h-full rounded-xl overflow-hidden relative group ${idx === 2 ? 'col-span-2 md:col-span-1' : 'col-span-1'}`}
                             >
                                <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110">
                                   <Image src={img} alt={`Gallery ${idx}`} fill className="object-cover" />
                                </div>
                             </div>
                         ))}
                    </div>
                </section>
            )}
          </div>

          {/* Right Column: Sticky Booking Card */}
          <div className="lg:col-span-5 relative">
             <div className="sticky top-24 space-y-6">
                <div className="bg-white rounded-2xl shadow-soft border border-neutral-100 overflow-hidden">
                   <div className="p-6 md:p-8">
                      <div className="flex justify-between items-start mb-6">
                         <div>
                            <p className="text-sm text-neutral-500 font-medium mb-1">Price</p>
                            <div className="flex items-baseline gap-1">
                               <span className="text-3xl font-bold text-neutral-900">{formatPrice(workshop.price)}</span>
                               <span className="text-sm text-neutral-500">/ person</span>
                            </div>
                         </div>
                         {workshop.availableSeats < 10 && (
                             <div className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                 <FlameIcon />
                                 Only {workshop.availableSeats} spots left
                             </div>
                         )}
                      </div>

                      <div className="space-y-4 mb-8">
                         <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                            <div className="bg-brand-100/50 p-2 rounded-lg text-brand-700 shrink-0">
                               <CalendarIcon />
                            </div>
                            <div>
                               <p className="text-sm font-semibold text-neutral-900">Date & Time</p>
                               <p className="text-sm text-neutral-500">{formatDate(workshop.date)}</p>
                               <p className="text-sm text-neutral-500">{workshop.time}</p>
                            </div>
                         </div>

                         <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                            <div className="bg-brand-100/50 p-2 rounded-lg text-brand-700 shrink-0">
                               <LocationIcon />
                            </div>
                            <div className="flex-1">
                               <p className="text-sm font-semibold text-neutral-900">Location</p>
                               <p className="text-sm text-neutral-500">{workshop.location}</p>
                               <a href="#" className="text-xs text-brand-600 underline mt-0.5 inline-block">View on map</a>
                            </div>
                             <div className="w-12 h-12 rounded-lg bg-neutral-200 overflow-hidden shrink-0 relative">
                                <Image src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=100&q=80" alt="Map" fill className="object-cover opacity-70" />
                            </div>
                         </div>
                      </div>

                      <Link href={`/events/${workshop.id}/register`} className="w-full bg-brand-400 hover:bg-brand-500 active:scale-[0.98] text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-brand-200 flex items-center justify-center gap-2">
                          <span>Reserve My Seat</span>
                          <ArrowRightIcon />
                      </Link>
                      
                      <p className="text-xs text-center text-neutral-400 mt-4">
                          Free cancellation up to 48 hours before the event.
                      </p>
                   </div>
                   
                   <div className="bg-neutral-50 px-8 py-4 border-t border-neutral-100 flex justify-between items-center">
                       <span className="text-xs font-medium text-neutral-500">Share this workshop</span>
                       <div className="flex gap-3 text-neutral-400">
                           <button className="hover:text-neutral-900 transition-colors"><ShareIcon /></button>
                           <button className="hover:text-neutral-900 transition-colors"><HeartIcon /></button>
                       </div>
                   </div>
                </div>

                {/* Help Card */}
                <div className="bg-transparent border border-dashed border-neutral-300 rounded-xl p-5 text-center">
                    <p className="text-sm font-medium text-neutral-900 mb-1">Questions?</p>
                    <p className="text-xs text-neutral-500 mb-3">Reach out to our support team.</p>
                    <a href="/contact" className="text-sm font-bold text-brand-700 hover:underline">Contact Support</a>
                </div>
             </div>
          </div>
        </div>

        {/* Related Workshops */}
        <section className="mt-20 mb-12 border-t border-neutral-100 pt-12">
            <div className="flex justify-between items-end mb-8">
               <div>
                  <h2 className="text-2xl font-bold text-neutral-900">You might also like</h2>
                  <p className="text-neutral-500 mt-2">Discover more ways to unwind.</p>
               </div>
               <Link href="/workshops" className="hidden sm:flex items-center gap-1 text-sm font-bold text-brand-700 hover:text-brand-800 transition-colors">
                  View all workshops
                  <ArrowRightIcon className="w-4 h-4 ml-1" />
               </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {relatedWorkshops.map((related) => (
                  <Link 
                    href={`/events/${related.id}`} 
                    key={related.id}
                    className="group block bg-white rounded-2xl overflow-hidden border border-neutral-100 hover:shadow-soft-lg transition-all duration-300"
                  >
                     <div className="h-48 overflow-hidden relative">
                        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                           <Image src={related.image} alt={related.title} fill className="object-cover" />
                        </div>
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-neutral-900">
                           {formatPrice(related.price)}
                        </div>
                     </div>
                     <div className="p-5">
                        <h3 className="text-lg font-bold text-neutral-900 mb-1 group-hover:text-brand-700 transition-colors truncate">
                           {related.title}
                        </h3>
                        <p className="text-sm text-neutral-500 mb-4 line-clamp-2">{related.description}</p>
                        <div className="flex items-center gap-4 text-xs font-medium text-neutral-400 border-t border-neutral-100 pt-4">
                           <span className="flex items-center gap-1"><CalendarIcon className="w-4 h-4" /> {formatDate(related.date).split(',')[0]}</span>
                           <span className="flex items-center gap-1"><ClockIcon className="w-4 h-4" /> {related.duration}</span>
                        </div>
                     </div>
                  </Link>
               ))}
            </div>
        </section>

        {/* Mobile Fixed Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4 z-40 lg:hidden flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
           <div>
              <p className="text-xs text-neutral-500">Total</p>
              <p className="text-xl font-bold text-neutral-900">{formatPrice(workshop.price)}</p>
           </div>
           <Link href={`/events/${workshop.id}/register`} className="bg-brand-400 hover:bg-brand-500 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-sm">
              Reserve Seat
           </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

/* --- ICONS (Simple SVGs) --- */

function CheckIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function LeafIcon({ className = "w-6 h-6" }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
    )
}

function MaterialsIcon({ className = "w-6 h-6" }: { className?: string }) {
     return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
           <path d="M18.6 5.2a3 3 0 1 0-4.2-4.2" /><path d="m11.8 17.5 1.5 1.5" /><polyline points="19.1 19.1 21.3 21.3 16.9 16.9" /><path d="M10.9 9.8 19 17.9" /><circle cx="7" cy="7" r="2.5" /><path d="m11.1 12.9-1.9 1.9" /><path d="m15.5 11.5-1 1" />
        </svg>
    )
}

function CoffeeIcon({ className = "w-6 h-6" }: { className?: string }) {
     return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M17 8h1a4 4 0 1 1 0 8h-1" /><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" /><line x1="6" x2="6" y1="2" y2="4" /><line x1="10" x2="10" y1="2" y2="4" /><line x1="14" x2="14" y1="2" y2="4" />
        </svg>
    )
}

function GroupIcon({ className = "w-6 h-6" }: { className?: string }) {
     return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    )
}

function FlameIcon({ className = "w-4 h-4" }: { className?: string }) {
    return (
       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.1.2-2.2.6-3.3.31.52.9 1.8 1.9 2.8z" />
       </svg>
   )
}

function CalendarIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
       </svg>
   )
}

function ClockIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
       </svg>
   )
}

function LocationIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
       </svg>
   )
}

function ArrowRightIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
       </svg>
   )
}

function ShareIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" x2="12" y1="2" y2="15" />
       </svg>
   )
}

function HeartIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
       </svg>
   )
}
