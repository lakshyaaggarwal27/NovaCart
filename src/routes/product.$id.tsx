import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronRight, Heart, Minus, Plus, ShieldCheck, ShoppingBag, Star, Truck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { findProduct, formatPrice, products } from "@/lib/products";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/ProductCard";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = findProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.title} — NovaCart` },
          { name: "description", content: loaderData.product.description },
          { property: "og:title", content: `${loaderData.product.title} — NovaCart` },
          { property: "og:description", content: loaderData.product.description },
          { property: "og:image", content: loaderData.product.image },
        ]
      : [],
  }),
  component: ProductPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="font-display text-3xl font-bold">Product not found</h1>
      <Link to="/products" className="mt-4 inline-block">
        <Button>Browse all products</Button>
      </Link>
    </div>
  ),
});

const reviewsSample = [
  { name: "Arjun S.", date: "2 weeks ago", rating: 5, text: "Exactly what I expected. Build quality is premium and shipping was lightning fast." },
  { name: "Mia L.", date: "1 month ago", rating: 5, text: "Worth every penny. The display is gorgeous and battery easily lasts a full day of heavy use." },
  { name: "Tomáš K.", date: "1 month ago", rating: 4, text: "Solid performer for the price. Cameras are excellent, software is smooth." },
  { name: "Lara P.", date: "2 months ago", rating: 5, text: "Customer support was super helpful when I had a setup question. Loving it." },
  { name: "Hiro T.", date: "3 months ago", rating: 4, text: "Great upgrade from my last device. Recommended." },
];

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { addToCart, toggleWishlist, inWishlist } = useStore();
  const [qty, setQty] = useState(1);
  const wished = inWishlist(product.id);
  const discount =
    product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/products" className="hover:text-foreground">Products</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{product.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-3xl border bg-navy shadow-card">
            <img
              src={product.image}
              alt={product.title}
              className="aspect-square w-full object-cover"
            />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <button
                key={i}
                className="aspect-square overflow-hidden rounded-xl border bg-navy/80 ring-primary transition-all hover:ring-2"
              >
                <img src={product.image} alt="" className="h-full w-full object-cover opacity-80" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">{product.brand}</p>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">{product.title}</h1>
          <div className="mt-3 flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-warning text-warning" />
              <span className="font-medium">{product.rating}</span>
              <span className="text-muted-foreground">({product.reviews} reviews)</span>
            </div>
            <span className="text-muted-foreground">SKU: {product.id.toUpperCase()}</span>
          </div>

          <div className="mt-6 flex items-end gap-3">
            <span className="font-display text-4xl font-bold">{formatPrice(product.price)}</span>
            {discount > 0 && (
              <>
                <span className="text-lg text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
                <Badge className="bg-destructive text-destructive-foreground">-{discount}%</Badge>
              </>
            )}
          </div>
          <p className="mt-2 text-sm">
            {product.stock > 0 ? (
              <span className="font-medium text-success">In stock — {product.stock} available</span>
            ) : (
              <span className="font-medium text-destructive">Out of stock</span>
            )}
          </p>

          <p className="mt-6 text-foreground/80">{product.description}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-xl border">
              <button className="grid h-11 w-11 place-items-center hover:bg-secondary" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="decrease">
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-medium tabular-nums">{qty}</span>
              <button className="grid h-11 w-11 place-items-center hover:bg-secondary" onClick={() => setQty((q) => q + 1)} aria-label="increase">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button
              size="lg"
              className="flex-1 bg-gradient-primary text-primary-foreground shadow-elegant sm:flex-initial"
              onClick={() => {
                addToCart(product.id, qty);
                toast.success(`${qty} × ${product.title} added to cart`);
              }}
            >
              <ShoppingBag className="mr-2 h-4 w-4" /> Add to cart
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => toggleWishlist(product.id)}
              aria-label="Wishlist"
            >
              <Heart className={cn("h-4 w-4", wished && "fill-destructive text-destructive")} />
            </Button>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-2xl border p-4">
              <Truck className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-semibold">Free overnight shipping</p>
                <p className="text-xs text-muted-foreground">Order before 5pm</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-semibold">2-year warranty</p>
                <p className="text-xs text-muted-foreground">Manufacturer backed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SPECS */}
      <section className="mt-16">
        <h2 className="font-display text-2xl font-bold">Specifications</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border bg-card">
          <dl className="divide-y">
            {Object.entries(product.specs).map(([k, v]) => (
              <div key={k} className="grid grid-cols-3 px-5 py-3 text-sm">
                <dt className="font-medium text-muted-foreground">{k}</dt>
                <dd className="col-span-2">{String(v)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="mt-16">
        <h2 className="font-display text-2xl font-bold">Customer reviews</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {reviewsSample.map((r, i) => (
            <div key={i} className="rounded-2xl border bg-card p-5 shadow-card">
              <div className="flex items-center gap-1 text-warning">
                {Array.from({ length: r.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-warning text-warning" />
                ))}
              </div>
              <p className="mt-3 text-sm text-foreground/90">{r.text}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{r.name}</span> · {r.date}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-display text-2xl font-bold">You may also like</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
