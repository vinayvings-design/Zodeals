// Icon library shown in the Add / Edit Category form.
// Every icon is a PNG in /public/category-icons, drawn in the ZoDeals brand blue.
export const ICON_LIBRARY = [
  {
    "key": "car",
    "label": "Car"
  },
  {
    "key": "smartphone",
    "label": "Smartphone"
  },
  {
    "key": "camera",
    "label": "Camera"
  },
  {
    "key": "shopping-cart",
    "label": "Shopping Cart"
  },
  {
    "key": "shirt",
    "label": "Shirt"
  },
  {
    "key": "footprints",
    "label": "Footprints"
  },
  {
    "key": "gem",
    "label": "Gem"
  },
  {
    "key": "shopping-basket",
    "label": "Shopping Basket"
  },
  {
    "key": "landmark",
    "label": "Landmark"
  },
  {
    "key": "shield-check",
    "label": "Shield Check"
  },
  {
    "key": "forklift",
    "label": "Forklift"
  },
  {
    "key": "pill",
    "label": "Pill"
  },
  {
    "key": "stethoscope",
    "label": "Stethoscope"
  },
  {
    "key": "leaf",
    "label": "Leaf"
  },
  {
    "key": "flame",
    "label": "Flame"
  },
  {
    "key": "house",
    "label": "House"
  },
  {
    "key": "sofa",
    "label": "Sofa"
  },
  {
    "key": "lamp",
    "label": "Lamp"
  },
  {
    "key": "cooking-pot",
    "label": "Cooking Pot"
  },
  {
    "key": "wrench",
    "label": "Wrench"
  },
  {
    "key": "sparkles",
    "label": "Sparkles"
  },
  {
    "key": "bed-double",
    "label": "Bed Double"
  },
  {
    "key": "utensils",
    "label": "Utensils"
  },
  {
    "key": "cake",
    "label": "Cake"
  },
  {
    "key": "concierge-bell",
    "label": "Concierge Bell"
  },
  {
    "key": "plane",
    "label": "Plane"
  },
  {
    "key": "car-taxi-front",
    "label": "Car Taxi Front"
  },
  {
    "key": "ticket",
    "label": "Ticket"
  },
  {
    "key": "heart-handshake",
    "label": "Heart Handshake"
  },
  {
    "key": "printer",
    "label": "Printer"
  },
  {
    "key": "graduation-cap",
    "label": "Graduation Cap"
  },
  {
    "key": "package",
    "label": "Package"
  },
  {
    "key": "radio-tower",
    "label": "Radio Tower"
  },
  {
    "key": "gamepad-2",
    "label": "Gamepad2"
  },
  {
    "key": "dumbbell",
    "label": "Dumbbell"
  },
  {
    "key": "gift",
    "label": "Gift"
  },
  {
    "key": "briefcase",
    "label": "Briefcase"
  },
  {
    "key": "music",
    "label": "Music"
  },
  {
    "key": "book-open",
    "label": "Book Open"
  },
  {
    "key": "coffee",
    "label": "Coffee"
  },
  {
    "key": "pizza",
    "label": "Pizza"
  },
  {
    "key": "baby",
    "label": "Baby"
  },
  {
    "key": "paw-print",
    "label": "Paw Print"
  },
  {
    "key": "store",
    "label": "Store"
  },
  {
    "key": "wallet",
    "label": "Wallet"
  },
  {
    "key": "credit-card",
    "label": "Credit Card"
  },
  {
    "key": "fuel",
    "label": "Fuel"
  },
  {
    "key": "bike",
    "label": "Bike"
  },
  {
    "key": "bus",
    "label": "Bus"
  },
  {
    "key": "hammer",
    "label": "Hammer"
  },
  {
    "key": "tag",
    "label": "Tag"
  },
  {
    "key": "percent",
    "label": "Percent"
  },
  {
    "key": "heart",
    "label": "Heart"
  },
  {
    "key": "laptop",
    "label": "Laptop"
  },
  {
    "key": "tv",
    "label": "Tv"
  },
  {
    "key": "headphones",
    "label": "Headphones"
  },
  {
    "key": "glasses",
    "label": "Glasses"
  },
  {
    "key": "wine",
    "label": "Wine"
  },
  {
    "key": "plug",
    "label": "Plug"
  },
  {
    "key": "truck",
    "label": "Truck"
  },
  {
    "key": "cpu",
    "label": "Cpu"
  },
  {
    "key": "watch",
    "label": "Watch"
  },
  {
    "key": "building",
    "label": "Building"
  },
  {
    "key": "hotel",
    "label": "Hotel"
  },
  {
    "key": "church",
    "label": "Church"
  },
  {
    "key": "sprout",
    "label": "Sprout"
  },
  {
    "key": "flower",
    "label": "Flower"
  },
  {
    "key": "tractor",
    "label": "Tractor"
  },
  {
    "key": "bed",
    "label": "Bed"
  },
  {
    "key": "party-popper",
    "label": "Party Popper"
  }
];

export const iconUrl = (key) => `${process.env.PUBLIC_URL || ''}/category-icons/${key}.png`;

// Fetches an icon PNG and returns it as a File, ready to upload exactly like a picked image.
export const iconToFile = async (key, name) => {
  const res = await fetch(iconUrl(key));
  if (!res.ok) throw new Error('Icon not found');
  const blob = await res.blob();
  return new File([blob], `${name || key}.png`, { type: 'image/png' });
};
