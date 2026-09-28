import { INITIAL_PRODUCTS, type Sale, type SaleItem, type PaymentMethod } from "./data";

/**
 * Deterministic 3-day sales history so /sales and the Recent Sales panel have
 * something true to show on first load. A fixed-seed PRNG keeps the demo
 * identical on every reload instead of reshuffling each time.
 */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Weighted so everyday items sell often and shelf stock sells rarely — the
// shape a real sari-sari store actually produces.
const DEMAND_WEIGHT: Record<string, number> = {
  p08: 22, p03: 18, p01: 16, p02: 14, p16: 13, p11: 12, p09: 12,
  p04: 10, p21: 9, p17: 9, p12: 8, p22: 8, p25: 8, p33: 8,
  p05: 7, p19: 7, p20: 7, p24: 6, p15: 6, p13: 6, p18: 6,
  p06: 5, p07: 4, p10: 5, p14: 5, p23: 4, p26: 4, p27: 4,
  p28: 3, p29: 3, p30: 4, p31: 3, p32: 4, p34: 3, p35: 3, p36: 1,
};

const DAY_MS = 86_400_000;

/** Anchored to a fixed date so the demo never drifts with the wall clock. */
const SEED_NOW = new Date("2026-09-28T17:30:00+08:00").getTime();

export function buildSeedSales(): Sale[] {
  const rand = mulberry32(20260928);
  const sellable = INITIAL_PRODUCTS.filter(
    (p) => p.active && p.stock > 0 && (DEMAND_WEIGHT[p.id] ?? 0) > 0,
  );
  const pool = sellable.flatMap((p) =>
    Array.from({ length: DEMAND_WEIGHT[p.id] }, () => p),
  );

  const sales: Sale[] = [];
  let receipt = 1000;

  for (let dayOffset = 2; dayOffset >= 0; dayOffset--) {
    // Today is partial (we're mid-afternoon), so it gets fewer sales.
    const salesToday = dayOffset === 0 ? 14 : 18 + Math.floor(rand() * 6);
    for (let i = 0; i < salesToday; i++) {
      const first = Math.floor(rand() * pool.length);
      const lineCount = 1 + Math.floor(rand() * 3);
      const chosen = new Set<string>();

      const items: SaleItem[] = [];
      for (let l = 0; l < lineCount; l++) {
        const product = pool[(first + l * 3) % pool.length];
        if (chosen.has(product.id)) continue;
        chosen.add(product.id);

        // Rice and oil move in fractions; shelf items move in whole units.
        const fractional = product.unit === "kg" || product.unit === "ml";
        const quantity = fractional
          ? Math.round((0.5 + rand() * 2) * 2) / 2
          : 1 + Math.floor(rand() * 3);

        items.push({
          productId: product.id,
          name: product.name,
          quantity,
          unitPrice: product.sellingPrice,
          lineTotal: Math.round(quantity * product.sellingPrice * 100) / 100,
        });
      }
      if (items.length === 0) continue;

      const subtotal =
        Math.round(items.reduce((s, it) => s + it.lineTotal, 0) * 100) / 100;
      const total = Math.round(subtotal * 100) / 100;
      const isCash = rand() > 0.35;
      const amountTendered = isCash
        ? Math.ceil(total / 50) * 50
        : total;

      // Spread across trading hours, 7am to 9pm.
      const dayStart = SEED_NOW - dayOffset * DAY_MS;
      const startOfDay = new Date(dayStart);
      startOfDay.setHours(7, 0, 0, 0);
      const at = new Date(
        startOfDay.getTime() + rand() * 14 * 60 * 60 * 1000,
      );

      sales.push({
        id: `seed-${dayOffset}-${i}`,
        receiptNo: `R-${receipt++}`,
        items,
        subtotal,
        total,
        paymentMethod: isCash ? "cash" : rand() > 0.5 ? "gcash" : "maya",
        amountTendered,
        changeDue: Math.round((amountTendered - total) * 100) / 100,
        createdAt: at.toISOString(),
      });
    }
  }

  return sales.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export const SEED_SALES: Sale[] = buildSeedSales();

export type { PaymentMethod };
