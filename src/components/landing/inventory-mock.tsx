import { Search, TriangleAlert, ArrowDownToLine } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { peso, qty } from "@/lib/format";

/**
 * The inventory half of the hero screenshot. Paired with PosMock so the
 * full-width app window shows both halves of the product: what is left on
 * the shelf, and what happens at the counter.
 *
 * Same rules as PosMock — built from the real /inventory primitives, no
 * interaction, and `reorderLevel` decides the state so the warnings match the
 * rule the app itself uses. Red stays on stock states only.
 */
const ROWS = [
  { name: "Skyflakes 250g", stock: 4, reorder: 6, unit: "box", price: 30 },
  { name: "Kopiko 3-in-1 Coffee", stock: 0, reorder: 12, unit: "pc", price: 8 },
  { name: "Coca-Cola 1.5L", stock: 22, reorder: 12, unit: "pc", price: 90 },
  { name: "San Miguel Pale Pilsen 320ml", stock: 48, reorder: 12, unit: "pc", price: 35 },
  { name: "Indomie Chicken 85g", stock: 120, reorder: 24, unit: "pc", price: 15 },
];

type State = "out" | "low" | "healthy";

function stateOf(stock: number, reorder: number): State {
  if (stock === 0) return "out";
  if (stock <= reorder) return "low";
  return "healthy";
}

function StockBadge({ state, label }: { state: State; label: string }) {
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
        {label}
      </Badge>
    );
  return (
    <Badge variant="outline" className="text-muted-foreground">
      {label}
    </Badge>
  );
}

function Row({ row: r }: { row: (typeof ROWS)[number] }) {
  const state = stateOf(r.stock, r.reorder);
  // A full bar means comfortably above the reorder point, so the length reads
  // as "how far from running out" at a glance.
  const fill = Math.min(100, (r.stock / (r.reorder * 2)) * 100);

  return (
    <div className="flex items-center gap-3 py-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{r.name}</p>
        <p className="nums text-xs text-muted-foreground">
          {peso(r.price)} · reorder at {qty(r.reorder)} {r.unit}
        </p>
        <span
          aria-hidden
          className="mt-2 block h-1 w-full max-w-40 overflow-hidden rounded-full bg-muted"
        >
          <span
            className={
              state === "healthy"
                ? "block h-full rounded-full bg-brand/60"
                : "block h-full rounded-full bg-destructive/70"
            }
            style={{ width: `${Math.max(fill, 4)}%` }}
          />
        </span>
      </div>
      <p className="nums shrink-0 text-sm font-medium">
        {state === "out" ? "—" : `${qty(r.stock)} ${r.unit}`}
      </p>
      <StockBadge
        state={state}
        label={state === "low" ? `Low · ${qty(r.stock)}` : "In stock"}
      />
    </div>
  );
}

export function InventoryMock() {
  const needsRestock = ROWS.filter((r) => stateOf(r.stock, r.reorder) !== "healthy").length;

  return (
    <Card className="w-full overflow-hidden shadow-sm">
      <div className="border-b bg-paper px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-heading text-base font-bold">Inventory</p>
            <p className="nums text-xs text-muted-foreground">
              36 products · {needsRestock} need restock
            </p>
          </div>
          <Badge
            variant="outline"
            className="border-brand/30 bg-brand-tint text-brand-strong"
          >
            Sari-sari Store
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

      <div className="grid gap-x-6 px-5 md:grid-cols-2">
        <div className="divide-y">
          {ROWS.slice(0, 3).map((r) => (
            <Row key={r.name} row={r} />
          ))}
        </div>
        <div className="divide-y">
          {ROWS.slice(3).map((r) => (
            <Row key={r.name} row={r} />
          ))}
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-between gap-3 bg-paper px-5 py-4">
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          {needsRestock > 0 ? (
            <TriangleAlert className="size-4 text-destructive" />
          ) : (
            <ArrowDownToLine className="size-4 text-brand-strong" />
          )}
          {needsRestock} to restock
        </span>
        <span className="rounded-md border bg-card px-2.5 py-1.5 text-xs font-medium">
          Restock list
        </span>
      </div>
    </Card>
  );
}
