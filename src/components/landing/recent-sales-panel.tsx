"use client";

import { SaleFeed, SaleFeedItem } from "@/components/SaleFeed";
import { useStore } from "@/lib/store";
import { formatTime, peso } from "@/lib/format";

/**
 * Seeded sales rendered through the animated feed, so entries settle in as the
 * panel scrolls into view. Falls back to a plain list under reduced motion.
 */
export function RecentSalesPanel() {
  const { sales } = useStore();
  const recent = sales.slice(0, 5);

  return (
    <div className="max-h-64 overflow-y-auto">
      <SaleFeed>
        {recent.map((s, i) => (
          <SaleFeedItem key={s.id} delay={i * 0.05}>
            <div className="flex items-center gap-3 rounded-md border bg-card px-3 py-2.5">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {s.items
                    .map((it) => it.name.split(" ").slice(0, 2).join(" "))
                    .join(", ")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {s.receiptNo} · {formatTime(s.createdAt)}
                </p>
              </div>
              <span className="nums shrink-0 text-sm font-semibold text-brand-strong">
                {peso(s.total)}
              </span>
            </div>
          </SaleFeedItem>
        ))}
      </SaleFeed>
    </div>
  );
}
