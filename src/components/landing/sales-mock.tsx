import { TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { peso, qty } from "@/lib/format";

/**
 * The sales half of the hero window. Mirrors the real /sales screen — the
 * three stat cards, revenue by day, top sellers, then the transaction log —
 * so the landing page can't advertise a screen the app doesn't have.
 *
 * Numbers are static, but they go through `peso` and `qty` so the grouping
 * and tabular-figure rules hold here too.
 */
const STATS = [
  { label: "Total revenue", value: peso(18420), accent: true },
  { label: "Items sold", value: qty(214) },
  { label: "Average sale", value: peso(184) },
];

const DAYS = [
  { label: "Fri, Sep 26", amount: 6850 },
  { label: "Sat, Sep 27", amount: 5120 },
  { label: "Sun, Sep 28", amount: 6450 },
];

const TOP = [
  { name: "Coca-Cola 1.5L", sold: 22, revenue: 1980 },
  { name: "San Miguel Pale Pilsen 320ml", sold: 31, revenue: 1085 },
  { name: "Indomie Chicken 85g", sold: 48, revenue: 720 },
  { name: "Bottled Water 500ml", sold: 64, revenue: 960 },
  { name: "Skyflakes 250g", sold: 18, revenue: 540 },
];

const TXNS = [
  {
    no: "TXN-1042",
    when: "Sep 28, 10:24 AM",
    items: "Indomie Chicken ×3 · Bottled Water ×2",
    total: 75,
  },
  {
    no: "TXN-1041",
    when: "Sep 28, 10:11 AM",
    items: "Coca-Cola 1.5L ×2 · Piattos Beef ×1",
    total: 205,
  },
  {
    no: "TXN-1040",
    when: "Sep 28, 9:58 AM",
    items: "San Miguel Pale Pilsen ×6",
    total: 210,
  },
];

export function SalesMock() {
  const best = Math.max(...DAYS.map((d) => d.amount));

  return (
    <Card className="w-full overflow-hidden shadow-sm">
      <div className="border-b bg-paper px-5 py-4">
        <p className="font-heading text-base font-bold">Sales</p>
        <p className="nums text-xs text-muted-foreground">
          24 recorded transactions in this session
        </p>
      </div>

      <div className="grid grid-cols-3 divide-x">
        {STATS.map((s) => (
          <div key={s.label} className="px-4 py-3.5">
            <p className="truncate text-xs text-muted-foreground">{s.label}</p>
            <p
              className={
                s.accent
                  ? "nums font-heading mt-0.5 text-xl font-bold text-brand-strong"
                  : "nums font-heading mt-0.5 text-xl font-bold"
              }
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <Separator />

      <div className="grid divide-y md:grid-cols-2 md:divide-x md:divide-y-0">
        <div className="px-5 py-4">
          <p className="flex items-center gap-2 text-sm font-medium">
            <TrendingUp className="size-4 text-brand-strong" />
            Revenue by day
          </p>
          <div className="mt-4 space-y-3">
            {DAYS.map((d) => (
              <div key={d.label}>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="truncate text-muted-foreground">{d.label}</span>
                  <span className="nums shrink-0 font-medium">{peso(d.amount)}</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-brand"
                    style={{ width: `${(d.amount / best) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-5 py-4">
          <p className="text-sm font-medium">Top sellers</p>
          <ol className="mt-4 space-y-2.5">
            {TOP.map((t, i) => (
              <li key={t.name} className="flex items-center gap-3 text-sm">
                <span className="nums grid size-5 shrink-0 place-items-center rounded bg-secondary text-xs text-muted-foreground">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1 truncate">{t.name}</span>
                <span className="nums shrink-0 text-muted-foreground">
                  {qty(t.sold)}
                </span>
                <span className="nums w-20 shrink-0 text-right font-medium">
                  {peso(t.revenue)}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <Separator />

      <div className="bg-paper px-5 py-4">
        <p className="text-sm font-medium">Transaction log</p>
        <div className="mt-3 divide-y overflow-hidden rounded-md border bg-card">
          {TXNS.map((t) => (
            <div key={t.no} className="flex items-center gap-3 px-3 py-2.5">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="nums text-xs font-semibold">{t.no}</span>
                  <Badge variant="secondary" className="text-xs">
                    Sample
                  </Badge>
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {t.items} · {t.when}
                </p>
              </div>
              <span className="nums shrink-0 text-sm font-semibold">
                {peso(t.total)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
