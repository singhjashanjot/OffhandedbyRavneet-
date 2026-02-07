/* ========================================
   WORKSHOP CATEGORIES DATA
   Static data for workshop category display
======================================== */

export interface WorkshopCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  galleryImages?: string[];
  whatWeDo?: string[];
  image: string;
  color: string;
  // Booking Details
  price: string;
  duration: string;
  level: string;
  nextSlot: string;
  location: string;
}

export const workshopCategories: WorkshopCategory[] = [
  {
    id: "pottery",
    name: "Pottery Texture Art",
    slug: "pottery-texture",
    description: "Mold, shape, and create beautiful textured pottery pieces in a calming session.",
    longDescription: "Immerse yourself in the tactile world of pottery texture art. This experience invites you to slow down and connect with the earth through clay. You will learn various hand-building techniques to simple vessels or abstract forms, focusing on surface texture and organic shapes. Using range of tools and found objects, you'll stamp, carve, and impress unique patterns into your creation. It is not just about making a pot; it's about the therapeutic rhythm of working with your hands.",
    galleryImages: [
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80",
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80",
      "https://images.unsplash.com/photo-1522775559573-2f63d04af08f?w=800&q=80",
      "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=800&q=80"
    ],
    whatWeDo: [
      "Introduction to clay types and handling",
      "Learning slab and pinch pot techniques",
      "Exploring texture through stamping and carving",
      "Creating your own unique textured masterpiece"
    ],
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80",
    color: "accent-pottery",
    price: "₹1,499",
    duration: "2.5 Hours",
    level: "Beginner Friendly",
    nextSlot: "Sat, 24 Jun • 11:00 AM",
    location: "Sanskriti Kendra, Delhi"
  },
  {
    id: "canvas",
    name: "Canvas Painting",
    slug: "canvas-painting",
    description: "Express yourself on canvas with guided acrylic painting techniques.",
    longDescription: "Unleash your inner artist with our guided canvas painting sessions. Whether you are a beginner or a seasoned painter, our instructors will walk you through the process of creating a stunning piece of art. We focus on color blending, brushwork, and composition, allowing you to explore your creativity in a supportive environment. Leave with a finished painting and a newfound confidence in your artistic abilities.",
    galleryImages: [
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80",
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80",
      "https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?w=800&q=80",
       "https://images.unsplash.com/photo-1563603357954-e41b08168662?w=800&q=80"
    ],
    whatWeDo: [
      "Color theory and mixing basics",
      "Brush handling and techniques",
      "Composition and layout planning",
      "Guided painting of a themed subject"
    ],
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&q=80",
    color: "accent-canvas",
    price: "₹1,299",
    duration: "2 Hours",
    level: "All Levels",
    nextSlot: "Sun, 25 Jun • 4:00 PM",
    location: "Dhan Mill Compound, Delhi"
  },
  {
    id: "clay-mirror",
    name: "Clay Mirror Painting",
    slug: "clay-mirror-painting",
    description: "Create intricate cultural designs with clay and mirrors.",
    longDescription: "Explore the traditional art of Lippan Kaam (Mud and Mirror Work) in this therapeutic workshop. You will learn to knead clay, roll varying thicknesses, and create geometric or freehand patterns on a board. The final touch involves embedding small mirrors (abhla) to catch the light, creating a stunning piece of wall decor that blends rustic charm with sparkling elegance.",
    galleryImages: [
      "https://images.unsplash.com/photo-1522775559573-2f63d04af08f?w=800&q=80",
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80"
    ],
    whatWeDo: [
      "Preparation of clay dough",
      "Rolling and shaping techniques",
      "Creating traditional patterns",
      "Embedding mirrors and finishing"
    ],
    image: "https://images.unsplash.com/photo-1522775559573-2f63d04af08f?w=600&q=80",
    color: "accent-pottery",
    price: "₹1,599",
    duration: "3 Hours",
    level: "Beginner Friendly",
    nextSlot: "Sat, 08 Jul • 2:00 PM",
    location: "Sanskriti Kendra, Delhi"
  },
  {
    id: "acrylic",
    name: "Acrylic Art",
    slug: "acrylic-art",
    description: "Dive into vibrant acrylic art with step-by-step creative guidance.",
    longDescription: "Discover the versatility of acrylic paints in this dynamic workshop. We explore modern techniques such as pouring, layering, and glazing to create vibrant, abstract, or realist works. This session is perfect for those who love bold colors and want to experiment with different mediums and styles.",
    galleryImages: [
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80",
      "https://images.unsplash.com/photo-1582201942988-13e60e4556ee?w=800&q=80",
      "https://images.unsplash.com/photo-1501472312651-726afe119ff1?w=800&q=80"
    ],
    whatWeDo: [
      "Exploring acrylic mediums and additives",
      "Layering and glazing techniques",
      "Creating texture with palette knives",
      "Abstract and realist approaches"
    ],
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80",
    color: "accent-canvas",
    price: "₹1,299",
    duration: "2 Hours",
    level: "Intermediate",
    nextSlot: "Sat, 01 Jul • 11:00 AM",
    location: "Commons at DLF Avenue"
  },
  {
    id: "rope",
    name: "Rope Painting",
    slug: "rope-painting",
    description: "A unique textile art form combining rope patterns with paint.",
    longDescription: "Combine fiber art with painting in this unique workshop. We use ropes and cords as both stamp tools and potential textural elements on the canvas. The result is a fascinating interplay of structured lines and fluid color, creating organic, rhythm-filled compositions.",
    galleryImages: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      "https://images.unsplash.com/photo-1627916578491-92524a87c1cb?w=800&q=80"
    ],
    whatWeDo: [
       "Techniques for manipulating rope",
       "Using rope as a painting tool",
       "Combining fiber elements with paint",
       "Creating rhythmic patterns"
    ],
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    color: "accent-rope",
    price: "₹1,599",
    duration: "2.5 Hours",
    level: "Beginner Friendly",
    nextSlot: "Sun, 02 Jul • 3:00 PM",
    location: "Sanskriti Kendra, Delhi"
  },
  {
    id: "textured-art",
    name: "Textured Art",
    slug: "textured-art",
    description: "Create depth and dimension using various texturing pastes and tools.",
    longDescription: "Dive into the world of modern textured art. In this workshop, you will move beyond flat surfaces to create tactile, 3D art pieces. Using texture pastes, palette knives, and various unconventional tools (like combs, sponges, and stencils), you'll learn to build layers and create interesting relief effects on canvas. It is a minimalistic yet highly expressive art form.",
    galleryImages: [
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80",
      "https://images.unsplash.com/photo-1520698188164-8974a683ec24?w=800&q=80"
    ],
     whatWeDo: [
      "Introduction to texture pastes",
      "Palette knife techniques",
      "Creating relief patterns",
      "Layering and composition"
    ],
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80",
    color: "accent-rope",
    price: "₹1,699",
    duration: "3 Hours",
    level: "All Levels",
    nextSlot: "Sat, 08 Jul • 11:00 AM",
    location: "Studio Offhanded, HKV"
  },
  {
    id: "jute-bag",
    name: "Jute Bag Painting",
    slug: "jute-bag-painting",
    description: "Customize eco-friendly jute bags with your own hand-painted designs.",
    longDescription: "Merge sustainability with style in our Jute Bag Painting workshop. Learn how to paint on the coarse texture of jute fabric using specialized fabric colors. You can create botanicals, abstracts, or mandalas to turn a simple tote bag into a personalized fashion statement. It's functional art that you can carry with you every day.",
    galleryImages: [
      "https://images.unsplash.com/photo-1596541538350-df4a6a57548a?w=800&q=80",
      "https://images.unsplash.com/photo-1501472312651-726afe119ff1?w=800&q=80"
    ],
    whatWeDo: [
      "Preparing jute surface for painting",
      "Fabric painting techniques",
      "Design transfer on textured fabric",
      "Sealing and care instructions"
    ],
    image: "https://images.unsplash.com/photo-1501472312651-726afe119ff1?w=600&q=80",
    color: "accent-rope",
    price: "₹1,199",
    duration: "2 Hours",
    level: "Beginner Friendly",
    nextSlot: "Sun, 16 Jul • 4:00 PM",
    location: "Dhan Mill Compound, Delhi"
  },
  {
    id: "cake",
    name: "Cake Painting",
    slug: "cake-painting",
    description: "Decorate delicious cakes with artistic painting techniques.",
    longDescription: "Edible art at its finest! Learn to paint directly onto fondant or buttercream using edible food paints. Similar to water color or acrylic painting, but on a sweet canvas you can eat. Perfect for foodies and art lovers alike.",
    galleryImages: [
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80",
      "https://images.unsplash.com/photo-1626803775151-61d756612f97?w=800&q=80"
    ],
    whatWeDo: [
      "Mixing edible paints",
      "Brush techniques for delicate surfaces",
      "Floral and geometric designs on cake",
      "Finishing touches for a professional look"
    ],
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80",
    color: "accent-cake",
    price: "₹1,999",
    duration: "2.5 Hours",
    level: "Beginner Friendly",
    nextSlot: "Sun, 09 Jul • 12:00 PM",
    location: "Colocal Chocolates, Dhan Mill"
  },
  {
    id: "bento-cake",
    name: "Bento Cake Painting",
    slug: "bento-cake-painting",
    description: "Create adorable, Instagram-worthy mini bento cakes.",
    longDescription: "Join the trend of Bento Cakes! These lunchbox-sized mini cakes are perfect for practicing your piping and painting skills. Design a personalized message or a cute illustration on your petite treat.",
    galleryImages: [
      "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&q=80",
      "https://images.unsplash.com/photo-1586985289906-406988974504?w=800&q=80"
    ],
    whatWeDo: [
      "Working with small scale cakes",
      "Piping text and borders",
      "Simple illustrative painting",
      "Packaging your bento cake"
    ],
    image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&q=80",
    color: "accent-cake",
    price: "₹1,499",
    duration: "2 Hours",
    level: "All Levels",
    nextSlot: "Sat, 15 Jul • 10:00 AM",
    location: "Studio Offhanded, HKV"
  },
  {
    id: "punch-needle",
    name: "Punch Needle Art",
    slug: "punch-needle",
    description: "Learn the meditative craft of punch needle embroidery.",
    longDescription: "Experience the satisfaction of punch needle embroidery. It is like drawing with yarn! This loop-based technique is easy to learn and incredibly relaxing. You will create a textured wall hanging or coaster, choosing from a variety of colorful yarns.",
    galleryImages: [
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80",
      "https://images.unsplash.com/photo-1596541538350-df4a6a57548a?w=800&q=80"
    ],
    whatWeDo: [
      "Setting up the punch needle frame",
      "Threading and loop techniques",
      "Pattern transfer and design",
      "Finishing and backing your piece"
    ],
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80",
    color: "accent-punch",
    price: "₹1,699",
    duration: "3 Hours",
    level: "Beginner Friendly",
    nextSlot: "Sun, 16 Jul • 2:00 PM",
    location: "Sanskriti Kendra, Delhi"
  },
];
