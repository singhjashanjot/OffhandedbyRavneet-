import { workshopCategories } from "./categories";

export interface Workshop {
  id: string;
  slug?: string;
  categoryId: string;
  title: string;
  description: string;
  image: string;
  card_image?: string;
  price: number;
  date: string;
  time: string;
  location: string;
  venue: string;
  instructor: string;
  availableSeats: number;
  duration: string;
  endTime?: string;
}

export const upcomingWorkshops: Workshop[] = [
  {
    id: "pottery-intro-jun-24",
    categoryId: "pottery",
    title: "Introduction to Pottery Texture Art",
    description: "Mold, shape, and create beautiful textured pottery pieces in a calming session.",
    image: "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636491/IMG_5555_aevxtd.heic",
    price: 1499,
    date: "2024-06-24",
    time: "11:00 AM",
    endTime: "1:30 PM",
    location: "Sanskriti Kendra, Delhi",
    venue: "Studio 1, Main Building",
    instructor: "Aditi S.",
    availableSeats: 8,
    duration: "2.5 Hours",
  },
  {
    id: "canvas-painting-jun-25",
    categoryId: "canvas",
    title: "Expressive Canvas Painting",
    description: "Express yourself on canvas with guided acrylic painting techniques.",
    image: "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631430/IMG_3254_vjcfvh.heic",
    price: 1299,
    date: "2024-06-25",
    time: "4:00 PM",
    endTime: "6:00 PM",
    location: "Dhan Mill Compound, Delhi",
    venue: "Art Hub",
    instructor: "Rajesh K.",
    availableSeats: 12,
    duration: "2 Hours",
  },
  {
    id: "clay-mirror-jul-08",
    categoryId: "clay-mirror",
    title: "Clay Mirror Art Workshop",
    description: "Create intricate cultural designs with clay and mirrors.",
    image: "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631445/IMG_6955_dacuj6.heic",
    price: 1599,
    date: "2024-07-08",
    time: "2:00 PM",
    endTime: "5:00 PM",
    location: "Sanskriti Kendra, Delhi",
    venue: "Workshop Area B",
    instructor: "Priya M.",
    availableSeats: 5,
    duration: "3 Hours",
  },
];

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' };
  return new Date(dateString).toLocaleDateString("en-IN", options);
};
