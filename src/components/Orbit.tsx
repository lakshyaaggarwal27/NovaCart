import { useEffect, useRef, useState } from "react";
import { Minus, Orbit as OrbitIcon, RotateCcw, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Msg = { id: string; role: "user" | "orbit"; text: string };

const WELCOME: Msg = {
  id: "welcome",
  role: "orbit",
  text:
    "👋 Welcome to Orbit\n\nYour personal shopping co-pilot.\n\nI can help you:\n• Find products\n• Compare products\n• Discover the best deals\n• Recommend products based on your budget\n• Answer shopping questions\n\nWhat are you looking for today?",
};

const QUICK_ACTIONS = [
  { label: "💻 Best Laptop Under ₹80,000", prompt: "Best laptop under ₹80,000" },
  { label: "📱 Compare Phones", prompt: "Compare phones" },
  { label: "🎧 Recommend Headphones", prompt: "Recommend headphones" },
  { label: "🔥 Show Trending Products", prompt: "Show trending products" },
  { label: "❓ Shipping Information", prompt: "Shipping information" },
];

const PLACEHOLDER_REPLY =
  "Great question! Smart product recommendations and comparisons are landing in the next Orbit update. In the meantime, browse the catalog and I'll be ready to help you decide soon. 🚀";

const SHIPPING_REPLY =
  "We offer free standard shipping on orders over ₹999, with delivery in 3–5 business days. Express options are available at checkout. Detailed tracking ships with every order confirmation. 📦";

function reply(prompt: string): string {
  const p = prompt.toLowerCase();
  if (p.includes("shipping")) return SHIPPING_REPLY;
  if (p.includes("hi") || p.includes("hello") || p.includes("hey"))
    return "Hey there! 👋 I'm Orbit. Ask me about products, deals, or shipping — and richer recommendations are coming soon.";
  return PLACEHOLDER_REPLY;
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
      setMessages((m) => [
        ...m,
        { id: `o-${Date.now()}`, role: "orbit", text: reply(trimmed) },
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
                          "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm",
                          m.role === "user"
                            ? "rounded-br-sm bg-primary text-primary-foreground"
                            : "rounded-bl-sm bg-secondary text-secondary-foreground",
                        )}
                      >
                        {m.text}
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
