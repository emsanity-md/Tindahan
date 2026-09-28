import { Search, Minus, Plus, Trash2, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { peso, qty } from "@/lib/format";

/**
 * A static illustration of the checkout screen, built from the same primitives
 * the real /pos route uses — so the landing page can never drift from the app.
 * Not interactive by design: the real thing is one click away.
 */
const MOCK_ROWS = [
  { name: "San Miguel Pale Pilsen 320ml", price: 35, stock: "48 pc", state: "healthy" },
  { name: "Indomie Chicken 85g", price: 15, stock: "120 pc", state: "healthy" },
  { name: "Skyflakes 250g", price: 30, stock: "4 box", state: "low" },
  { name: "Coca-Cola 1.5L", price: 90, stock: "22 pc", state: "healthy" },
];

const MOCK_CART = [
  { name: "Indomie Chicken 85g", qtyn: 3, total: 45 },
  { name: "Bottled Water 500ml", qtyn: 2, total: 30 },
  { name: "Piattos Beef 60g", qtyn: 1, total: 25 },
];

function StockBadge({ state, stock }: { state: string; stock: string }) {
  if (state === "out")
    return (
      <Badge variant="outline" className="border-destructive/40 text-destructive">
        Out
      </Badge>
    );
  if (state === "low")
    return (
      <Badge
        variant="outline"
        className="border-destructive/30 bg-destructive/5 text-destructive"
      >
        Low · {stock}
      </Badge>
    );
  return (
    <Badge variant="outline" className="text-muted-foreground">
      {stock}
    </Badge>
  );
}

export function PosMock() {
  const subtotal = MOCK_CART.reduce((s, l) => s + l.total, 0);

  return (
    <Card className="w-full overflow-hidden shadow-sm">
      {/* Checkout pane */}
      <div className="border-b bg-paper px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-heading text-base font-bold">Checkout</p>
            <p className="text-xs text-muted-foreground">Sari-sari Store</p>
          </div>
          <Badge
            variant="outline"
            className="border-brand/30 bg-brand-tint text-brand-strong"
          >
            Tindahan Demo Mode
          </Badge>
        </div>
        <div className="relative mt-4">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            readOnly
            tabIndex={-1}
            placeholder="Search products by name"
            className="pointer-events-none bg-card pl-9"
          />
        </div>
      </div>

      {/* Product list */}
      <div className="divide-y">
        {MOCK_ROWS.map((r) => (
          <div key={r.name} className="flex items-center gap-3 px-5 py-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{r.name}</p>
              <p className="nums text-xs text-muted-foreground">{peso(r.price)}</p>
            </div>
            <StockBadge state={r.state} stock={r.stock} />
            <Button
              size="icon"
              variant="outline"
              className="pointer-events-none size-8 shrink-0"
              tabIndex={-1}
            >
              <Plus className="size-4" />
            </Button>
          </div>
        ))}
      </div>

      <Separator />

      {/* Cart */}
      <div className="bg-paper px-5 py-4">
        <p className="font-heading text-sm font-bold">Current sale</p>
        <div className="mt-3 space-y-2.5">
          {MOCK_CART.map((l) => (
            <div key={l.name} className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{l.name}</p>
                <p className="nums text-xs text-muted-foreground">
                  {qty(l.qtyn)} × {peso(l.total / l.qtyn)}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="grid size-6 place-items-center rounded border bg-card text-muted-foreground">
                  <Minus className="size-3" />
                </span>
                <span className="nums w-5 text-center text-sm font-medium">
                  {qty(l.qtyn)}
                </span>
                <span className="grid size-6 place-items-center rounded border bg-card text-muted-foreground">
                  <Plus className="size-3" />
                </span>
              </div>
              <span className="nums w-14 text-right text-sm font-medium">
                {peso(l.total)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-1.5 border-t pt-3 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span className="nums">{peso(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-heading font-bold">Total</span>
            <span className="nums font-heading text-lg font-bold text-brand-strong">
              {peso(subtotal)}
            </span>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            className="pointer-events-none flex-1"
            size="lg"
            tabIndex={-1}
          >
            <Check className="size-4" />
            Charge {peso(subtotal)}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="pointer-events-none size-9 self-start"
            tabIndex={-1}
            aria-label="Clear cart"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
