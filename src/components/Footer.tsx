import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Sparkles, Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 bg-navy text-navy-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </span>
            NovaCart
          </Link>
          <p className="mt-4 text-sm text-navy-foreground/70">
            Premium tech, delivered fast. Genuine products, secure payments, easy returns.
          </p>
          <div className="mt-5 flex gap-3">
            {[Twitter, Instagram, Facebook, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 transition-colors hover:bg-white/10"
                aria-label="social"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {[
          { title: "Shop", items: ["Smartphones", "Laptops", "Gaming", "Audio"] },
          { title: "Company", items: ["About", "Careers", "Press", "Contact"] },
          { title: "Support", items: ["Help Center", "Returns", "Shipping", "Privacy"] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-navy-foreground/60">
              {col.title}
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              {col.items.map((i) => (
                <li key={i}>
                  <a href="#" className="text-navy-foreground/80 transition-colors hover:text-navy-foreground">
                    {i}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-navy-foreground/60 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} NovaCart. All rights reserved.</p>
          <p>Demo storefront — no real transactions are processed.</p>
        </div>
      </div>
    </footer>
  );
}
