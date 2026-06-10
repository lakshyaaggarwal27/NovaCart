import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Package, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { formatPrice } from "@/lib/products";

export const Route = createFileRoute("/_authenticated/orders")({
  head: () => ({ meta: [{ title: "Your orders — NovaCart" }] }),
  component: OrdersPage,
});

type OrderItem = { id: string; title: string; qty: number; price: number; image: string };
type Order = {
  id: string;
  order_number: string;
  invoice: string;
  payment_ref: string;
  total_cents: number;
  items: OrderItem[];
  shipping_address: { name?: string; city?: string; country?: string };
  placed_at: string;
};

function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("placed_at", { ascending: false })
      .then(({ data }) => setOrders((data as unknown as Order[]) ?? []));
  }, [user]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-3">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground">
          <Package className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-bold">Your orders</h1>
          <p className="text-sm text-muted-foreground">Order history and details</p>
        </div>
      </div>

      {orders === null ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border bg-card p-10 text-center shadow-card">
          <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground" />
          <h2 className="mt-4 font-display text-xl font-semibold">No orders yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">Once you place an order, it'll show up here.</p>
          <Link to="/products" className="mt-4 inline-block">
            <Button className="bg-gradient-primary text-primary-foreground shadow-elegant">Start shopping</Button>
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {orders.map((o) => (
            <li key={o.id} className="rounded-2xl border bg-card p-6 shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-sm font-semibold">{o.order_number}</p>
                  <p className="text-xs text-muted-foreground">
                    Placed {new Date(o.placed_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                    {" · "}Invoice {o.invoice}
                  </p>
                </div>
                <p className="font-display text-lg font-bold">{formatPrice(o.total_cents)}</p>
              </div>
              <ul className="mt-4 divide-y">
                {o.items.map((i) => (
                  <li key={i.id} className="flex items-center gap-3 py-3 text-sm">
                    <img src={i.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="font-medium">{i.title}</p>
                      <p className="text-xs text-muted-foreground">Qty {i.qty}</p>
                    </div>
                    <p className="font-semibold">{formatPrice(i.price * i.qty)}</p>
                  </li>
                ))}
              </ul>
              {o.shipping_address?.city && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Shipped to {o.shipping_address.name ? `${o.shipping_address.name}, ` : ""}
                  {o.shipping_address.city}{o.shipping_address.country ? `, ${o.shipping_address.country}` : ""}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
