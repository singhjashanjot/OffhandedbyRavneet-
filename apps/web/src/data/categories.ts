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
      "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636491/IMG_5555_aevxtd.heic",
      "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636490/IMG_2774_zvfqy7.heic",
      "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636490/IMG_0627_mqmp5e.heic",
      "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636490/IMG_6955_qypkz3.heic"
    ],
    whatWeDo: [
      "Introduction to clay types and handling",
      "Learning slab and pinch pot techniques",
      "Exploring texture through stamping and carving",
      "Creating your own unique textured masterpiece"
    ],
    image: "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636491/IMG_5555_aevxtd.heic",
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
      "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631430/IMG_3254_vjcfvh.heic",
      "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636489/IMG_5521_qdzurw.heic",
      "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636488/IMG_5556_swiq5g.heic",
      "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636486/IMG_1987_hb6ecj.heic"
    ],
    whatWeDo: [
      "Color theory and mixing basics",
      "Brush handling and techniques",
      "Composition and layout planning",
      "Guided painting of a themed subject"
    ],
    image: "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631430/IMG_3254_vjcfvh.heic",
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
      "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631445/IMG_6955_dacuj6.heic",
      "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636417/IMG_8310_yojqor.heic"
    ],
    whatWeDo: [
      "Preparation of clay dough",
      "Rolling and shaping techniques",
      "Creating traditional patterns",
      "Embedding mirrors and finishing"
    ],
    image: "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631445/IMG_6955_dacuj6.heic",
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
      "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631433/IMG_0497_rinstb.heic",
      "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636416/IMG_8301_b3dqiw.heic",
      "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636390/IMG_8297_ivhitf.heic"
    ],
    whatWeDo: [
      "Exploring acrylic mediums and additives",
      "Layering and glazing techniques",
      "Creating texture with palette knives",
      "Abstract and realist approaches"
    ],
    image: "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631433/IMG_0497_rinstb.heic",
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
      "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631396/IMG_5184_h8wfsi.heic",
      "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636390/IMG_8298_kvuhbm.heic"
    ],
    whatWeDo: [
       "Techniques for manipulating rope",
       "Using rope as a painting tool",
       "Combining fiber elements with paint",
       "Creating rhythmic patterns"
    ],
    image: "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631396/IMG_5184_h8wfsi.heic",
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
      "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631448/IMG_1467_hf5f8c.heic",
      "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636491/IMG_5555_aevxtd.heic"
    ],
     whatWeDo: [
      "Introduction to texture pastes",
      "Palette knife techniques",
      "Creating relief patterns",
      "Layering and composition"
    ],
    image: "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779631448/IMG_1467_hf5f8c.heic",
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
      "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636490/IMG_2774_zvfqy7.heic",
      "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636490/IMG_0627_mqmp5e.heic"
    ],
    whatWeDo: [
      "Preparing jute surface for painting",
      "Fabric painting techniques",
      "Design transfer on textured fabric",
      "Sealing and care instructions"
    ],
    image: "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636490/IMG_2774_zvfqy7.heic",
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
      "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636490/IMG_6955_qypkz3.heic",
      "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636489/IMG_5521_qdzurw.heic"
    ],
    whatWeDo: [
      "Mixing edible paints",
      "Brush techniques for delicate surfaces",
      "Floral and geometric designs on cake",
      "Finishing touches for a professional look"
    ],
    image: "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636490/IMG_6955_qypkz3.heic",
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
      "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636488/IMG_5556_swiq5g.heic",
      "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636486/IMG_1987_hb6ecj.heic"
    ],
    whatWeDo: [
      "Working with small scale cakes",
      "Piping text and borders",
      "Simple illustrative painting",
      "Packaging your bento cake"
    ],
    image: "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636488/IMG_5556_swiq5g.heic",
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
      "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636417/IMG_8310_yojqor.heic",
      "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636416/IMG_8301_b3dqiw.heic"
    ],
    whatWeDo: [
      "Setting up the punch needle frame",
      "Threading and loop techniques",
      "Pattern transfer and design",
      "Finishing and backing your piece"
    ],
    image: "https://res.cloudinary.com/daoho0jwj/image/upload/c_scale,w_800,f_auto,q_auto/v1779636417/IMG_8310_yojqor.heic",
    color: "accent-punch",
    price: "₹1,699",
    duration: "3 Hours",
    level: "Beginner Friendly",
    nextSlot: "Sun, 16 Jul • 2:00 PM",
    location: "Sanskriti Kendra, Delhi"
  },
];
