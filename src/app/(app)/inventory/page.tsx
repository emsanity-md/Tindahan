"use client";

import { useMemo, useState } from "react";
import { Search, Minus, Plus, PackageCheck } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { stockState, type Product } from "@/lib/data";
import { peso, qty, searchProducts } from "@/lib/format";

type Filter = "all" | "low" | "out";

function StateBadge({ p }: { p: Product }) {
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
        Running low
      </Badge>
    );
  return <Badge variant="secondary">In stock</Badge>;
}

export default function InventoryPage() {
  const { products, dispatch } = useStore();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const results = useMemo(() => {
    const found = searchProducts(products, query, 200);
    if (filter === "all") return found;
    if (filter === "out") return found.filter((p) => p.stock <= 0);
    return found.filter((p) => stockState(p) === "low");
  }, [products, query, filter]);

  const counts = useMemo(
    () => ({
      all: products.filter((p) => p.active).length,
      low: products.filter((p) => stockState(p) === "low").length,
      out: products.filter((p) => p.stock <= 0).length,
    }),
    [products],
  );

  const adjust = (p: Product, delta: number) => {
    dispatch({ type: "adjustStock", productId: p.id, stock: p.stock + delta });
  };

  const restock = (p: Product) => {
    const target = Math.max(p.reorderLevel * 3, 10);
    dispatch({ type: "adjustStock", productId: p.id, stock: target });
    toast.success(`Restocked ${p.name}`, {
      description: `Stock set to ${qty(target)} ${p.unit}.`,
    });
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-gutter py-8 md:px-gutter-md md:py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl">Inventory</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {counts.all} products · {counts.low} running low · {counts.out} out of
            stock
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products by name"
            className="h-11 pl-9"
          />
        </div>
        <div className="flex gap-1 rounded-lg border p-1">
          {(
            [
              { id: "all", label: "All", n: counts.all },
              { id: "low", label: "Low", n: counts.low },
              { id: "out", label: "Out", n: counts.out },
            ] as const
          ).map((f) => (
            <Button
              key={f.id}
              size="sm"
              variant={filter === f.id ? "secondary" : "ghost"}
              onClick={() => setFilter(f.id)}
              className="gap-1.5"
            >
              {f.label}
              <span className="nums text-xs text-muted-foreground">{f.n}</span>
            </Button>
          ))}
        </div>
      </div>

      <Card className="mt-5 overflow-hidden">
        <div className="divide-y">
          {results.length === 0 && (
            <p className="px-4 py-12 text-center text-sm text-muted-foreground">
              No products match your search.
            </p>
          )}

          {results.map((p) => (
            <div
              key={p.id}
              className="flex flex-wrap items-center gap-3 p-4 md:flex-nowrap"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{p.name}</p>
                <p className="nums mt-0.5 text-xs text-muted-foreground">
                  {p.category} · cost {peso(p.costPrice)} · sells{" "}
                  {peso(p.sellingPrice)}
                </p>
              </div>

              <StateBadge p={p} />

              <div className="flex w-full items-center justify-between gap-3 md:w-auto md:justify-end">
                <div className="flex items-center gap-1 rounded-md border p-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-7"
                    onClick={() => adjust(p, -1)}
                    aria-label={`Decrease ${p.name}`}
                  >
                    <Minus className="size-3.5" />
                  </Button>
                  <span className="nums w-16 text-center text-sm font-semibold">
                    {qty(p.stock)} {p.unit}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-7"
                    onClick={() => adjust(p, 1)}
                    aria-label={`Increase ${p.name}`}
                  >
                    <Plus className="size-3.5" />
                  </Button>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => restock(p)}
                  className="shrink-0"
                >
                  <PackageCheck className="size-4" />
                  Restock
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
