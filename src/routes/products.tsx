import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { z } from "zod";
import { categories, products, type CategoryId } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Search, SlidersHorizontal } from "lucide-react";

const sortValues = ["featured", "price-asc", "price-desc", "rating", "discount", "newest"] as const;
type Sort = (typeof sortValues)[number];

const searchSchema = z.object({
  q: z.string().optional(),
  category: z.enum([
    "smartphones", "laptops", "gaming", "watches", "cameras", "audio", "accessories", "smarthome",
  ]).optional(),
  brand: z.string().optional(),
  sort: z.enum(sortValues).optional(),
  max: z.number().optional(),
});

export const Route = createFileRoute("/products")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "All Products — NovaCart" },
      { name: "description", content: "Browse smartphones, laptops, audio, gaming, smart home and more." },
    ],
  }),
  component: Products,
});

function Products() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { q, category, brand, sort = "featured", max } = search;

  const allBrands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand))).sort(),
    [],
  );
  const maxPrice = useMemo(() => Math.max(...products.map((p) => p.price)), []);
  const priceCap = max ?? maxPrice;

  const filtered = useMemo(() => {
    let list = [...products];
    if (q) {
      const lower = q.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(lower) ||
          p.brand.toLowerCase().includes(lower) ||
          p.category.includes(lower),
      );
    }
    if (category) list = list.filter((p) => p.category === category);
    if (brand) list = list.filter((p) => p.brand === brand);
    if (max) list = list.filter((p) => p.price <= max);

    switch (sort) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
      case "newest": list.sort((a, b) => Number(b.badge === "New") - Number(a.badge === "New")); break;
      case "discount":
        list.sort((a, b) => {
          const da = (a.originalPrice - a.price) / a.originalPrice;
          const db = (b.originalPrice - b.price) / b.originalPrice;
          return db - da;
        });
        break;
    }
    return list;
  }, [q, category, brand, sort, max]);

  const update = (patch: Partial<typeof search>) =>
    navigate({ search: (prev: typeof search) => ({ ...prev, ...patch }) });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">All products</h1>
          <p className="mt-1 text-sm text-muted-foreground">{filtered.length} items</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              defaultValue={q ?? ""}
              placeholder="Search products..."
              className="pl-9"
              onChange={(e) => update({ q: e.target.value || undefined })}
            />
          </div>
          <select
            value={sort}
            onChange={(e) => update({ sort: e.target.value as Sort })}
            className="h-9 rounded-md border bg-background px-3 text-sm"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="discount">Best Discount</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-6 rounded-2xl border bg-card p-5 shadow-card lg:sticky lg:top-20 lg:self-start">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            <h2 className="font-display font-semibold">Filters</h2>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto h-auto p-0 text-xs text-muted-foreground"
              onClick={() => navigate({ search: {} })}
            >
              Clear
            </Button>
          </div>

          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</h3>
            <div className="space-y-1">
              <button
                onClick={() => update({ category: undefined })}
                className={`block w-full rounded-md px-2 py-1.5 text-left text-sm ${!category ? "bg-secondary font-medium" : "hover:bg-secondary/60"}`}
              >
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => update({ category: c.id as CategoryId })}
                  className={`block w-full rounded-md px-2 py-1.5 text-left text-sm ${category === c.id ? "bg-secondary font-medium" : "hover:bg-secondary/60"}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Brand</h3>
            <select
              value={brand ?? ""}
              onChange={(e) => update({ brand: e.target.value || undefined })}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            >
              <option value="">All brands</option>
              {allBrands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Max price</h3>
              <span className="text-xs font-medium">${priceCap.toLocaleString()}</span>
            </div>
            <Slider
              value={[priceCap]}
              min={100}
              max={maxPrice}
              step={50}
              onValueChange={([v]) => update({ max: v })}
            />
          </div>
        </aside>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="grid place-items-center rounded-2xl border bg-card p-16 text-center">
            <h3 className="font-display text-xl font-semibold">No products found</h3>
            <p className="mt-2 text-sm text-muted-foreground">Try adjusting your filters or search query.</p>
            <Link to="/products" className="mt-4">
              <Button>Reset filters</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
