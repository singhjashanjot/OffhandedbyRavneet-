"use client";

import { testimonials } from "@/data";
import { useMemo, useRef, useState, useCallback } from "react";

/* ========================================
   TESTIMONIALS SECTION
   Video testimonial cards in a scrolling marquee
======================================== */

// Expanded set of royalty-free / public domain video clips
const DUMMY_VIDEOS = [
  "https://videos.pexels.com/video-files/3209211/3209211-uhd_2560_1440_25fps.mp4",
  "https://videos.pexels.com/video-files/3209176/3209176-uhd_2560_1440_25fps.mp4",
  "https://videos.pexels.com/video-files/856294/856294-hd_1920_1080_30fps.mp4",
  "https://videos.pexels.com/video-files/856116/856116-hd_1920_1080_30fps.mp4",
  "https://videos.pexels.com/video-files/856029/856029-hd_1920_1080_30fps.mp4",
  "https://videos.pexels.com/video-files/855282/855282-hd_1920_1080_30fps.mp4",
  "https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4",
  "https://videos.pexels.com/video-files/855564/855564-hd_1920_1080_30fps.mp4",
  "https://videos.pexels.com/video-files/855706/855706-hd_1920_1080_30fps.mp4",
  "https://videos.pexels.com/video-files/856082/856082-hd_1920_1080_30fps.mp4",
  "https://videos.pexels.com/video-files/855396/855396-hd_1920_1080_30fps.mp4",
  "https://videos.pexels.com/video-files/854228/854228-hd_1920_1080_30fps.mp4",
];

// Extra static reviews so the marquee never feels empty
const EXTRA_REVIEWS: { name: string; workshopType: string; comment: string }[] = [
  { name: "Meera Joshi", workshopType: "Tufting Workshop", comment: "Such a fun and relaxing experience!" },
  { name: "Kabir Anand", workshopType: "Candle Making", comment: "My friends and I had a blast." },
  { name: "Isha Nair", workshopType: "Resin Art", comment: "A beautiful creation and a beautiful memory." },
  { name: "Aditya Rao", workshopType: "Pottery Texture Art", comment: "Therapeutic and creative at the same time." },
  { name: "Diya Sharma", workshopType: "Canvas Art", comment: "Couldn't have asked for a better weekend." },
  { name: "Riya Patel", workshopType: "Punch Needle Art", comment: "Already booked my next session!" },
];

interface Review {
  name: string;
  workshopType: string;
  comment: string;
  videoUrl: string;
}

interface DbReviewProp {
  author_name?: string | null;
  workshop_type?: string | null;
  rating: number;
  comment?: string | null;
  video_url?: string | null;
}

interface TestimonialsSectionProps {
  dbReviews?: DbReviewProp[];
}

/* ── Single Video Testimonial Card ── */

function TestimonialVideoCard({ review }: { review: Review }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    const vid = videoRef.current;
    if (vid) {
      vid.currentTime = 0;
      vid.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsMuted(true);
  };

  const toggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted((prev) => !prev);
  }, []);

  return (
    <div
      className="group relative flex-shrink-0 w-64 md:w-72 cursor-pointer select-none"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-offhanded-deep/5 transition-transform duration-500 group-hover:-translate-y-2">
        {/* Video */}
        <video
          ref={videoRef}
          src={review.videoUrl}
          muted={isMuted}
          loop
          playsInline
          autoPlay
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

        {/* Mute/Unmute button — visible on hover */}
        <button
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute" : "Mute"}
          className={`absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white transition-opacity duration-300 hover:bg-black/60 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          {isMuted ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728" />
            </svg>
          )}
        </button>

        {/* Bottom text overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="font-condensed text-3xl md:text-4xl leading-none tracking-wide uppercase text-offhanded-accent">
            {review.name}
          </h3>
          <p className="text-xs font-sans text-white/70 mt-2">
            {review.workshopType}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Main Section ── */

export function TestimonialsSection({ dbReviews }: TestimonialsSectionProps) {
  const reviews = useMemo<Review[]>(() => {
    let source: { name: string; workshopType: string; comment: string; videoUrl?: string }[] = [];

    if (dbReviews && dbReviews.length > 0) {
      source = dbReviews.map((r) => ({
        name: r.author_name || "Anonymous",
        workshopType: r.workshop_type || "Art Workshop",
        comment: r.comment || "",
        videoUrl: r.video_url || undefined,
      }));
    } else {
      // Combine static testimonials with extra reviews for a fuller marquee
      source = [
        ...testimonials.map((t) => ({
          name: t.name,
          workshopType: t.workshopType,
          comment: t.review,
        })),
        ...EXTRA_REVIEWS,
      ];
    }

    // Assign a dummy video to each review (cycle), unless it has its own video_url
    return source.map((s, i) => ({
      name: s.name,
      workshopType: s.workshopType,
      comment: s.comment,
      videoUrl: s.videoUrl || DUMMY_VIDEOS[i % DUMMY_VIDEOS.length],
    }));
  }, [dbReviews]);

  // Duplicate for seamless loop
  const marqueeItems = useMemo(() => [...reviews, ...reviews], [reviews]);

  const marqueeRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section className="py-24 w-full bg-[#fffff1]">
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-[#fffff1]">
        {/* Title */}
        <h2 className="pointer-events-none px-6 py-10 text-center font-display font-light text-display-sm md:text-display-md text-neutral-900 text-balance">
          Here Is What Our Users Have To Say About Us.
        </h2>
        <div className="h-px w-24 bg-offhanded-accent/40 mx-auto mb-12" />

        {/* Marquee track */}
        <div
          className="w-full overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            ref={marqueeRef}
            className="flex gap-10 py-4"
            style={{
              animation: "testimonial-scroll 25s linear infinite",
              animationPlayState: isPaused ? "paused" : "running",
              width: "max-content",
            }}
          >
            {marqueeItems.map((review, i) => (
              <TestimonialVideoCard key={`${review.name}-${i}`} review={review} />
            ))}
          </div>
        </div>

        {/* Edge fade gradients */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-[#fffff1]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-[#fffff1]" />
      </div>
    </section>
  );
}
