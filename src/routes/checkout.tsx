import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, CreditCard, Loader2, Lock, Smartphone, Wallet } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { findProduct, formatPrice } from "@/lib/products";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — NovaCart" }] }),
  component: CheckoutPage,
});

type Step = 0 | 1 | 2 | 3;
const steps = ["Information", "Shipping", "Payment", "Review"] as const;

const paymentMethods = [
  { id: "card", label: "Credit / Debit Card", Icon: CreditCard },
  { id: "upi", label: "UPI", Icon: Smartphone },
  { id: "wallet", label: "Wallet", Icon: Wallet },
  { id: "netbanking", label: "Net Banking", Icon: Lock },
] as const;

function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, clearCart } = useStore();
  const [step, setStep] = useState<Step>(0);
  const [processing, setProcessing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    country: "United States",
    payment: "card" as (typeof paymentMethods)[number]["id"],
  });

  const items = useMemo(
    () =>
      cart.map((i) => ({ ...i, product: findProduct(i.id)! })).filter((i) => i.product),
    [cart],
  );
  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const shipping = subtotal > 500 ? 0 : 19;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shipping + tax;

  if (cart.length === 0 && !processing) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Nothing to checkout</h1>
        <Link to="/products" className="mt-4 inline-block">
          <Button>Shop products</Button>
        </Link>
      </div>
    );
  }

  const next = () => setStep((s) => Math.min(3, s + 1) as Step);
  const back = () => setStep((s) => Math.max(0, s - 1) as Step);

  const placeOrder = async () => {
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 2400));
    const orderId = `NV-${Math.random().toString(36).slice(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const invoice = `INV-${Date.now().toString().slice(-8)}`;
    const ref = `PAY-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
    const order = {
      orderId,
      invoice,
      ref,
      total,
      items: items.map((i) => ({ id: i.id, title: i.product.title, qty: i.qty, price: i.product.price, image: i.product.image })),
      address: { ...form },
      placedAt: new Date().toISOString(),
    };
    sessionStorage.setItem("nv_last_order", JSON.stringify(order));
    clearCart();
    navigate({ to: "/success" });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold">Checkout</h1>

      <div className="mt-6 flex items-center gap-2 text-xs sm:text-sm">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={cn(
                "grid h-7 w-7 place-items-center rounded-full border font-semibold",
                i <= step
                  ? "border-primary bg-gradient-primary text-primary-foreground"
                  : "border-input text-muted-foreground",
              )}
            >
              {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </div>
            <span className={cn("hidden sm:inline", i === step ? "font-semibold" : "text-muted-foreground")}>{label}</span>
            {i < steps.length - 1 && <span className="mx-2 h-px w-8 bg-border sm:w-16" />}
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border bg-card p-6 shadow-card">
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-semibold">Customer information</h2>
              <Field label="Full name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Alex Morgan" /></Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Email"><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></Field>
                <Field label="Phone"><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 555 123 4567" /></Field>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-semibold">Shipping address</h2>
              <Field label="Street address"><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="221B Baker Street" /></Field>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="City"><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></Field>
                <Field label="ZIP"><Input value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} /></Field>
                <Field label="Country"><Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></Field>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-semibold">Payment method</h2>
              <div className="rounded-xl border border-warning/30 bg-warning/10 p-3 text-xs text-warning-foreground">
                <strong>Demo Payment Environment</strong> — no real money will be charged.
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {paymentMethods.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setForm({ ...form, payment: m.id })}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border p-4 text-left transition-all",
                      form.payment === m.id ? "border-primary bg-primary/5 shadow-card" : "hover:bg-secondary",
                    )}
                  >
                    <m.Icon className="h-5 w-5 text-primary" />
                    <span className="font-medium">{m.label}</span>
                  </button>
                ))}
              </div>
              {form.payment === "card" && (
                <div className="space-y-3 rounded-xl border bg-secondary/30 p-4">
                  <Field label="Card number"><Input placeholder="4242 4242 4242 4242" /></Field>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Expiry"><Input placeholder="MM / YY" /></Field>
                    <Field label="CVC"><Input placeholder="123" /></Field>
                  </div>
                </div>
              )}
              {form.payment === "upi" && (
                <Field label="UPI ID"><Input placeholder="name@upi" /></Field>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-semibold">Review your order</h2>
              <div className="rounded-xl border p-4 text-sm">
                <p className="font-semibold">{form.name || "—"}</p>
                <p className="text-muted-foreground">{form.email} · {form.phone}</p>
                <p className="mt-2">{form.address}</p>
                <p className="text-muted-foreground">{form.city} {form.zip}, {form.country}</p>
                <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">
                  Payment: {paymentMethods.find((p) => p.id === form.payment)?.label}
                </p>
              </div>
              <ul className="divide-y rounded-xl border">
                {items.map((i) => (
                  <li key={i.id} className="flex items-center gap-3 p-3 text-sm">
                    <img src={i.product.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="font-medium">{i.product.title}</p>
                      <p className="text-xs text-muted-foreground">Qty {i.qty}</p>
                    </div>
                    <p className="font-semibold">{formatPrice(i.product.price * i.qty)}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            <Button variant="ghost" onClick={back} disabled={step === 0 || processing}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            {step < 3 ? (
              <Button onClick={next} className="bg-gradient-primary text-primary-foreground shadow-elegant">
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={placeOrder} disabled={processing} size="lg" className="bg-gradient-primary text-primary-foreground shadow-elegant">
                {processing ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing payment...</>
                ) : (
                  <>Pay {formatPrice(total)}</>
                )}
              </Button>
            )}
          </div>
        </div>

        <aside className="rounded-2xl border bg-card p-6 shadow-card lg:sticky lg:top-20 lg:self-start">
          <h2 className="font-display text-lg font-semibold">Order summary</h2>
          <div className="mt-4 space-y-3">
            {items.slice(0, 4).map((i) => (
              <div key={i.id} className="flex items-center gap-3 text-sm">
                <div className="relative">
                  <img src={i.product.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
                  <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">{i.qty}</span>
                </div>
                <p className="flex-1 truncate">{i.product.title}</p>
                <p className="font-medium">{formatPrice(i.product.price * i.qty)}</p>
              </div>
            ))}
            {items.length > 4 && <p className="text-xs text-muted-foreground">+ {items.length - 4} more items</p>}
          </div>
          <dl className="mt-5 space-y-2 border-t pt-4 text-sm">
            <Row label="Subtotal" value={formatPrice(subtotal)} />
            <Row label="Shipping" value={shipping === 0 ? "FREE" : formatPrice(shipping)} />
            <Row label="Tax" value={formatPrice(tax)} />
            <div className="mt-2 flex justify-between border-t pt-3 font-display text-lg font-bold">
              <dt>Total</dt><dd>{formatPrice(total)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={typeof value === "string" && value === "FREE" ? "font-medium text-success" : ""}>{value}</dd>
    </div>
  );
}
