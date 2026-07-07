"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";

/* ========================================
   GALLERY GRID (Client Component)
   Asymmetric grid with category filtering
   + Behind the Scenes section
======================================== */

interface GalleryItem {
  id: string;
  media_url: string;
  media_type: string;
  category: string | null;
  caption: string | null;
  event_type: string | null;
}

interface GalleryGridProps {
  items: GalleryItem[];
}

/*
  Row templates — each row spans 12 cols and shares a single aspect ratio
  so items on the same row are always the same height = no empty gaps.
*/

const DUMMY_IMAGES = [
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636491/IMG_5555_aevxtd.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636490/IMG_2774_zvfqy7.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636490/IMG_0627_mqmp5e.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636490/IMG_6955_qypkz3.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636489/IMG_5521_qdzurw.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636488/IMG_5556_swiq5g.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636486/IMG_1987_hb6ecj.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636417/IMG_8310_yojqor.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636416/IMG_8301_b3dqiw.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636390/IMG_8297_ivhitf.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636390/IMG_8298_kvuhbm.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636332/IMG_1797_uig3ln.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636330/IMG_1800_hlclqb.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636329/IMG_8667_rnwclm.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636329/IMG_1808_u8gxvg.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636329/IMG_7678_t2zuon.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636328/IMG_7659_hqopav.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636328/IMG_7642_sn7gmb.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636327/IMG_7634_qivymg.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636327/IMG_7649_zy37rh.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636327/IMG_7643_lgemfy.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636327/IMG_7675_sbwden.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636327/IMG_7662_mtfkvy.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636326/IMG_7667_m7b3tj.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636325/IMG_8310_nga8zz.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636325/IMG_8297_j4mzso.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636324/IMG_8294_a16wx2.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636324/IMG_8298_nszg3s.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631448/IMG_5550_kwaliv.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631448/IMG_1467_hf5f8c.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631446/IMG_8472_elkbnv.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631446/IMG_2774_gtv5vz.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631445/IMG_5976_wtur03.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631445/IMG_6955_dacuj6.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631444/IMG_0004_gfpgmy.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631443/IMG_5521_h9ak67.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631443/IMG_0627_huujuz.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631442/IMG_5555_edfmhn.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631441/IMG_1987_zcaj7w.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631441/IMG_0425_wjaucs.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631435/IMG_0432_osllla.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631435/IMG_0541_ux3ig2.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631435/IMG_0532_ebwcky.jpg",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631433/IMG_0428_a8wt3g.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631433/IMG_0425_1_sjdgbg.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631433/IMG_0497_rinstb.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631433/IMG_1020_ojvdpy.jpg",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631432/IMG_1021_lspwx5.jpg",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631432/IMG_0988_p6ksdk.jpg",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631432/IMG_1027_rxv2z5.jpg",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631431/IMG_1055_g6hqon.jpg",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631430/IMG_3115_n8ta8n.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631430/IMG_3254_vjcfvh.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631429/IMG_3138_nfwbhr.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631428/IMG_3145_s5fulc.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631425/IMG_3260_gpgdqw.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631421/IMG_1784_1_mda6ac.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631420/IMG_1773_peeiko.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631419/IMG_1784_r00fvn.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631418/IMG_1687_dr7bmb.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631409/IMG_1790_wv9hdx.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631408/IMG_1795_dfmzz5.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631407/IMG_1797_trdavn.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631406/IMG_1800_xc4mrc.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631399/IMG_1808_vd0q5o.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631399/IMG_8667_bxov0s.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631399/IMG_2983_d30e4z.jpg",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631396/IMG_2706_k9vuv8.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631396/IMG_5184_h8wfsi.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631396/IMG_3027_ojd11j.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631393/IMG_5151_hieqhc.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631392/IMG_3026_xer6ma.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631388/IMG_1094_motsrn.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631387/IMG_5173_pcyvhi.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631386/IMG_1483_zdegol.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1778868393/WhatsApp_Image_2026-05-15_at_11.36.10_PM_jndlvs.jpg",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1778867803/IMG_8389_zpdwk5.heic",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1772198382/WhatsApp_Image_2026-02-20_at_5.55.13_PM_1_oijwzm.jpg",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1771541977/android-chrome-512x512_jskgfx.png",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1770430515/Raasta_jcx7jb.png",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1770430513/Cine_naaz_fthmpw.png",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1770430504/Kafenio_jgqdew.png",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1770430503/Manterrae_tzguvp.png",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1770430502/Kohi_trnsprnt_dznhab.png",
  "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1770430209/Offhanded_transparent_Black_1_tkvdt8.png"
];

export function GalleryGrid({ items }: GalleryGridProps) {
  // Generate 60 items by merging DB items and mock items
  const gridItems = useMemo(() => {
    const list = [...items];
    let imgIdx = 0;
    while (list.length < DUMMY_IMAGES.length) {
      list.push({
        id: `mock-${list.length}`,
        media_url: DUMMY_IMAGES[imgIdx % DUMMY_IMAGES.length],
        media_type: "image",
        category: null,
        caption: "A beautiful moment captured during our creative sessions.",
        event_type: null,
      });
      imgIdx++;
    }
    return list;
  }, [items]);

  return (
    <>


      {/* Pinterest-style Masonry Gallery Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-20 pb-20">
        {gridItems.length > 0 ? (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 lg:gap-6 space-y-4 lg:space-y-6">
            {gridItems.map((item, idx) => {
              const isVideo = item.media_type === "video";
              
              // Assign a varied aspect ratio to create the authentic Pinterest masonry feel
              const aspectClass = idx % 5 === 0 
                ? "aspect-[3/4]" 
                : idx % 3 === 0 
                  ? "aspect-[4/3]" 
                  : idx % 2 === 0 
                    ? "aspect-[5/6]"
                    : "aspect-square";

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (idx % 10) * 0.05 }}
                  className="relative group break-inside-avoid rounded-2xl overflow-hidden bg-[#2D3E30]/5 cursor-pointer"
                >
                  <div className={`w-full relative ${aspectClass}`}>
                    <GalleryMedia
                      item={item}
                      grayscale=""
                      isVideo={isVideo}
                      priority={idx < 4}
                    />
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <span className="text-white/60 text-[10px] uppercase tracking-[0.2em] mb-2 font-bold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      Captured
                    </span>
                    <h3 className="text-white text-xl font-display font-light transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75">
                      {item.caption || "Artistic Moment"}
                    </h3>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="font-sans text-lg text-[#2D3E30]/50 font-light">
              No items found in this category.
            </p>
          </div>
        )}
      </section>

    </>
  );
}

/* ========================================
   GALLERY MEDIA
   Renders image or video inside grid cell
======================================== */

function GalleryMedia({
  item,
  grayscale,
  isVideo,
  priority,
}: {
  item: GalleryItem;
  grayscale: string;
  isVideo: boolean;
  priority: boolean;
}) {
  if (isVideo) {
    return (
      <video
        src={item.media_url}
        className={`absolute inset-0 w-full h-full object-cover ${grayscale} group-hover:scale-105 transition-transform duration-700`}
        autoPlay
        muted
        loop
        playsInline
      />
    );
  }

  return (
    <Image
      src={item.media_url}
      alt={item.caption || "Gallery"}
      fill
      priority={priority}
      sizes="(max-width: 768px) 100vw, 60vw"
      className={`object-cover ${grayscale} group-hover:scale-105 transition-transform duration-700`}
    />
  );
}
