"use client";

import { testimonials } from "@/data";
import {
  useMemo,
  useRef,
  useState,
  useCallback,
  useEffect,
  startTransition,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ========================================
   TESTIMONIALS SECTION
   3D Axis Carousel – replica of Framer ThreeDAxisCarousel
   Cards fan out in a tight arc with heavy overlap
======================================== */

// Actual customer videos - Optimized via Cloudinary
const DUMMY_VIDEOS = [
  "https://res.cloudinary.com/daoho0jwj/video/upload/c_scale,w_600,f_auto,q_auto/v1779637684/IMG_6206_xfuwiy.mp4",
  "https://res.cloudinary.com/daoho0jwj/video/upload/c_scale,w_600,f_auto,q_auto/v1779637676/IMG_9971_zcrbzt.mp4",
  "https://res.cloudinary.com/daoho0jwj/video/upload/c_scale,w_600,f_auto,q_auto/v1779637676/IMG_0430_gvsgpo.mp4",
  "https://res.cloudinary.com/daoho0jwj/video/upload/c_scale,w_600,f_auto,q_auto/v1779637658/IMG_0438_ycf6aa.mp4",
  "https://res.cloudinary.com/daoho0jwj/video/upload/c_scale,w_600,f_auto,q_auto/v1779637657/IMG_0426_x45ufu.mp4",
  "https://res.cloudinary.com/daoho0jwj/video/upload/c_scale,w_600,f_auto,q_auto/v1779637656/IMG_1997_a5gfwu.mp4",
];

// Static reviews – enough to fill out 11+ cards
const STATIC_REVIEWS: { name: string; workshopType: string; comment: string }[] = [
  { name: "Priya Sharma", workshopType: "Pottery Texture Art", comment: "Absolutely magical!" },
  { name: "Arjun Mehta", workshopType: "Canvas Art", comment: "Best anniversary experience." },
  { name: "Sneha Kapoor", workshopType: "Bento Cake Painting", comment: "My daughter loved it!" },
  { name: "Vikram Singh", workshopType: "Rope on Canvas", comment: "Our team had a blast." },
  { name: "Ananya Reddy", workshopType: "Punch Needle Art", comment: "So therapeutic!" },
  { name: "Rohit Gupta", workshopType: "Acrylic Art", comment: "Great for beginners." },
  { name: "Meera Joshi", workshopType: "Tufting Workshop", comment: "Fun and relaxing!" },
  { name: "Kabir Anand", workshopType: "Candle Making", comment: "My friends and I had a blast." },
  { name: "Isha Nair", workshopType: "Resin Art", comment: "A beautiful memory." },
  { name: "Aditya Rao", workshopType: "Clay Sculpting", comment: "Creative and therapeutic." },
  { name: "Diya Sharma", workshopType: "Canvas Art", comment: "Best weekend ever." },
  { name: "Riya Patel", workshopType: "Punch Needle Art", comment: "Already booked my next one!" },
  { name: "Neha Verma", workshopType: "Pottery Workshop", comment: "Loved every moment." },
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

/* ── Spring config matching Framer exactly ── */
const SPRING_CONFIG = { stiffness: 180, damping: 26, mass: 1 };

/* ── Responsive configuration ──
   Key difference from before: MUCH tighter cardSpacing so cards heavily
   overlap, smaller scaleStep so distant cards stay visible, and wider
   perspective for that dramatic fan.
*/
function getResponsiveConfig(containerWidth: number) {
  const isMobile = containerWidth < 480;
  const isTablet = containerWidth >= 480 && containerWidth < 900;

  // Cards are a bit wider for better breathing room
  const cardWidth = isMobile
    ? Math.min(containerWidth * 0.45, 170)
    : isTablet
      ? Math.min(containerWidth * 0.28, 230)
      : Math.min(containerWidth * 0.20, 280);

  // WIDER spacing — giving videos breathing room and stretching the section
  const cardSpacing = isMobile ? 50 : isTablet ? 100 : 160;
  // Vertical offset per step — very subtle arch like the reference
  const verticalOffset = isMobile ? 5 : isTablet ? 8 : 12;
  // Gentle scale decrease so far cards are still visible
  const scaleStep = isMobile ? 0.08 : isTablet ? 0.065 : 0.055;
  // Rotation per step
  const rotationOffset = isMobile ? -5 : isTablet ? -8 : -10;
  // Deep perspective
  const perspective = isMobile ? 900 : isTablet ? 1200 : 1500;
  // Brightness dims gradually
  const brightnessStep = isMobile ? 0.08 : 0.06;
  const minHeight = isMobile ? 450 : isTablet ? 550 : 700;

  return {
    cardWidth,
    cardSpacing,
    verticalOffset,
    scaleStep,
    rotationOffset,
    perspective,
    brightnessStep,
    minHeight,
    isMobile,
    isTablet,
  };
}

/* ── Position calculator for each card ── */
function getPositionData(
  index: number,
  activeIndex: number,
  totalCards: number,
  config: ReturnType<typeof getResponsiveConfig>
) {
  let relativePos =
    ((index - activeIndex + totalCards) % totalCards) - Math.floor(totalCards / 2);
  const adjustedPos =
    relativePos > totalCards / 2
      ? relativePos - totalCards
      : relativePos < -totalCards / 2
        ? relativePos + totalCards
        : relativePos;
  const absPos = Math.abs(adjustedPos);
  const baseZIndex = 500;

  // Use a gentle power curve so nearby cards barely dip,
  // only the outermost cards sink a little
  const yOffset = Math.pow(absPos, 1.6) * config.verticalOffset;

  return {
    x: adjustedPos * config.cardSpacing,
    y: yOffset,
    scale: Math.max(0.5, 1 - absPos * config.scaleStep),
    rotateY: adjustedPos * config.rotationOffset,
    opacity: absPos > 7 ? 0.4 : 1,
    brightness: Math.max(0.35, 1 - absPos * config.brightnessStep),
    zIndex: baseZIndex - absPos * 10,
    isCenter: adjustedPos === 0,
    relativePosition: adjustedPos,
  };
}

/* ── Hook to track container size ── */
function useContainerSize(ref: React.RefObject<HTMLDivElement | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        startTransition(() => {
          setSize({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          });
        });
      }
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return size;
}

function VideoCardInner({
  review,
  isCenter,
  isHovered,
  isAnyHovered,
  config,
}: {
  review: Review;
  isCenter: boolean;
  isHovered: boolean;
  isAnyHovered: boolean;
  config: ReturnType<typeof getResponsiveConfig>;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  // Play/pause logic based on hover states
  useEffect(() => {
    if (videoRef.current) {
      if (isAnyHovered) {
        if (isHovered) {
          if (isPlaying) videoRef.current.play().catch(() => {});
          else videoRef.current.pause();
        } else {
          videoRef.current.pause();
        }
      } else {
        // Default state: all videos play
        videoRef.current.play().catch(() => {});
        setIsMuted(true);
        setIsPlaying(true);
      }
    }
  }, [isAnyHovered, isHovered, isPlaying]);

  // Restart video from beginning when hovered
  useEffect(() => {
    if (isHovered && videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  }, [isHovered]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsMuted(!isMuted);
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <video
        ref={videoRef}
        src={review.videoUrl}
        loop
        playsInline
        muted
        preload="metadata"
        draggable={false}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "transform 700ms",
          borderRadius: "20px",
          transform: isHovered ? "scale(1.05)" : "scale(1)",
        }}
      />

      {/* Controls */}
      {isCenter && (
        <div 
          className="absolute top-4 right-4 flex items-center gap-2 z-50 transition-opacity duration-300"
          style={{ opacity: isHovered || !isPlaying || !isMuted ? 1 : 0 }}
        >
          <button
            onClick={togglePlay}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isPlaying ? "pause" : "play_arrow"}
            </span>
          </button>
          <button
            onClick={toggleMute}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isMuted ? "volume_off" : "volume_up"}
            </span>
          </button>
        </div>
      )}

      <AnimatePresence>
        {isCenter && (
          <motion.div
            initial={false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.6), transparent 60%)",
              pointerEvents: "none",
              borderRadius: "20px",
            }}
          />
        )}
      </AnimatePresence>

      {isCenter && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            border: "2px solid rgba(255,255,255,0.15)",
            borderRadius: "20px",
            pointerEvents: "none",
          }}
        />
      )}

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: config.isMobile ? "14px" : "20px",
          pointerEvents: "none",
        }}
      >
        <h3
          className="font-condensed uppercase tracking-wide"
          style={{
            fontSize: config.isMobile ? "0.9rem" : "1.15rem",
            lineHeight: 1.1,
            color: "#e8d5b5",
          }}
        >
          {review.name}
        </h3>
        <p
          className="font-sans"
          style={{
            fontSize: "0.65rem",
            color: "rgba(255,255,255,0.65)",
            marginTop: "5px",
          }}
        >
          {review.workshopType}
        </p>
      </div>
    </>
  );
}

/* ════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════ */

export function TestimonialsSection({ dbReviews }: TestimonialsSectionProps) {
  /* Build reviews array — exactly matching the 6 videos */
  const reviews = useMemo<Review[]>(() => {
    // For now, strictly use the provided 6 videos
    const source = STATIC_REVIEWS.slice(0, DUMMY_VIDEOS.length);

    return source.map((s, i) => ({
      name: s.name,
      workshopType: s.workshopType,
      comment: s.comment,
      videoUrl: DUMMY_VIDEOS[i],
    }));
  }, []);

  /* State */
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const containerSize = useContainerSize(containerRef);
  const config = useMemo(
    () => getResponsiveConfig(containerSize.width || 1200),
    [containerSize.width]
  );

  const ASPECT_RATIO = 0.6667; // 2:3 portrait
  const cardHeight = config.cardWidth / ASPECT_RATIO;

  /* Nav button sizing */
  const buttonPadding = 12;
  const iconSize = 24;

  /* Position data for every card */
  const positions = useMemo(
    () =>
      reviews.map((_, index) =>
        getPositionData(index, activeIndex, reviews.length, config)
      ),
    [activeIndex, reviews.length, config, reviews]
  );

  /* Guard against out-of-range index */
  useEffect(() => {
    if (activeIndex >= reviews.length && reviews.length > 0) {
      startTransition(() => setActiveIndex(reviews.length - 1));
    }
  }, [reviews.length, activeIndex]);

  /* Auto-play timer — cycles every 2.5 seconds */
  useEffect(() => {
    if (!isAutoPlaying || reviews.length === 0) return;
    autoPlayRef.current = setInterval(() => {
      startTransition(() =>
        setActiveIndex((prev) => (prev + 1) % reviews.length)
      );
    }, 2500);
    return () => {
      if (autoPlayRef.current !== null) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlaying, reviews.length]);

  /* Keyboard navigation */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrev();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviews.length]);

  /* Navigation helpers */
  const stopAutoPlay = useCallback(() => {
    startTransition(() => setIsAutoPlaying(false));
    if (autoPlayRef.current !== null) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }, []);

  const goToNext = useCallback(() => {
    stopAutoPlay();
    startTransition(() =>
      setActiveIndex((prev) => (prev + 1) % reviews.length)
    );
  }, [reviews.length, stopAutoPlay]);

  const goToPrev = useCallback(() => {
    stopAutoPlay();
    startTransition(() =>
      setActiveIndex(
        (prev) => (prev - 1 + reviews.length) % reviews.length
      )
    );
  }, [reviews.length, stopAutoPlay]);

  const goToSlide = useCallback(
    (index: number) => {
      stopAutoPlay();
      startTransition(() => setActiveIndex(index));
    },
    [stopAutoPlay]
  );

  const handleCardClick = useCallback(
    (relativePosition: number) => {
      if (relativePosition === 0) return;
      stopAutoPlay();
      const target =
        (activeIndex + relativePosition + reviews.length) % reviews.length;
      startTransition(() => setActiveIndex(target));
    },
    [activeIndex, reviews.length, stopAutoPlay]
  );

  const handleHoverStart = useCallback(
    (index: number) => {
      stopAutoPlay();
      if (!config.isMobile)
        startTransition(() => setHoveredIndex(index));
    },
    [config.isMobile, stopAutoPlay]
  );
  const handleHoverEnd = useCallback(() => {
    startTransition(() => {
      setHoveredIndex(null);
      setIsAutoPlaying(true);
    });
  }, []);

  /* Drag handlers */
  const handleDragStart = useCallback(() => {
    stopAutoPlay();
    startTransition(() => setIsDragging(true));
  }, [stopAutoPlay]);

  const handleDragEnd = useCallback(
    (
      _event: MouseEvent | TouchEvent | PointerEvent,
      info: { velocity: { x: number }; offset: { x: number } }
    ) => {
      startTransition(() => setIsDragging(false));
      const threshold = 50;
      if (
        Math.abs(info.offset.x) > threshold ||
        Math.abs(info.velocity.x) > 500
      ) {
        if (info.offset.x > 0 || info.velocity.x > 500) goToPrev();
        else if (info.offset.x < 0 || info.velocity.x < -500) goToNext();
      }
    },
    [goToNext, goToPrev]
  );

  return (
    <section className="py-10 md:py-14 w-full bg-[#fffff1]">
      {/* Title */}
      <h2 className="pointer-events-none px-6 py-4 text-center font-display font-light text-display-sm md:text-display-md text-neutral-900 text-balance">
        Here Is What Our Users Have To Say About Us.
      </h2>
      <div className="h-px w-24 bg-offhanded-accent/40 mx-auto mb-2" />

      {/* 3D Carousel Container */}
      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: "100%",
          minHeight: `${config.minHeight}px`,
          overflow: "hidden",
          backgroundColor: "transparent",
          userSelect: "none",
        }}
      >
        {/* Navigation Arrows — top right */}
        <div
          style={{
            position: "absolute",
            top: "16px",
            right: "24px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            zIndex: 1000,
          }}
        >
          <button
            onClick={goToPrev}
            aria-label="Previous slide"
            style={{
              padding: `${buttonPadding}px`,
              borderRadius: "9999px",
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "1px solid rgba(0, 0, 0, 0.1)",
              color: "rgba(17, 17, 17, 0.85)",
              cursor: "pointer",
              transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#2D3E30";
              e.currentTarget.style.color = "#FFFFFF";
              e.currentTarget.style.transform = "scale(1.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
              e.currentTarget.style.color = "rgba(17, 17, 17, 0.85)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <svg
              width={iconSize}
              height={iconSize}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            aria-label="Next slide"
            style={{
              padding: `${buttonPadding}px`,
              borderRadius: "9999px",
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "1px solid rgba(0, 0, 0, 0.1)",
              color: "rgba(17, 17, 17, 0.85)",
              cursor: "pointer",
              transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#2D3E30";
              e.currentTarget.style.color = "#FFFFFF";
              e.currentTarget.style.transform = "scale(1.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
              e.currentTarget.style.color = "rgba(17, 17, 17, 0.85)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <svg
              width={iconSize}
              height={iconSize}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* 3D Cards Stage */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            minHeight: `${config.minHeight}px`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            perspective: `${config.perspective}px`,
            transformStyle: "preserve-3d",
            overflow: "visible",
            isolation: "isolate",
            transform: `translateX(${reviews.length % 2 === 0 ? config.cardSpacing / 2 : 0}px)`
          }}
        >
          {reviews.map((review, index) => {
            const position = positions[index];
            if (!position) return null;
            const isHovered = hoveredIndex === index;

            return (
              <motion.div
                key={`${review.name}-${index}`}
                role="button"
                tabIndex={0}
                aria-label={`Card ${index + 1} of ${reviews.length}. ${position.isCenter ? "Active" : "Click to view"}`}
                drag={position.isCenter ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onClick={() =>
                  !isDragging &&
                  handleCardClick(position.relativePosition)
                }
                onHoverStart={() => handleHoverStart(index)}
                onHoverEnd={handleHoverEnd}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCardClick(position.relativePosition);
                  }
                }}
                initial={false}
                animate={{
                  x: position.x,
                  y: isHovered ? position.y - 20 : position.y,
                  scale: isHovered
                    ? position.scale * 1.04
                    : position.scale,
                  rotateY: position.rotateY,
                  opacity: position.opacity,
                  filter: `brightness(${position.brightness})`,
                  zIndex: position.zIndex,
                }}
                transition={{ type: "spring", ...SPRING_CONFIG }}
                style={{
                  position: "absolute",
                  width: `${config.cardWidth}px`,
                  height: `${cardHeight}px`,
                  borderRadius: "20px",
                  backgroundColor: "#000",
                  cursor: position.isCenter ? "grab" : "pointer",
                  backfaceVisibility: "hidden",
                  transformOrigin: "center bottom",
                  overflow: "hidden",
                  boxShadow:
                    "0px 18px 50px rgba(0, 0, 0, 0.18), 0px 6px 18px rgba(0, 0, 0, 0.12)",
                  willChange: "transform",
                }}
                whileDrag={{ cursor: "grabbing" }}
              >
                <VideoCardInner
                  review={review}
                  isCenter={position.isCenter}
                  isHovered={isHovered}
                  isAnyHovered={hoveredIndex !== null}
                  config={config}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Pagination Dots */}
        <div
          style={{
            position: "absolute",
            bottom: config.isMobile ? "16px" : "32px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: config.isMobile ? "5px" : "7px",
            zIndex: 1000,
          }}
        >
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={
                index === activeIndex ? "true" : "false"
              }
              style={{
                width:
                  index === activeIndex
                    ? config.isMobile
                      ? "16px"
                      : "22px"
                    : config.isMobile
                      ? "5px"
                      : "7px",
                height: config.isMobile ? "5px" : "7px",
                borderRadius: "9999px",
                border: "none",
                background:
                  index === activeIndex
                    ? "#2D3E30"
                    : "rgba(138, 138, 138, 0.3)",
                cursor: "pointer",
                transition: "all 300ms",
                padding: 0,
              }}
              onMouseEnter={(e) => {
                if (index !== activeIndex)
                  e.currentTarget.style.background =
                    "rgba(138, 138, 138, 0.6)";
              }}
              onMouseLeave={(e) => {
                if (index !== activeIndex)
                  e.currentTarget.style.background =
                    "rgba(138, 138, 138, 0.3)";
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
