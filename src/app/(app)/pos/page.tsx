"use client";

import { useState } from "react";
import { Search, Plus, Minus, Trash2, Check, Banknote, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStore } from "@/lib/store";
import { stockState, type PaymentMethod, type Product } from "@/lib/data";
import { peso, qty, searchProducts } from "@/lib/format";

function StockBadge({ p }: { p: Product }) {
  const s = stockState(p);
  if (s === "out")
    return (
      <Badge variant="outline" className="border-destructive/40 text-destructive">
        Out of stock
      </Badge>
    );
  if (s === "low")
    return (
      <Badge
        variant="outline"
        className="border-destructive/30 bg-destructive/5 text-destructive"
      >
        Low · {qty(p.stock)} {p.unit}
      </Badge>
    );
  return (
    <Badge variant="outline" className="text-muted-foreground">
      {qty(p.stock)} {p.unit}
    </Badge>
  );
}

export default function PosPage() {
  const { products, cartLines, cartSubtotal, cartCount, dispatch } = useStore();
  const [query, setQuery] = useState("");
  const [tendered, setTendered] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("cash");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const results = searchProducts(products, query, 30);

  // Change is what the customer gets back: the cash handed in minus what the
  // cart is owed. The previous expression had these two operands reversed, so
  // in the normal case — customer tenders at least the total — it produced a
  // negative number that `Math.max(0, …)` then clamped to zero, which is why
  // change always read ₱0.
  //
  // `tendered` is a free-text field filtered only for digits and dots, so it can
  // be blank or malformed ("1.2.3"). `Number` returns NaN for both, which would
  // otherwise reach `peso` and print "₱NaN".
  const tenderedNum = Number(tendered);
  const hasTendered = tendered !== "" && Number.isFinite(tenderedNum);

  // Signed: positive is change owed back, negative means the customer is short.
  const changeDue =
    method === "cash" && hasTendered ? tenderedNum - cartSubtotal : 0;
  const short = changeDue < 0;
  const shortfall = short ? -changeDue : 0;

  const canComplete = cartCount > 0;

  const add = (id: string) => dispatch({ type: "addToCart", productId: id, quantity: 1 });

  const complete = () => {
    // Fall back to the exact total when no usable figure was tendered, so a
    // malformed entry can't record NaN as the amount on the sale.
    const amount =
      method === "cash" && hasTendered ? tenderedNum : cartSubtotal;
    dispatch({ type: "completeSale", paymentMethod: method, amountTendered: amount });
    setConfirmOpen(false);
    setTendered("");
    setQuery("");
    toast.success("Sale recorded", {
      description: "Stock levels have been updated.",
    });
  };

  const quickCash = [100, 200, 500, 1000];

  return (
    <div className="mx-auto w-full max-w-6xl px-gutter py-8 md:px-gutter-md md:py-10">
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Product picker */}
        <div className="lg:col-span-3">
          <div>
            <h1 className="text-2xl">Checkout</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Type part of a product name to find it.
            </p>
          </div>

          <div className="relative mt-5">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products by name"
              className="h-11 pl-9"
              autoFocus
            />
          </div>

          <Card className="mt-4 overflow-hidden">
            <div className="divide-y">
              {results.length === 0 && (
                <p className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No products match “{query}”.
                </p>
              )}
              {results.map((p) => {
                const out = p.stock <= 0;
                return (
                  <div key={p.id} className="flex items-center gap-3 p-3.5">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{p.name}</p>
                      <p className="nums mt-0.5 text-xs text-muted-foreground">
                        {peso(p.sellingPrice)} · {p.category}
                      </p>
                    </div>
                    <StockBadge p={p} />
                    <Button
                      size="icon"
                      variant="outline"
                      className="size-9 shrink-0"
                      onClick={() => add(p.id)}
                      disabled={out}
                      aria-label={`Add ${p.name} to cart`}
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Cart */}
        <div className="lg:col-span-2">
          <Card className="sticky top-24 overflow-hidden">
            <div className="border-b bg-paper px-5 py-4">
              <div className="flex items-center justify-between">
                <h2 className="font-heading font-bold">Current sale</h2>
                {cartCount > 0 && (
                  <Badge variant="secondary" className="nums">
                    {cartCount} {cartCount === 1 ? "item" : "items"}
                  </Badge>
                )}
              </div>
            </div>

            {cartLines.length === 0 ? (
              <p className="px-5 py-12 text-center text-sm text-muted-foreground">
                Your cart is empty. Add a product to start a sale.
              </p>
            ) : (
              <>
                <div className="max-h-80 divide-y overflow-y-auto">
                  {cartLines.map((l) => (
                    <div key={l.productId} className="flex items-center gap-2 px-4 py-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{l.product.name}</p>
                        <p className="nums text-xs text-muted-foreground">
                          {peso(l.product.sellingPrice)} each
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-7"
                          onClick={() =>
                            dispatch({
                              type: "setQty",
                              productId: l.productId,
                              quantity: l.quantity - 1,
                            })
                          }
                          aria-label="Decrease quantity"
                        >
                          <Minus className="size-3.5" />
                        </Button>
                        <span className="nums w-7 text-center text-sm font-medium">
                          {qty(l.quantity)}
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-7"
                          onClick={() =>
                            dispatch({
                              type: "addToCart",
                              productId: l.productId,
                              quantity: 1,
                            })
                          }
                          aria-label="Increase quantity"
                        >
                          <Plus className="size-3.5" />
                        </Button>
                      </div>

                      <span className="nums w-16 shrink-0 text-right text-sm font-semibold">
                        {peso(l.quantity * l.product.sellingPrice)}
                      </span>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() =>
                          dispatch({ type: "removeFromCart", productId: l.productId })
                        }
                        aria-label={`Remove ${l.product.name}`}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-3 border-t bg-paper px-5 py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Subtotal</span>
                    <span className="nums text-sm">{peso(cartSubtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-lg font-bold">Total</span>
                    <span className="nums font-heading text-2xl font-bold text-brand-strong">
                      {peso(cartSubtotal)}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Button
                      className="flex-1"
                      size="lg"
                      onClick={() => setConfirmOpen(true)}
                    >
                      <Check className="size-4" />
                      Charge {peso(cartSubtotal)}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-9 self-start"
                      onClick={() => dispatch({ type: "clearCart" })}
                      aria-label="Clear cart"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>

      {/* Payment confirmation */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading">Take payment</DialogTitle>
            <DialogDescription>
              Total due is{" "}
              <span className="nums font-semibold text-foreground">
                {peso(cartSubtotal)}
              </span>
              .
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { id: "cash", label: "Cash", icon: Banknote },
                  { id: "gcash", label: "GCash", icon: Smartphone },
                  { id: "maya", label: "Maya", icon: Smartphone },
                ] as const
              ).map((m) => (
                <Button
                  key={m.id}
                  type="button"
                  variant={method === m.id ? "default" : "outline"}
                  onClick={() => setMethod(m.id)}
                  className="justify-start"
                >
                  <m.icon className="size-4" />
                  {m.label}
                </Button>
              ))}
            </div>

            {method === "cash" && (
              <div className="space-y-3">
                <Input
                  value={tendered}
                  onChange={(e) => setTendered(e.target.value.replace(/[^\d.]/g, ""))}
                  inputMode="decimal"
                  placeholder="Amount tendered"
                  className="nums h-11"
                />
                <div className="flex flex-wrap gap-2">
                  {quickCash.map((v) => (
                    <Button
                      key={v}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setTendered(String(v))}
                      className="nums"
                    >
                      {peso(v)}
                    </Button>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setTendered(String(cartSubtotal))}
                    className="nums"
                  >
                    Exact
                  </Button>
                </div>
                {hasTendered && (
                  <div
                    className={`flex items-center justify-between rounded-md px-4 py-3 ${
                      short
                        ? "bg-destructive/10 text-destructive"
                        : "bg-brand-tint text-accent-foreground"
                    }`}
                  >
                    <span className="text-sm">
                      {short ? "Still owed" : "Change due"}
                    </span>
                    <span className="nums font-heading text-lg font-bold">
                      {peso(short ? shortfall : changeDue)}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={complete} disabled={!canComplete}>
              Complete sale
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
