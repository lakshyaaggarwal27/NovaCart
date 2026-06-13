import { products, type Product, type CategoryId } from "@/lib/products";

export type Recommendation = {
  text: string;
  products: Product[];
};

type CategoryMatch = { id: CategoryId; keywords: string[]; emoji: string; label: string };

const CATEGORIES: CategoryMatch[] = [
  { id: "laptops", emoji: "💻", label: "Laptops", keywords: ["laptop", "notebook", "macbook", "ultrabook", "coding", "programming", "developer", "work", "student"] },
  { id: "smartphones", emoji: "📱", label: "Smartphones", keywords: ["phone", "smartphone", "mobile", "iphone", "android", "pixel", "galaxy", "photography", "camera phone"] },
  { id: "watches", emoji: "⌚", label: "Smart Watches", keywords: ["watch", "smartwatch", "wearable", "fitness band", "fitness tracker"] },
  { id: "audio", emoji: "🎧", label: "Headphones & Audio", keywords: ["headphone", "headphones", "earbud", "earbuds", "audio", "music", "anc", "noise cancel", "airpods"] },
  { id: "gaming", emoji: "🎮", label: "Gaming", keywords: ["gaming", "console", "playstation", "ps5", "ps6", "xbox", "switch", "controller", "keyboard", "mouse", "vr", "handheld"] },
  { id: "cameras", emoji: "📷", label: "Cameras", keywords: ["camera", "mirrorless", "dslr", "photography gear", "lens"] },
  { id: "accessories", emoji: "🔌", label: "Accessories", keywords: ["accessory", "accessories", "charger", "cable", "dock", "hub", "powerbank", "ssd"] },
  { id: "smarthome", emoji: "🏠", label: "Smart Home", keywords: ["smart home", "smarthome", "thermostat", "doorbell", "robot vac", "homepod", "hue", "echo"] },
];

// Parse a budget out of the prompt — supports ₹50,000 / 50000 / 50k / 1.5L / 80 thousand
function parseBudget(q: string): number | null {
  const s = q.toLowerCase().replace(/[,₹\s]/g, "");
  // 1.5l or 2lakh
  const lakh = s.match(/(\d+(?:\.\d+)?)l(?:akh)?\b/);
  if (lakh) return Math.round(parseFloat(lakh[1]) * 100000);
  const k = s.match(/(\d+(?:\.\d+)?)k\b/);
  if (k) return Math.round(parseFloat(k[1]) * 1000);
  const under = s.match(/(?:under|below|less than|upto|up to|within|max)(\d{3,7})/);
  if (under) return parseInt(under[1], 10);
  const plain = s.match(/(\d{4,7})/);
  if (plain) return parseInt(plain[1], 10);
  return null;
}

function detectCategory(q: string): CategoryMatch | null {
  const lower = q.toLowerCase();
  let best: { cat: CategoryMatch; score: number } | null = null;
  for (const cat of CATEGORIES) {
    let score = 0;
    for (const kw of cat.keywords) if (lower.includes(kw)) score += kw.length;
    if (score > 0 && (!best || score > best.score)) best = { cat, score };
  }
  return best?.cat ?? null;
}

function rank(list: Product[], budget: number | null, intent: "trending" | "top" | "default"): Product[] {
  const popMax = Math.max(...list.map((p) => p.reviews), 1);
  return [...list]
    .map((p) => {
      const ratingScore = (p.rating / 5) * 50;
      const popScore = (p.reviews / popMax) * 25;
      const trendingBoost =
        intent === "trending"
          ? (p.badge === "Trending" ? 25 : p.badge === "Best Seller" ? 18 : p.badge === "Flash" ? 12 : 0)
          : 0;
      const topBoost = intent === "top" ? (p.rating >= 4.7 ? 15 : 0) : 0;
      const budgetFit = budget && p.price <= budget ? Math.max(0, 15 - ((budget - p.price) / budget) * 15) : 0;
      return { p, score: ratingScore + popScore + trendingBoost + topBoost + budgetFit };
    })
    .sort((a, b) => b.score - a.score)
    .map((x) => x.p);
}

export function recommend(query: string): Recommendation | null {
  const q = query.toLowerCase().trim();
  if (!q) return null;

  const isTrending = /trend|hot|popular|bestseller|best seller|featured/.test(q);
  const isTopRated = /top.?rated|highest rated|best rated|top rating/.test(q);
  const isRecoIntent =
    isTrending ||
    isTopRated ||
    /\b(best|recommend|suggest|show|find|need|looking for|good|cheap|affordable|under|below|within|for)\b/.test(q);

  const cat = detectCategory(q);
  const budget = parseBudget(q);

  if (!cat && !isTrending && !isTopRated) return null;
  if (!cat && (isTrending || isTopRated)) {
    // global trending/top
    const intent = isTrending ? "trending" : "top";
    const ranked = rank(products, null, intent).slice(0, 3);
    const header = isTrending ? "🔥 Trending on NovaCart" : "🏆 Top Rated on NovaCart";
    return { text: header, products: ranked };
  }
  if (!cat) return null;
  if (!isRecoIntent && !budget) return null;

  let pool = products.filter((p) => p.category === cat.id);
  if (budget) pool = pool.filter((p) => p.price <= budget);

  const intent = isTrending ? "trending" : isTopRated ? "top" : "default";
  let ranked = rank(pool, budget, intent).slice(0, 3);

  if (ranked.length === 0 && budget) {
    // graceful fallback: cheapest in category
    const cheapest = [...products.filter((p) => p.category === cat.id)].sort((a, b) => a.price - b.price).slice(0, 3);
    return {
      text: `${cat.emoji} I couldn't find ${cat.label} under ₹${budget.toLocaleString("en-IN")}. Here are the most affordable options instead:`,
      products: cheapest,
    };
  }

  const budgetTxt = budget ? ` under ₹${budget.toLocaleString("en-IN")}` : "";
  const text = `${cat.emoji} Top ${cat.label}${budgetTxt} for you`;
  return { text, products: ranked };
}
