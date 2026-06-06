import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type CartItem = { id: string; qty: number };

type StoreState = {
  cart: CartItem[];
  wishlist: string[];
  addToCart: (id: string, qty?: number) => void;
  updateQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  inWishlist: (id: string) => boolean;
  cartCount: number;
  wishlistCount: number;
};

const StoreCtx = createContext<StoreState | null>(null);

const read = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const v = window.localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCart(read<CartItem[]>("nv_cart", []));
    setWishlist(read<string[]>("nv_wishlist", []));
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem("nv_cart", JSON.stringify(cart));
  }, [cart, ready]);
  useEffect(() => {
    if (ready) window.localStorage.setItem("nv_wishlist", JSON.stringify(wishlist));
  }, [wishlist, ready]);

  const value = useMemo<StoreState>(() => ({
    cart,
    wishlist,
    addToCart: (id, qty = 1) =>
      setCart((prev) => {
        const ex = prev.find((i) => i.id === id);
        if (ex) return prev.map((i) => (i.id === id ? { ...i, qty: i.qty + qty } : i));
        return [...prev, { id, qty }];
      }),
    updateQty: (id, qty) =>
      setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i))),
    removeFromCart: (id) => setCart((prev) => prev.filter((i) => i.id !== id)),
    clearCart: () => setCart([]),
    toggleWishlist: (id) =>
      setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
    inWishlist: (id) => wishlist.includes(id),
    cartCount: cart.reduce((sum, i) => sum + i.qty, 0),
    wishlistCount: wishlist.length,
  }), [cart, wishlist]);

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
