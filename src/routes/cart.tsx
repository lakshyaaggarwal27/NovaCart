import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { findProduct, formatPrice } from "@/lib/products";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your Cart — NovaCart" }] }),
  component: CartPage,
});

const validCoupons: Record<string, number> = { NOVA10: 10, TECH20: 20, WELCOME5: 5 };

function CartPage() {
  const { cart, updateQty, removeFromCart } = useStore();
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState<{ code: string; percent: number } | null>(null);

  const items = useMemo(
    () =>
      cart
        .map((i) => ({ ...i, product: findProduct(i.id) }))
        .filter((i): i is typeof i & { product: NonNullable<ReturnType<typeof findProduct>> } => Boolean(i.product)),
    [cart],
  );

  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const discount = applied ? Math.round(subtotal * (applied.percent / 100)) : 0;
  const shipping = subtotal > 4999 || subtotal === 0 ? 0 : 199;
  const tax = Math.round((subtotal - discount) * 0.08);
  const total = subtotal - discount + shipping + tax;

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (validCoupons[code]) {
      setApplied({ code, percent: validCoupons[code] });
      toast.success(`Coupon ${code} applied — ${validCoupons[code]}% off`);
    } else {
      toast.error("Invalid coupon code");
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-secondary">
          <ShoppingBag className="h-7 w-7 text-muted-foreground" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Start exploring our latest tech drops.</p>
        <Link to="/products" className="mt-6 inline-block">
          <Button size="lg" className="bg-gradient-primary text-primary-foreground shadow-elegant">
            Continue shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold">Shopping cart</h1>
      <p className="mt-1 text-sm text-muted-foreground">{items.length} item{items.length > 1 ? "s" : ""}</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {items.map((i) => (
            <div key={i.id} className="flex gap-4 rounded-2xl border bg-card p-4 shadow-card">
              <Link to="/product/$id" params={{ id: i.id }} className="block h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-navy">
                <img src={i.product.image} alt={i.product.title} className="h-full w-full object-cover" />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{i.product.brand}</p>
                    <Link to="/product/$id" params={{ id: i.id }} className="font-semibold hover:text-primary">
                      {i.product.title}
                    </Link>
                  </div>
                  <button
                    onClick={() => removeFromCart(i.id)}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label="remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center rounded-lg border">
                    <button className="grid h-9 w-9 place-items-center hover:bg-secondary" onClick={() => updateQty(i.id, i.qty - 1)} aria-label="-">
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium tabular-nums">{i.qty}</span>
                    <button className="grid h-9 w-9 place-items-center hover:bg-secondary" onClick={() => updateQty(i.id, i.qty + 1)} aria-label="+">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="font-display text-lg font-bold">{formatPrice(i.product.price * i.qty)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl border bg-card p-6 shadow-card">
            <h2 className="font-display text-lg font-semibold">Order summary</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
              {applied && (
                <div className="flex justify-between text-success">
                  <dt>Discount ({applied.code})</dt>
                  <dd>-{formatPrice(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd>{shipping === 0 ? <span className="text-success">FREE</span> : formatPrice(shipping)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Tax (est.)</dt>
                <dd>{formatPrice(tax)}</dd>
              </div>
              <div className="mt-3 flex justify-between border-t pt-3 font-display text-lg font-bold">
                <dt>Total</dt>
                <dd>{formatPrice(total)}</dd>
              </div>
            </dl>
            <Link to="/checkout" className="mt-5 block">
              <Button className="w-full bg-gradient-primary text-primary-foreground shadow-elegant" size="lg">
                Proceed to checkout
              </Button>
            </Link>
            <p className="mt-3 text-center text-xs text-muted-foreground">Demo store — no real payments processed.</p>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-card">
            <h3 className="font-semibold">Promo code</h3>
            <p className="mt-1 text-xs text-muted-foreground">Try <code>NOVA10</code>, <code>TECH20</code> or <code>WELCOME5</code>.</p>
            <div className="mt-3 flex gap-2">
              <Input placeholder="Enter code" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
              <Button onClick={applyCoupon}>Apply</Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
