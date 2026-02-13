/* ========================================
   TESTIMONIALS DATA
   Customer reviews and feedback
======================================== */

export interface Testimonial {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  review: string;
  workshopType: string;
  date: string;
  featured: boolean;
}

export const testimonials: Testimonial[] = [
  {
    id: "t-001",
    name: "Priya Sharma",
    rating: 5,
    review:
      "The pottery workshop was absolutely magical! I've never felt so relaxed and creative at the same time..",
    workshopType: "Pottery Texture Art",
    date: "2024-01-28",
    featured: true,
  },
  {
    id: "t-002",
    name: "Arjun Mehta",
    rating: 5,
    review:
      "My wife and I attended the canvas art session for our anniversary.",
    workshopType: "Canvas Art",
    date: "2024-01-20",
    featured: true,
  },
  {
    id: "t-003",
    name: "Sneha Kapoor",
    rating: 5,
    review:
      "I organized a birthday party for my daughter at Offhanded. ",
    workshopType: "Bento Cake Painting",
    date: "2024-01-15",
    featured: true,
  },
  {
    id: "t-004",
    name: "Vikram Singh",
    rating: 5,
    review:
      "Our corporate team loved the rope on canvas workshop. ",
    workshopType: "Rope on Canvas",
    date: "2024-01-10",
    featured: false,
  },
  {
    id: "t-005",
    name: "Ananya Reddy",
    rating: 5,
    review:
      "The punch needle session was so therapeutic! I've found my new hobb.",
    workshopType: "Punch Needle Art",
    date: "2024-01-05",
    featured: true,
  },
  {
    id: "t-006",
    name: "Rohit Gupta",
    rating: 5,
    review:
      "As someone with zero art background, I was nervous.",
    workshopType: "Acrylic Art",
    date: "2023-12-28",
    featured: false,
  },
];
