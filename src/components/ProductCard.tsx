import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, type Product } from "@/lib/products";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, inWishlist } = useStore();
  const discount =
    product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;
  const wished = inWishlist(product.id);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant">
      <Link
        to="/product/$id"
        params={{ id: product.id }}
        className="relative block aspect-square overflow-hidden bg-navy"
      >
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <Badge className="bg-destructive text-destructive-foreground">-{discount}%</Badge>
          )}
          {product.badge && (
            <Badge className="bg-gradient-primary text-primary-foreground border-0">{product.badge}</Badge>
          )}
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
            toast.success(wished ? "Removed from wishlist" : "Added to wishlist");
          }}
          aria-label="Wishlist"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-card/80 backdrop-blur transition-colors hover:bg-card"
        >
          <Heart className={cn("h-4 w-4", wished && "fill-destructive text-destructive")} />
        </button>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{product.brand}</p>
        <Link
          to="/product/$id"
          params={{ id: product.id }}
          className="mt-1 line-clamp-2 font-semibold leading-snug hover:text-primary"
        >
          {product.title}
        </Link>
        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3.5 w-3.5 fill-warning text-warning" />
          <span className="font-medium text-foreground">{product.rating}</span>
          <span>({product.reviews})</span>
          {product.stock < 20 && (
            <span className="ml-auto font-medium text-destructive">Only {product.stock} left</span>
          )}
        </div>

        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            <p className="text-lg font-bold">{formatPrice(product.price)}</p>
            {discount > 0 && (
              <p className="text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice)}</p>
            )}
          </div>
          <Button
            size="icon"
            className="bg-gradient-primary text-primary-foreground shadow-elegant"
            onClick={() => {
              addToCart(product.id);
              toast.success("Added to cart");
            }}
            aria-label="Add to cart"
          >
            <ShoppingBag className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
