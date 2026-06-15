import { products, type Product } from "./products";

export type CompareSummary = {
  label: string;
  emoji: string;
  winner: string; // product id
  reason: string;
};

export type Comparison = {
  text: string;
  products: Product[]; // exactly 2
  rows: { key: string; a: string; b: string }[];
  summary: CompareSummary[];
};

export type CompareResult =
  | { ok: true; comparison: Comparison }
  | { ok: false; text: string };

const STOP = new Set([
  "compare", "vs", "versus", "and", "with", "or", "the", "a", "an",
  "to", "between", "&", "of", "for", "please", "can", "you",
]);

function tokens(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t && !STOP.has(t));
}

function scoreMatch(segment: string[], product: Product): number {
  const target = new Set([
    ...tokens(product.title),
    ...tokens(product.brand),
  ]);
  let score = 0;
  for (const t of segment) {
    if (target.has(t)) score += 2;
    else {
      for (const w of target) {
        if (w.length >= 4 && (w.startsWith(t) || t.startsWith(w))) {
          score += 1;
          break;
        }
      }
    }
  }
  return score;
}

function findProductBySegment(segment: string[]): Product | null {
  if (segment.length === 0) return null;
  let best: { p: Product; s: number } | null = null;
  for (const p of products) {
    const s = scoreMatch(segment, p);
    if (s > 0 && (!best || s > best.s)) best = { p, s };
  }
  return best && best.s >= 2 ? best.p : null;
}

function splitQuery(q: string): string[][] {
  const cleaned = q.toLowerCase().replace(/^\s*compare\s+/i, "");
  // Split on common separators
  const parts = cleaned.split(/\s+(?:vs|versus|and|&|,|with)\s+|\s+v\/s\s+|\s*,\s*/);
  return parts.map((p) => tokens(p)).filter((t) => t.length > 0);
}

export function isCompareQuery(q: string): boolean {
  const lower = q.toLowerCase();
  if (/\bcompare\b/.test(lower)) return true;
  if (/\bvs\b|\bversus\b|\bv\/s\b/.test(lower)) return true;
  return false;
}

function specVal(p: Product, keys: string[]): string | null {
  for (const k of keys) {
    for (const sk of Object.keys(p.specs)) {
      if (sk.toLowerCase() === k.toLowerCase()) return p.specs[sk];
    }
  }
  return null;
}

function num(s: string | null): number | null {
  if (!s) return null;
  const m = s.match(/[\d.]+/);
  return m ? parseFloat(m[0]) : null;
}

function inr(n: number): string {
  return "₹" + n.toLocaleString("en-IN");
}

function buildRows(a: Product, b: Product): { key: string; a: string; b: string }[] {
  const rows: { key: string; a: string; b: string }[] = [
    { key: "Price", a: inr(a.price), b: inr(b.price) },
    { key: "MRP", a: inr(a.originalPrice), b: inr(b.originalPrice) },
    { key: "Rating", a: `${a.rating} ★ (${a.reviews})`, b: `${b.rating} ★ (${b.reviews})` },
    { key: "Brand", a: a.brand, b: b.brand },
    { key: "Category", a: a.category, b: b.category },
  ];
  const specKeys = [
    "Display", "Chip", "CPU", "GPU", "RAM", "Storage", "Camera",
    "Battery", "Sensor", "Video", "ANC", "Driver", "Codec", "Case", "Water",
  ];
  for (const k of specKeys) {
    const av = specVal(a, [k]);
    const bv = specVal(b, [k]);
    if (av || bv) rows.push({ key: k, a: av ?? "—", b: bv ?? "—" });
  }
  return rows;
}

function buildSummary(a: Product, b: Product): CompareSummary[] {
  const out: CompareSummary[] = [];

  // Best Overall — rating, tiebreak reviews
  const overall = a.rating === b.rating
    ? (a.reviews >= b.reviews ? a : b)
    : (a.rating > b.rating ? a : b);
  out.push({
    label: "Best Overall",
    emoji: "🏆",
    winner: overall.id,
    reason: `Higher rating (${overall.rating}★) with ${overall.reviews} reviews`,
  });

  // Best Value — better rating-per-rupee
  const valueA = a.rating / a.price;
  const valueB = b.rating / b.price;
  const value = valueA >= valueB ? a : b;
  out.push({
    label: "Best Value For Money",
    emoji: "💰",
    winner: value.id,
    reason: `Strong rating at a lower price (${inr(value.price)})`,
  });

  // Photography — if either has a Camera/Sensor spec
  const camA = num(specVal(a, ["Camera", "Sensor"]));
  const camB = num(specVal(b, ["Camera", "Sensor"]));
  if (camA !== null || camB !== null) {
    const photo = (camA ?? 0) >= (camB ?? 0) ? a : b;
    out.push({
      label: "Best For Photography",
      emoji: "📸",
      winner: photo.id,
      reason: `Higher MP camera (${specVal(photo, ["Camera", "Sensor"])})`,
    });
  }

  // Gaming — both must have GPU/Chip or be gaming/laptops/phones
  const gameCats = new Set(["gaming", "laptops", "smartphones"]);
  if (gameCats.has(a.category) && gameCats.has(b.category)) {
    const scoreGame = (p: Product) => {
      let s = 0;
      const gpu = specVal(p, ["GPU"]);
      if (gpu) s += 10 + (num(gpu) ?? 0) / 100;
      const disp = specVal(p, ["Display"]) ?? "";
      const hz = disp.match(/(\d+)\s?Hz/i);
      if (hz) s += parseInt(hz[1]) / 60;
      const chip = (specVal(p, ["Chip", "CPU"]) ?? "").toLowerCase();
      if (/elite|pro|i9|ryzen 9|m6 pro|zen 5/.test(chip)) s += 3;
      return s;
    };
    const sA = scoreGame(a);
    const sB = scoreGame(b);
    if (sA > 0 || sB > 0) {
      const gamer = sA >= sB ? a : b;
      out.push({
        label: "Best For Gaming",
        emoji: "🎮",
        winner: gamer.id,
        reason: `Stronger graphics & refresh rate`,
      });
    }
  }

  // Productivity — laptops, or things with RAM/Battery
  if (a.category === "laptops" && b.category === "laptops") {
    const scoreProd = (p: Product) => {
      const ram = num(specVal(p, ["RAM"])) ?? 0;
      const bat = num(specVal(p, ["Battery"])) ?? 0;
      return ram + bat / 5;
    };
    const prod = scoreProd(a) >= scoreProd(b) ? a : b;
    out.push({
      label: "Best For Productivity",
      emoji: "👨‍💻",
      winner: prod.id,
      reason: `More RAM and longer battery for all-day work`,
    });
  }

  return out;
}

export function tryCompare(query: string): CompareResult | null {
  if (!isCompareQuery(query)) return null;

  const segs = splitQuery(query);
  if (segs.length < 2) {
    return {
      ok: false,
      text:
        "Tell me two products to compare, e.g. \"Compare iPhone 17 Pro Max and Samsung Galaxy S26 Ultra\".",
    };
  }

  const picks: Product[] = [];
  const used = new Set<string>();
  for (const seg of segs) {
    const p = findProductBySegment(seg);
    if (p && !used.has(p.id)) {
      picks.push(p);
      used.add(p.id);
    }
    if (picks.length === 2) break;
  }

  if (picks.length < 2) {
    return {
      ok: false,
      text:
        "I couldn't find one or more products in the NovaCart catalog. Please try another comparison.",
    };
  }

  const [a, b] = picks;
  return {
    ok: true,
    comparison: {
      text: `Here's a side-by-side comparison of **${a.title}** and **${b.title}**:`,
      products: [a, b],
      rows: buildRows(a, b),
      summary: buildSummary(a, b),
    },
  };
}
