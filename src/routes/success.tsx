import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Package, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/products";

type Order = {
  orderId: string;
  invoice: string;
  ref: string;
  total: number;
  items: { id: string; title: string; qty: number; price: number; image: string }[];
  address: { name: string; email: string; address: string; city: string; zip: string; country: string };
  placedAt: string;
};

export const Route = createFileRoute("/success")({
  head: () => ({ meta: [{ title: "Order Confirmed — NovaCart" }] }),
  component: SuccessPage,
});

const trackingStages = ["Order Placed", "Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered"];

function SuccessPage() {
  const [order, setOrder] = useState<Order | null>(null);
  useEffect(() => {
    const raw = sessionStorage.getItem("nv_last_order");
    if (raw) setOrder(JSON.parse(raw));
  }, []);

  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">No recent order</h1>
        <Link to="/products" className="mt-4 inline-block"><Button>Continue shopping</Button></Link>
      </div>
    );
  }

  const eta = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toLocaleDateString(undefined, {
    weekday: "long", month: "short", day: "numeric",
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-success/15 shadow-glow">
          <CheckCircle2 className="h-10 w-10 text-success" />
        </div>
        <h1 className="mt-6 font-display text-4xl font-bold">Order confirmed!</h1>
        <p className="mt-2 text-muted-foreground">
          Thanks for shopping with NovaCart. A confirmation has been sent to {order.address.email || "your inbox"}.
        </p>
      </div>

      <div className="mt-10 grid gap-3 rounded-2xl border bg-card p-6 shadow-card sm:grid-cols-3">
        <Info label="Order ID" value={order.orderId} />
        <Info label="Invoice" value={order.invoice} />
        <Info label="Payment Ref" value={order.ref} />
      </div>

      <section className="mt-10 rounded-2xl border bg-card p-6 shadow-card">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Tracking</h2>
          <p className="text-sm text-muted-foreground">
            <Truck className="mr-1 inline h-4 w-4" /> Estimated delivery: <span className="font-medium text-foreground">{eta}</span>
          </p>
        </div>
        <ol className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-6">
          {trackingStages.map((stage, i) => (
            <li key={stage} className="text-center">
              <div
                className={`mx-auto grid h-9 w-9 place-items-center rounded-full border-2 ${
                  i === 0 ? "border-primary bg-gradient-primary text-primary-foreground" : "border-border bg-card text-muted-foreground"
                }`}
              >
                {i === 0 ? <CheckCircle2 className="h-5 w-5" /> : i + 1}
              </div>
              <p className={`mt-2 text-xs font-medium ${i === 0 ? "text-foreground" : "text-muted-foreground"}`}>{stage}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-8 rounded-2xl border bg-card p-6 shadow-card">
        <div className="flex items-center gap-2 font-display text-xl font-semibold">
          <Package className="h-5 w-5 text-primary" /> Items
        </div>
        <ul className="mt-4 divide-y">
          {order.items.map((i) => (
            <li key={i.id} className="flex items-center gap-4 py-3 text-sm">
              <img src={i.image} alt="" className="h-14 w-14 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="font-medium">{i.title}</p>
                <p className="text-xs text-muted-foreground">Qty {i.qty}</p>
              </div>
              <p className="font-semibold">{formatPrice(i.price * i.qty)}</p>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between border-t pt-4 font-display text-lg font-bold">
          <span>Total paid</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border bg-card p-6 shadow-card">
        <h2 className="font-display text-xl font-semibold">Shipping to</h2>
        <p className="mt-3 text-sm">
          <span className="font-semibold">{order.address.name}</span><br />
          {order.address.address}<br />
          {order.address.city} {order.address.zip}, {order.address.country}
        </p>
      </section>

      <div className="mt-10 flex justify-center">
        <Link to="/products">
          <Button size="lg" className="bg-gradient-primary text-primary-foreground shadow-elegant">
            Continue shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono text-sm font-semibold">{value}</p>
    </div>
  );
}
