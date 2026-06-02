export type Category = "rings" | "necklaces" | "earrings" | "bracelets";

export type JewelryItem = {
  id: string;
  name: string;
  category: Category;
  price: string;
  materials: string;
  image: string;
  span?: "tall" | "wide" | "normal";
};

// Real Unsplash jewelry photographs (loaded via images.unsplash.com).
// All are free for editorial / commercial use under the Unsplash license.
export const jewelry: JewelryItem[] = [
  {
    id: "celeste",
    name: "Céleste",
    category: "rings",
    price: "On request",
    materials: "18K Gold · 1.2ct Diamond",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80",
    span: "tall",
  },
  {
    id: "lumiere",
    name: "Lumière",
    category: "necklaces",
    price: "On request",
    materials: "18K Gold · Sapphire pendant",
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "aurore",
    name: "Aurore",
    category: "earrings",
    price: "On request",
    materials: "18K Gold · Pearl drops",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80",
    span: "tall",
  },
  {
    id: "etoile",
    name: "Étoile",
    category: "bracelets",
    price: "On request",
    materials: "18K Gold · Diamond pavé",
    image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=1200&q=80",
    span: "wide",
  },
  {
    id: "soleil",
    name: "Soleil",
    category: "rings",
    price: "On request",
    materials: "18K Yellow Gold · Citrine",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "nuit",
    name: "Nuit",
    category: "necklaces",
    price: "On request",
    materials: "18K Gold · Black Onyx",
    image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1200&q=80",
    span: "tall",
  },
  {
    id: "rosee",
    name: "Rosée",
    category: "earrings",
    price: "On request",
    materials: "18K Rose Gold · Diamond studs",
    image: "https://images.unsplash.com/photo-1633934542430-0905ccb5f050?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "saphir",
    name: "Saphir",
    category: "rings",
    price: "On request",
    materials: "Platinum · 2.0ct Sapphire",
    image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=1200&q=80",
    span: "wide",
  },
  {
    id: "minuit",
    name: "Minuit",
    category: "bracelets",
    price: "On request",
    materials: "18K Gold · Emerald links",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "venus",
    name: "Vénus",
    category: "necklaces",
    price: "On request",
    materials: "18K Gold · Diamond solitaire",
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1200&q=80",
    span: "tall",
  },
  {
    id: "aria",
    name: "Aria",
    category: "earrings",
    price: "On request",
    materials: "18K Gold · Pavé hoops",
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "perle",
    name: "Perle",
    category: "rings",
    price: "On request",
    materials: "18K Gold · South Sea Pearl",
    image: "https://images.unsplash.com/photo-1535556116002-6281ff3e9f36?auto=format&fit=crop&w=1200&q=80",
  },
];

export const categories: { id: "all" | Category; label: string }[] = [
  { id: "all", label: "All" },
  { id: "rings", label: "Rings" },
  { id: "necklaces", label: "Necklaces" },
  { id: "earrings", label: "Earrings" },
  { id: "bracelets", label: "Bracelets" },
];
