"use client";

import { testimonials } from "@/data";
import { useMemo } from "react";

/* ========================================
   TESTIMONIALS SECTION
   Customer reviews and feedback
======================================== */

type Review = {
  name: string;
  username: string;
  body: string;
  img: string;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface MarqueeProps {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children?: React.ReactNode;
  vertical?: boolean;
  repeat?: number;
}

function Marquee({
  className,
  reverse,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
}: MarqueeProps) {
  return (
    <div
      className={cn(
        "group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]",
        !vertical && "flex-row",
        vertical && "flex-col",
        className
      )}
    >
      {Array(repeat)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className={cn(
              "flex shrink-0 justify-around [gap:var(--gap)]",
              !vertical && "animate-marquee flex-row",
              vertical && "animate-marquee-vertical flex-col",
              pauseOnHover && "group-hover:[animation-play-state:paused]",
              reverse && "[animation-direction:reverse]"
            )}
          >
            {children}
          </div>
        ))}
    </div>
  );
}

function shuffleArray(array: Review[]): Review[] {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function ReviewCard({ img, name, username, body }: Review) {
  return (
    <figure
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        "border-gray-950/[.1] bg-[#FFFFF5] hover:bg-[#FFFFF5]"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt={name} src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium text-black">{name}</figcaption>
          <p className="text-xs font-medium text-[#78716C]">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm text-black">{body}</blockquote>
    </figure>
  );
}

export function TestimonialsSection() {
  const reviews = useMemo<Review[]>(
    () =>
      testimonials.map((testimonial) => {
        const username = `@${testimonial.name.toLowerCase().replace(/\s+/g, "")}`;
        const img =
          testimonial.avatar ||
          `https://avatar.vercel.sh/${encodeURIComponent(
            testimonial.name.toLowerCase().replace(/\s+/g, "")
          )}`;

        return {
          name: testimonial.name,
          username,
          body: testimonial.review,
          img,
        };
      }),
    []
  );

  const { firstRow, secondRow } = useMemo(() => {
    const shuffledReviews = shuffleArray([...reviews]);
    const midpoint = Math.ceil(shuffledReviews.length / 2);
    return {
      firstRow: shuffledReviews.slice(0, midpoint),
      secondRow: shuffledReviews.slice(midpoint),
    };
  }, [reviews]);

  return (
    <section className="py-24 w-full bg-[#fffff1]">
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-[#fffff1]">
        <h2 className="pointer-events-none px-6 py-10 text-center font-display text-display-sm md:text-display-md text-neutral-900 text-balance">
          Here Is What Our Users Have To Say About Us.
        </h2>

        <Marquee pauseOnHover className="[--duration:20s]">
          {firstRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:20s]">
          {secondRow.map((review) => (
            <ReviewCard key={`${review.username}-reverse`} {...review} />
          ))}
        </Marquee>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#fffff1]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-[#fffff1]" />
      </div>
    </section>
  );
}
