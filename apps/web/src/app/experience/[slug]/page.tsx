import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Header, Footer, CTASection } from "@/components";
import { workshopCategories } from "@/data/categories";

// Generate static params for all categories
export function generateStaticParams() {
  return workshopCategories.map((category) => ({
    slug: category.slug,
  }));
}

export default function ExperiencePage({
  params,
}: {
  params: { slug: string };
}) {
  const category = workshopCategories.find((c) => c.slug === params.slug);

  if (!category) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="flex flex-col items-center w-full bg-[#fffff1] text-[#141514] overflow-x-hidden transition-colors duration-300">
        
        {/* HERO SECTION */}
        <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center px-6 py-24 overflow-hidden">
          {/* Abstract Background Layers */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
             <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] rounded-full blur-3xl bg-brand-100/50 mix-blend-multiply"></div>
             <div className="absolute bottom-[15%] right-[10%] w-[500px] h-[500px] border border-brand-200 rounded-full opacity-50"></div>
             <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-brand-50/50 rounded-full blur-2xl"></div>
          </div>
          
          <div className="relative z-10 max-w-screen-2xl w-full flex flex-col md:flex-row items-center md:items-start justify-between gap-12 md:gap-24">
            <div className="flex-1 space-y-10">
              <div className="space-y-6">
                <span className="text-brand-600 font-medium tracking-[0.4em] uppercase text-[10px] md:text-xs block bg-brand-50 w-fit px-3 py-1 rounded-full border border-brand-100">
                  Offhanded Experience
                </span>
                <h1 className="text-[#141514] tracking-tighter text-6xl md:text-[100px] font-light leading-[0.9] font-display">
                  {category.name.split(' ')[0]} <br/>
                  <span className="italic font-normal text-brand-400">
                    {category.name.split(' ').slice(1).join(' ')}
                  </span>
                </h1>
              </div>
              
              <div className="w-24 h-[1px] bg-brand-200"></div>
              
              <p className="max-w-md text-xl md:text-2xl font-normal leading-relaxed text-[#4a4a4a] italic opacity-80">
                {category.description}
              </p>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 pt-6">
                <button className="px-10 py-4 bg-[#141514] text-white rounded-full text-xs font-bold tracking-[0.2em] uppercase hover:shadow-xl hover:shadow-brand-900/20 transition-all duration-500">
                  Book Session • {category.price}
                </button>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-brand-800 font-bold uppercase tracking-widest">Next Available</span>
                  <span className="text-xs text-gray-500 italic">{category.nextSlot || "Check calendar"}</span>
                </div>
              </div>
            </div>
            
            {/* Hero Image / Abstract Shape */}
            <div className="hidden md:flex flex-col items-center justify-center w-5/12 aspect-[4/5] bg-white/40 backdrop-blur-sm rounded-[5rem] border border-brand-100 relative overflow-hidden group shadow-2xl shadow-brand-100/50">
               <Image
                 src={category.image}
                 alt={category.name}
                 fill
                 className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000"
               />
               <div className="absolute inset-0 bg-brand-900/10 mix-blend-overlay"></div>
               
               <div className="absolute bottom-16 text-center px-10 bg-white/80 backdrop-blur-md py-4 rounded-2xl shadow-sm mx-8">
                 <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-brand-800 mb-2 block">
                   The Offhanded Method
                 </span>
                 <p className="text-xs text-gray-500 italic leading-relaxed font-medium">
                   Intuition over technical perfection.
                 </p>
               </div>
            </div>
          </div>
        </section>

        {/* SCROLL SECTION: Meditative Heritage */}
        <section className="max-w-screen-2xl w-full px-6 py-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24 items-start">
            {/* Sticky Left Title */}
            <div className="md:col-span-4 sticky top-32">
              <div className="flex flex-col gap-8">
                <h2 className="text-4xl md:text-5xl font-light font-display italic leading-tight text-brand-900">
                  The Meditative<br/>Heritage
                </h2>
                <div className="h-px w-24 bg-brand-300"></div>
                <span className="text-xs font-bold text-brand-500 uppercase tracking-[0.4em]">
                  A legacy of earth
                </span>
              </div>
            </div>
            
            {/* Scrollable Right Content */}
            <div className="md:col-span-8">
              <p className="text-xl md:text-2xl leading-[1.7] text-[#141514] opacity-90 first-letter:text-7xl first-letter:font-display first-letter:mr-4 first-letter:float-left first-letter:text-brand-400 first-letter:leading-none">
                {category.longDescription || category.description}
              </p>
              
              <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-16">
                 {/* Feature 1 */}
                <div className="space-y-6">
                  <div className="size-10 rounded-full border border-brand-200 flex items-center justify-center text-brand-500 italic font-display bg-brand-50">01</div>
                  <h3 className="font-display italic text-2xl text-brand-800">The Art of Texture</h3>
                  <p className="text-base leading-relaxed text-gray-600 font-light">
                    Our workshops explore the history of texture—from the rough-hewn vessels of the Neolithic to the refined minimalism of contemporary ceramics.
                  </p>
                </div>
                 {/* Feature 2 */}
                <div className="space-y-6">
                  <div className="size-10 rounded-full border border-brand-200 flex items-center justify-center text-brand-500 italic font-display bg-brand-50">02</div>
                  <h3 className="font-display italic text-2xl text-brand-800">Tactile Connection</h3>
                  <p className="text-base leading-relaxed text-gray-600 font-light">
                    Participants are guided through sensory-first techniques, learning to 'see' through their fingertips. This direct engagement fosters mindfulness.
                  </p>
                </div>
              </div>
              
              {/* Added: What We Do List */}
              {category.whatWeDo && (
                 <div className="mt-16 bg-brand-50/50 p-8 rounded-3xl border border-brand-100">
                    <h3 className="font-display text-xl mb-6 text-brand-800">Session Highlights</h3>
                    <ul className="space-y-4">
                       {category.whatWeDo.map((item, i) => (
                          <li key={i} className="flex items-center gap-3 text-neutral-600">
                             <span className="w-1.5 h-1.5 rounded-full bg-brand-400"></span>
                             {item}
                          </li>
                       ))}
                    </ul>
                 </div>
              )}
            </div>
          </div>
        </section>

        {/* GALLERY SECTION */}
        <section className="w-full bg-brand-50/30 py-24 px-6 md:px-20">
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <h3 className="text-4xl font-bold font-display italic text-brand-900">
                    PAST {category.name.toUpperCase()} GLIMPSES
                </h3>
                <p className="text-sm text-brand-500 font-medium mt-3 tracking-widest uppercase">
                    Visual archive of stillness
                </p>
              </div>
              <button className="text-sm font-bold border-b-2 border-brand-300 pb-1 hover:tracking-widest transition-all duration-300 text-brand-800">
                  View Full Archive
              </button>
            </div>
            
            {/* Bento Grid Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-2 h-auto md:h-[1000px]">
              {/* Item 1: Large Featured */}
              <div className="md:col-span-2 md:row-span-2 rounded-3xl bg-white relative overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-500">
                <Image
                    src={category.galleryImages?.[0] || category.image}
                    alt="Gallery 1"
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-neutral-900/10 group-hover:bg-neutral-900/20 transition-colors"></div>
                <div className="absolute bottom-8 left-8 text-white z-10">
                   <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full">
                      Studio Session
                   </span>
                   <h4 className="text-3xl font-bold mt-4 font-display">The Flow State</h4>
                </div>
              </div>

              {/* Item 2: Quote Block */}
              <div className="md:col-span-1 md:row-span-1 rounded-3xl bg-brand-100/20 border border-brand-100 flex flex-col items-center justify-center p-8 text-center group">
                 <span className="text-5xl mb-6 opacity-50 group-hover:rotate-12 transition-transform duration-500">
                    💧
                 </span>
                 <p className="text-lg font-medium italic text-brand-900 leading-relaxed">
                    "Texture is the memory of the touch."
                 </p>
              </div>

               {/* Item 3: Small Image */}
               <div className="md:col-span-1 md:row-span-1 rounded-3xl bg-white relative overflow-hidden group shadow-sm">
                 <Image
                    src={category.galleryImages?.[1] || category.image}
                    alt="Gallery 2"
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute bottom-6 left-6 text-white bg-black/20 backdrop-blur-sm px-3 py-1 rounded-lg">
                   <span className="text-[10px] font-bold uppercase tracking-widest">Detail Study</span>
                </div>
               </div>

               {/* Item 4: Wide Image */}
               <div className="md:col-span-2 md:row-span-1 rounded-3xl bg-white relative overflow-hidden group shadow-sm">
                 <Image
                    src={category.galleryImages?.[2] || category.image}
                    alt="Gallery 3"
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute bottom-8 left-8 text-white z-10">
                   <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Autumn 2024</span>
                   <h4 className="text-2xl font-bold mt-2 font-display">Morning Light</h4>
                </div>
               </div>

               {/* Item 5 & 6 */}
               {category.galleryImages?.slice(3, 5).map((img, idx) => (
                  <div key={idx} className="md:col-span-1 md:row-span-1 rounded-3xl bg-white relative overflow-hidden group shadow-sm">
                    <Image
                        src={img}
                        alt={`Gallery ${idx + 4}`}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  </div>
               ))}
               
               {/* Fallback if not enough images */}
               {(!category.galleryImages || category.galleryImages.length < 4) && (
                   <div className="md:col-span-1 md:row-span-1 rounded-3xl bg-neutral-100 flex items-center justify-center">
                      <span className="text-neutral-400 font-display italic">More coming soon...</span>
                   </div>
               )}

            </div>
          </div>
        </section>

        <div className="w-full px-6 md:px-20 pb-24 max-w-screen-2xl mx-auto">
          <CTASection className="rounded-[2.5rem] w-full" />
        </div>

      </main>
      <Footer />
    </>
  );
}
