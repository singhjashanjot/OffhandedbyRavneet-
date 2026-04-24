"use client";

/* ========================================
   BRAND MARQUEE COMPONENT
   Infinite scrolling horizontal list of brands
   FINAL PRODUCTION CONFIGURATION
   - Strict Z-Index Layering (30 -> 40 -> 50)
   - Vertical Flex Layout
   - Explicit Height Containers
   - Robust Image Sizing (h-24, min-h-80px)
======================================== */

type MarqueeBrand = {
  name: string;
  src: string;
  scale?: number;
};

const MARQUEE_BRANDS: MarqueeBrand[] = [
  { name: "Cafe Delhi Heights", src: "https://res.cloudinary.com/daoho0jwj/image/upload/v1770407719/Cafe_Delhi_Heights_Registered_Logo_Yellow_And_Pink_xkwefg.jpg", scale: 0.98 },
  { name: "Greko", src: "https://res.cloudinary.com/daoho0jwj/image/upload/v1770407719/Greko_qc1nhz.png", scale: 2.2 },
  { name: "Tim Hortons", src: "https://res.cloudinary.com/daoho0jwj/image/upload/v1770407719/tim-hortons-6833_bonpxt.png", scale: 1.18 },
  { name: "Starbucks", src: "https://res.cloudinary.com/daoho0jwj/image/upload/v1770407719/starbucks-seeklogo_ymdcoz.png", scale: 1.12 },
  { name: "Third Wave Coffee", src: "https://res.cloudinary.com/daoho0jwj/image/upload/v1770407719/Tw_trnsprnt_sjaudl.png", scale: 1.14 },
  { name: "Kohi", src: "https://res.cloudinary.com/daoho0jwj/image/upload/v1770430502/Kohi_trnsprnt_dznhab.png", scale: 0.92 },
  { name: "Manterrae", src: "https://res.cloudinary.com/daoho0jwj/image/upload/v1770430503/Manterrae_tzguvp.png", scale: 1.75 },
  { name: "Kafenio", src: "https://res.cloudinary.com/daoho0jwj/image/upload/v1770430504/Kafenio_jgqdew.png", scale: 1.02 },
  { name: "Cine Naaz", src: "https://res.cloudinary.com/daoho0jwj/image/upload/v1770430513/Cine_naaz_fthmpw.png", scale: 1.95 },
  { name: "Raasta", src: "https://res.cloudinary.com/daoho0jwj/image/upload/v1770430515/Raasta_jcx7jb.png", scale: 1.55 },
];

export function BrandMarquee() {
  return (
    // Z-INDEX LAYER 1: Main Container
    // Removed red border, kept layout logic
    <div className="w-full bg-[#fffff1] py-8 border-y border-neutral-100 relative z-30 flex flex-col gap-4 max-w-7xl mx-auto">
      
      {/* Z-INDEX LAYER 2: Text Header */}
 
      <div className="container-custom text-center relative z-40">
        <p className="text-sm font-medium tracking-widest text-neutral-400 uppercase">
          Trusted by Partners
        </p>
      </div>
      
      {/* Z-INDEX LAYER 3: Marquee Container */}
   
      <div className="relative w-full h-28 z-40 flex items-center overflow-hidden">
        
        <div className="animate-marquee whitespace-nowrap flex flex-row items-center">
          {/* Loop 1: Primary Logos */}
          {MARQUEE_BRANDS.map((brand, index) => (
            <div
              key={`logo-1-${index}`}
              // Removed green background, kept wrapper dimensions
              className="mx-8 w-56 h-32 flex items-center justify-center"
            >
               <img
                src={brand.src}
                alt={brand.name}
                // Fixed viewport + per-logo scaling creates consistent perceived size.
                className="h-20 w-52 object-contain block relative z-50 mix-blend-multiply"
                style={{
                  display: "block",
                  transform: `scale(${brand.scale ?? 1})`,
                  transformOrigin: "center",
                }}
              />
            </div>
          ))}

          {/* Loop 2: Seamless Clone */}
          {MARQUEE_BRANDS.map((brand, index) => (
             <div
              key={`logo-2-${index}`}
              className="mx-8 w-56 h-32 flex items-center justify-center"
             >
               <img
                src={brand.src}
                alt={brand.name}
                className="h-20 w-52 object-contain block relative z-50 mix-blend-multiply"
                style={{
                  display: "block",
                  transform: `scale(${brand.scale ?? 1})`,
                  transformOrigin: "center",
                }}
              />
            </div>
          ))}
          
           {/* Loop 3: Safety Clone (for wide screens) */}
           {MARQUEE_BRANDS.map((brand, index) => (
             <div
              key={`logo-3-${index}`}
              className="mx-8 w-56 h-32 flex items-center justify-center"
             >
               <img
                src={brand.src}
                alt={brand.name}
                className="h-20 w-52 object-contain block relative z-50 mix-blend-multiply"
                style={{
                  display: "block",
                  transform: `scale(${brand.scale ?? 1})`,
                  transformOrigin: "center",
                }}
              />
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
