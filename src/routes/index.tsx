import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Award, CheckCircle2, Headphones, RotateCcw, ShieldCheck, Truck, Zap } from "lucide-react";
import heroImg from "@/assets/hero-tech.jpg";
import { Button } from "@/components/ui/button";
import { categories, products } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { CountdownTimer } from "@/components/CountdownTimer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NovaCart — Premium Tech, Delivered Fast" },
      { name: "description", content: "Discover flagship smartphones, laptops, gaming gear and smart home devices at NovaCart." },
      { property: "og:title", content: "NovaCart — Premium Tech, Delivered Fast" },
    ],
  }),
  component: Home,
});

function Home() {
  const trending = products.filter((p) => p.badge === "Trending" || p.rating >= 4.7).slice(0, 8);
  const flash = products.filter((p) => p.badge === "Flash").slice(0, 4);
  const bestSellers = products.filter((p) => p.badge === "Best Seller" || p.reviews > 300).slice(0, 4);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-navy text-navy-foreground">
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        <div className="absolute inset-0 bg-gradient-glow" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24 lg:px-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium backdrop-blur">
              <Zap className="h-3.5 w-3.5 text-warning" /> New arrivals every week
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
              Premium tech,
              <span className="block bg-gradient-to-r from-primary-glow via-white to-accent bg-clip-text text-transparent">
                delivered fast.
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-base text-navy-foreground/80 sm:text-lg">
              Flagship smartphones, pro laptops, immersive audio and the latest gaming gear — handpicked, genuine, and shipped overnight.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/products">
                <Button size="lg" className="bg-gradient-primary text-primary-foreground shadow-elegant">
                  Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/products" search={{ sort: "discount" }}>
                <Button size="lg" variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                  Explore Deals
                </Button>
              </Link>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-6 text-sm">
              {[
                ["75+", "Premium products"],
                ["4.8★", "Avg. rating"],
                ["24h", "Express delivery"],
              ].map(([val, label]) => (
                <div key={label}>
                  <dt className="font-display text-2xl font-bold">{val}</dt>
                  <dd className="text-xs text-navy-foreground/70">{label}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative">
            <div className="absolute -inset-8 bg-gradient-glow blur-3xl" />
            <img
              src={heroImg}
              alt="Premium tech products floating over a navy gradient background"
              width={1920}
              height={1080}
              className="relative animate-float rounded-3xl shadow-elegant"
            />
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold">Shop by category</h2>
            <p className="mt-1 text-muted-foreground">From flagship phones to smart home essentials.</p>
          </div>
          <Link to="/products" className="hidden text-sm font-medium text-primary hover:underline md:block">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to="/products"
              search={{ category: cat.id }}
              className="group relative overflow-hidden rounded-2xl border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant"
            >
              <div className="aspect-[4/5] overflow-hidden bg-navy">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/90 to-transparent p-4 text-navy-foreground">
                <p className="text-xs uppercase tracking-wider text-navy-foreground/70">{cat.blurb}</p>
                <h3 className="font-display text-lg font-semibold">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FLASH SALE */}
      {flash.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-hero p-6 text-navy-foreground sm:p-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-destructive/20 px-3 py-1 text-xs font-semibold text-destructive-foreground">
                  <Zap className="h-3.5 w-3.5" /> FLASH SALE
                </span>
                <h2 className="mt-3 font-display text-3xl font-bold">Limited-time deals</h2>
                <p className="mt-1 text-navy-foreground/70">Hurry — these prices vanish at midnight.</p>
              </div>
              <CountdownTimer />
            </div>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {flash.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TRENDING */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold">Trending now</h2>
            <p className="mt-1 text-muted-foreground">What everyone is loving this week.</p>
          </div>
          <Link to="/products" className="text-sm font-medium text-primary hover:underline">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {trending.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-3xl font-bold">Best sellers</h2>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {bestSellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          {[
            { Icon: Truck, title: "Fast delivery", desc: "Overnight shipping on most orders." },
            { Icon: ShieldCheck, title: "Secure payments", desc: "Bank-grade encryption end to end." },
            { Icon: RotateCcw, title: "Easy returns", desc: "30-day no-questions-asked refunds." },
            { Icon: Award, title: "Genuine products", desc: "Authorized brand partners only." },
            { Icon: Headphones, title: "24/7 support", desc: "Real humans, any time of day." },
          ].map(({ Icon, title, desc }) => (
            <div key={title} className="rounded-2xl border bg-card p-6 shadow-card">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center font-display text-3xl font-bold">Loved by 50,000+ customers</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { name: "Priya M.", role: "Verified buyer", quote: "Got my MacBook Pro in 18 hours. Packaging was flawless and the price beat every other store I checked." },
            { name: "Daniel R.", role: "Verified buyer", quote: "The flash sale is real. Picked up a Sony XM7 for less than retail and it arrived next day. Smooth experience." },
            { name: "Aisha K.", role: "Verified buyer", quote: "Support helped me swap a phone the same evening. Genuine product, hassle-free. NovaCart is my default now." },
          ].map((t) => (
            <div key={t.name} className="rounded-2xl border bg-card p-6 shadow-card">
              <div className="flex gap-1 text-warning">
                {Array.from({ length: 5 }).map((_, i) => (
                  <CheckCircle2 key={i} className="h-4 w-4" />
                ))}
              </div>
              <p className="mt-4 text-sm text-foreground/90">"{t.quote}"</p>
              <div className="mt-5">
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-gradient-primary p-10 text-primary-foreground shadow-elegant">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold">Get drops & deals first</h2>
            <p className="mt-2 text-primary-foreground/80">
              Subscribe for early access to new launches and members-only pricing.
            </p>
            <form
              className="mx-auto mt-6 flex max-w-md gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value = "";
              }}
            >
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="flex-1 rounded-md border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-white/40"
              />
              <Button type="submit" variant="secondary" className="font-semibold">Subscribe</Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
