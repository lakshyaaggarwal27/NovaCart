import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Minus, Orbit as OrbitIcon, RotateCcw, Send, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatPrice, type Product } from "@/lib/products";
import { recommend } from "@/lib/orbit-recommend";
import { tryCompare, type Comparison } from "@/lib/orbit-compare";

type Msg = {
  id: string;
  role: "user" | "orbit";
  text: string;
  products?: Product[];
  comparison?: Comparison;
};

const WELCOME: Msg = {
  id: "welcome",
  role: "orbit",
  text:
    "👋 Welcome to Orbit\n\nYour personal shopping co-pilot.\n\nI can help you:\n• Find products\n• Compare products\n• Discover the best deals\n• Recommend products based on your budget\n• Answer shopping questions\n\nWhat are you looking for today?",
};

const QUICK_ACTIONS = [
  { label: "💻 Best Laptop Under ₹80,000", prompt: "Best laptop under ₹80,000" },
  { label: "⚖️ Compare iPhone vs Galaxy", prompt: "Compare iPhone 17 Pro Max and Samsung Galaxy S26 Ultra" },
  { label: "🎧 Recommend Headphones", prompt: "Recommend headphones" },
  { label: "🔥 Show Trending Products", prompt: "Show trending products" },
  { label: "❓ Shipping Information", prompt: "Shipping information" },
];

const SHIPPING_REPLY =
  "We offer free standard shipping on orders over ₹4,999, with delivery in 3–5 business days. Express options are available at checkout. Detailed tracking ships with every order confirmation. 📦";


function buildReply(prompt: string): { text: string; products?: Product[]; comparison?: Comparison } {
  const p = prompt.toLowerCase();
  if (p.includes("shipping") || p.includes("delivery") || p.includes("return")) {
    return { text: SHIPPING_REPLY };
  }
  const cmp = tryCompare(prompt);
  if (cmp) {
    if (cmp.ok) return { text: cmp.comparison.text, comparison: cmp.comparison };
    return { text: cmp.text };
  }
  if (/^(hi|hello|hey|yo|hola)\b/.test(p.trim())) {
    return {
      text:
        "Hey there! 👋 I'm Orbit. Tell me what you're shopping for — try \"best laptop under ₹80,000\" or \"compare iPhone 17 Pro Max and Samsung Galaxy S26 Ultra\".",
    };
  }
  const rec = recommend(prompt);
  if (rec) return { text: rec.text, products: rec.products };
  return {
    text:
      "I can help you discover and compare products from NovaCart. Try asking:\n• Best gaming laptop under ₹1,50,000\n• Compare Sony WH-1000XM7 and AirPods Pro 3\n• Top rated headphones\n• Show trending products",
  };
}

export function Orbit() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing, open, minimized]);

  useEffect(() => {
    if (open && !minimized) inputRef.current?.focus();
  }, [open, minimized]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;
    const userMsg: Msg = { id: `u-${Date.now()}`, role: "user", text: trimmed };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    const delay = 600 + Math.min(1200, trimmed.length * 25);
    window.setTimeout(() => {
      const reply = buildReply(trimmed);
      setMessages((m) => [
        ...m,
        { id: `o-${Date.now()}`, role: "orbit", text: reply.text, products: reply.products, comparison: reply.comparison },
      ]);
      setTyping(false);
    }, delay);
  };

  const clearChat = () => {
    setMessages([WELCOME]);
    setTyping(false);
  };

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setMinimized(false);
        }}
        aria-label="Open Orbit AI"
        className={cn(
          "fixed bottom-5 right-5 z-50 group flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-all duration-300 hover:scale-105 hover:shadow-elegant active:scale-95",
          "bg-gradient-primary",
          open && !minimized && "scale-0 opacity-0 pointer-events-none",
        )}
      >
        <span className="relative flex h-5 w-5 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-white/40" />
          <OrbitIcon className="h-5 w-5" />
        </span>
        <span className="hidden sm:inline">Orbit</span>
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className={cn(
            "fixed z-50 transition-all duration-300 ease-out",
            minimized
              ? "bottom-5 right-5 w-64"
              : "bottom-5 right-5 w-[calc(100vw-2.5rem)] sm:w-[380px] md:w-[400px]",
            "animate-scale-in",
          )}
        >
          <div
            className={cn(
              "flex flex-col overflow-hidden rounded-2xl border bg-card shadow-elegant",
              minimized ? "h-14" : "h-[min(600px,calc(100vh-6rem))]",
            )}
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b bg-gradient-primary px-4 py-3 text-primary-foreground">
              <div className="relative grid h-9 w-9 place-items-center rounded-full bg-white/15 backdrop-blur">
                <OrbitIcon className="h-5 w-5" />
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[hsl(var(--primary))]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">Orbit AI</div>
                <div className="truncate text-[11px] opacity-80">
                  Your Personal Shopping Co-Pilot
                </div>
              </div>
              <button
                onClick={clearChat}
                aria-label="Clear conversation"
                className="rounded-md p-1.5 transition-colors hover:bg-white/15"
                title="Clear conversation"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setMinimized((m) => !m)}
                aria-label="Minimize"
                className="rounded-md p-1.5 transition-colors hover:bg-white/15"
              >
                <Minus className="h-4 w-4" />
              </button>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close Orbit"
                className="rounded-md p-1.5 transition-colors hover:bg-white/15"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {!minimized && (
              <>
                {/* Messages */}
                <div
                  ref={scrollRef}
                  className="flex-1 space-y-3 overflow-y-auto bg-background/40 px-4 py-4"
                >
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={cn(
                        "flex animate-fade-in",
                        m.role === "user" ? "justify-end" : "justify-start",
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[90%] space-y-2",
                          m.role === "user" ? "items-end" : "items-start",
                        )}
                      >
                        <div
                          className={cn(
                            "whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm",
                            m.role === "user"
                              ? "rounded-br-sm bg-primary text-primary-foreground"
                              : "rounded-bl-sm bg-secondary text-secondary-foreground",
                          )}
                        >
                          {m.text}
                        </div>
                        {m.products && m.products.length > 0 && (
                          <div className="space-y-2">
                            {m.products.map((p) => (
                              <ProductRec
                                key={p.id}
                                product={p}
                                onClick={() => setOpen(false)}
                              />
                            ))}
                          </div>
                        )}
                        {m.comparison && (
                          <ComparisonCard
                            comparison={m.comparison}
                            onNavigate={() => setOpen(false)}
                          />
                        )}
                      </div>
                    </div>
                  ))}

                  {typing && (
                    <div className="flex justify-start animate-fade-in">
                      <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-secondary px-3.5 py-3 shadow-sm">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
                      </div>
                    </div>
                  )}

                  {messages.length === 1 && !typing && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {QUICK_ACTIONS.map((q) => (
                        <button
                          key={q.label}
                          onClick={() => send(q.prompt)}
                          className="rounded-full border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-all hover:border-primary hover:bg-primary/5 hover:text-primary"
                        >
                          {q.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Composer */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    send(input);
                  }}
                  className="flex items-center gap-2 border-t bg-card px-3 py-2.5"
                >
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask Orbit anything..."
                    className="flex-1 rounded-full border bg-background px-4 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!input.trim() || typing}
                    className="h-9 w-9 shrink-0 rounded-full bg-gradient-primary shadow-glow"
                    aria-label="Send"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function ProductRec({ product, onClick }: { product: Product; onClick?: () => void }) {
  return (
    <Link
      to="/product/$id"
      params={{ id: product.id }}
      onClick={onClick}
      className="flex gap-3 rounded-xl border bg-card p-2.5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-elegant"
    >
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          {product.brand}
        </p>
        <p className="truncate text-xs font-semibold leading-snug text-foreground">
          {product.title}
        </p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="text-sm font-bold text-foreground">{formatPrice(product.price)}</span>
          <span className="flex items-center gap-0.5 text-[11px] font-medium text-muted-foreground">
            <Star className="h-3 w-3 fill-warning text-warning" />
            {product.rating}
          </span>
        </div>
        <span className="mt-1 inline-block text-[11px] font-semibold text-primary">
          View Product →
        </span>
      </div>
    </Link>
  );
}
