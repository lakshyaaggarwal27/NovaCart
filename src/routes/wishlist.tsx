import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { findProduct } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Your Wishlist — NovaCart" }] }),
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlist } = useStore();
  const items = wishlist.map((id) => findProduct(id)).filter(Boolean) as NonNullable<ReturnType<typeof findProduct>>[];

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-secondary">
          <Heart className="h-7 w-7 text-muted-foreground" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold">Your wishlist is empty</h1>
        <p className="mt-2 text-muted-foreground">Save your favourite products to come back to later.</p>
        <Link to="/products" className="mt-6 inline-block">
          <Button size="lg" className="bg-gradient-primary text-primary-foreground shadow-elegant">
            Discover products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold">Your wishlist</h1>
      <p className="mt-1 text-sm text-muted-foreground">{items.length} saved item{items.length > 1 ? "s" : ""}</p>
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
