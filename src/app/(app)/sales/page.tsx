"use client";

import { useMemo, useState } from "react";
import { Search, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import {
  dayKey,
  formatDateTime,
  formatDayLabel,
  peso,
  qty,
} from "@/lib/format";

export default function SalesPage() {
  const { sales, products } = useStore();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sales;
    return sales.filter(
      (s) =>
        s.receiptNo.toLowerCase().includes(q) ||
        s.items.some((i) => i.name.toLowerCase().includes(q)),
    );
  }, [sales, query]);

  const stats = useMemo(() => {
    const total = sales.reduce((s, x) => s + x.total, 0);
    const units = sales.reduce(
      (s, x) => s + x.items.reduce((n, i) => n + i.quantity, 0),
      0,
    );

    const byProduct = new Map<string, { name: string; qty: number; revenue: number }>();
    for (const s of sales) {
      for (const i of s.items) {
        const cur = byProduct.get(i.productId) ?? {
          name: i.name,
          qty: 0,
          revenue: 0,
        };
        cur.qty += i.quantity;
        cur.revenue += i.lineTotal;
        byProduct.set(i.productId, cur);
      }
    }

    const top = [...byProduct.values()].sort((a, b) => b.qty - a.qty).slice(0, 5);

    // Revenue by day, oldest first, for the summary strip.
    const byDay = new Map<string, number>();
    for (const s of sales) {
      byDay.set(dayKey(s.createdAt), (byDay.get(dayKey(s.createdAt)) ?? 0) + s.total);
    }
    const days = [...byDay.entries()].sort(([a], [b]) => a.localeCompare(b));

    return { total, units, top, days, count: sales.length };
  }, [sales]);

  const lowStock = products.filter(
    (p) => p.stock <= 0 || p.stock <= p.reorderLevel,
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-gutter py-8 md:px-gutter-md md:py-10">
      <div>
        <h1 className="text-2xl">Sales</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {stats.count} recorded transactions in this session
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card className="shadow-xs">
          <div className="p-5">
            <p className="text-sm text-muted-foreground">Total revenue</p>
            <p className="nums font-heading mt-1 text-3xl font-bold text-brand-strong">
              {peso(stats.total)}
            </p>
          </div>
        </Card>
        <Card className="shadow-xs">
          <div className="p-5">
            <p className="text-sm text-muted-foreground">Items sold</p>
            <p className="nums font-heading mt-1 text-3xl font-bold">
              {qty(stats.units)}
            </p>
          </div>
        </Card>
        <Card className="shadow-xs">
          <div className="p-5">
            <p className="text-sm text-muted-foreground">Average sale</p>
            <p className="nums font-heading mt-1 text-3xl font-bold">
              {peso(stats.count ? stats.total / stats.count : 0)}
            </p>
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Card className="shadow-xs">
          <div className="p-5">
            <p className="flex items-center gap-2 text-sm font-medium">
              <TrendingUp className="size-4 text-brand-strong" />
              Revenue by day
            </p>
            <div className="mt-4 space-y-3">
              {stats.days.map(([key, amount]) => {
                const max = Math.max(...stats.days.map((d) => d[1]));
                return (
                  <div key={key}>
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="text-muted-foreground">
                        {formatDayLabel(key)}
                      </span>
                      <span className="nums font-medium">{peso(amount)}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-brand"
                        style={{ width: `${(amount / max) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        <Card className="shadow-xs">
          <div className="p-5">
            <p className="text-sm font-medium">Top sellers</p>
            <ol className="mt-4 space-y-2.5">
              {stats.top.map((t, i) => (
                <li key={t.name} className="flex items-center gap-3 text-sm">
                  <span className="nums grid size-5 shrink-0 place-items-center rounded bg-secondary text-xs text-muted-foreground">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{t.name}</span>
                  <span className="nums shrink-0 text-muted-foreground">
                    {qty(t.qty)}
                  </span>
                  <span className="nums w-20 shrink-0 text-right font-medium">
                    {peso(t.revenue)}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-lg">Transaction log</h2>
        <div className="relative mt-3">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by receipt number or product"
            className="h-11 pl-9"
          />
        </div>

        <Card className="mt-4 overflow-hidden">
          <div className="divide-y">
            {filtered.length === 0 && (
              <p className="px-4 py-12 text-center text-sm text-muted-foreground">
                No transactions match your search.
              </p>
            )}
            {filtered.slice(0, 40).map((s) => (
              <div key={s.id} className="flex flex-wrap items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="nums text-sm font-semibold">{s.receiptNo}</span>
                    <Badge
                      variant="outline"
                      className="text-xs text-muted-foreground capitalize"
                    >
                      {s.paymentMethod}
                    </Badge>
                    {s.id.startsWith("seed-") && (
                      <Badge variant="secondary" className="text-xs">
                        Sample
                      </Badge>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {s.items
                      .map((i) => `${i.name.split(" ").slice(0, 2).join(" ")} ×${qty(i.quantity)}`)
                      .join(" · ")}
                  </p>
                </div>
                <span className="nums shrink-0 text-sm text-muted-foreground">
                  {formatDateTime(s.createdAt)}
                </span>
                <span className="nums w-24 shrink-0 text-right text-sm font-semibold">
                  {peso(s.total)}
                </span>
              </div>
            ))}
          </div>
        </Card>
        {filtered.length > 40 && (
          <p className="nums mt-3 text-center text-sm text-muted-foreground">
            Showing 40 of {filtered.length} transactions
          </p>
        )}
      </div>

      {lowStock.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg">Needs restocking</h2>
          <Card className="mt-3 overflow-hidden">
            <div className="divide-y">
              {lowStock.map((p) => (
                <div key={p.id} className="flex items-center gap-3 p-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{p.name}</p>
                    <p className="nums text-xs text-muted-foreground">
                      Reorder at {qty(p.reorderLevel)} {p.unit}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <a href="/inventory">Restock</a>
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
