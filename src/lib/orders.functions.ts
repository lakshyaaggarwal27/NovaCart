import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { findProduct } from "@/lib/products";

const placeOrderSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().min(1),
        qty: z.number().int().min(1).max(99),
      }),
    )
    .min(1)
    .max(50),
  shipping_address: z.object({
    name: z.string().trim().min(1).max(120),
    email: z.string().trim().email().max(255),
    phone: z.string().trim().min(1).max(40),
    address: z.string().trim().min(1).max(255),
    city: z.string().trim().min(1).max(120),
    zip: z.string().trim().min(1).max(20),
    country: z.string().trim().min(1).max(120),
    payment: z.enum(["card", "upi", "wallet", "netbanking"]),
  }),
});

export const placeOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => placeOrderSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // Authoritative price lookup server-side
    const priced = data.items.map((i) => {
      const product = findProduct(i.id);
      if (!product) throw new Error("Invalid item in cart");
      return {
        id: product.id,
        title: product.title,
        qty: i.qty,
        price: product.price,
        image: product.image,
      };
    });

    const subtotal = priced.reduce((s, i) => s + i.price * i.qty, 0);
    const shipping = subtotal > 500 ? 0 : 19;
    const tax = Math.round(subtotal * 0.08);
    const total = subtotal + shipping + tax;

    const orderNumber = `NV-${Math.random().toString(36).slice(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const invoice = `INV-${Date.now().toString().slice(-8)}`;
    const paymentRef = `PAY-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
    const placedAt = new Date().toISOString();

    const { error } = await supabase.from("orders").insert({
      user_id: userId,
      order_number: orderNumber,
      invoice,
      payment_ref: paymentRef,
      total_cents: total,
      items: priced,
      shipping_address: data.shipping_address,
      placed_at: placedAt,
    });

    if (error) {
      console.error("[placeOrder] insert failed", error);
      throw new Error("Could not place order. Please try again.");
    }

    return {
      orderId: orderNumber,
      invoice,
      ref: paymentRef,
      total,
      items: priced,
      address: data.shipping_address,
      placedAt,
    };
  });
