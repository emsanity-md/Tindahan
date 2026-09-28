import type { Product } from "./data";

/**
 * Philippine peso formatting.
 *
 * U+20B1 (₱, PHILIPPINE PESO SIGN) is the symbol the Philippines uses. It is
 * easily confused with U+20B6 (₶, FULLWIDTH COLON SIGN), which is a CJK-width
 * colon and not a currency sign at all. Written as an escape so the codepoint
 * can't be mangled by file encoding.
 */
const PESO = "\u20B1";

/** Grouping only; fractional peso keeps two decimals the way cash does. */
export function peso(n: number): string {
  return `${PESO}${n.toLocaleString("en-PH", {
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Drops trailing zeros so 24.5 kg reads "24.5" and 12 kg reads "12". */
export function qty(n: number): string {
  return Number.isInteger(n) ? String(n) : String(Math.round(n * 1000) / 1000);
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-PH", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-PH", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function dayKey(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function formatDayLabel(iso: string): string {
  return new Date(iso).toLocaleDateString("en-PH", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/**
 * Subsequence match: every query character appears in order, not necessarily
 * adjacent. This is what makes "sanmig" find "San Miguel" — a store owner
 * types the sound, not the exact spelling.
 *
 * A compactness guard stops short queries from matching everything: the
 * matched characters must fill at least half the span they cover.
 */
function subsequence(haystack: string, needle: string): number | null {
  let i = 0;
  let start = -1;
  let last = -1;

  for (let j = 0; j < haystack.length && i < needle.length; j++) {
    if (haystack[j] !== needle[i]) continue;
    if (start === -1) start = j;
    last = j;
    i++;
  }

  if (i < needle.length) return null;
  const span = last - start + 1;
  if (span > needle.length * 2) return null;
  return span;
}

/**
 * Fuzzy product search.
 *
 * With no barcode to scan, typing is the only way to find something — so this
 * is the load-bearing interaction at the counter, not a nicety.
 *
 * Ranked: name prefix beats word-prefix beats substring beats subsequence,
 * then nickname aliases, then shorter names. So the obvious product wins.
 */
export function searchProducts(
  products: Product[],
  query: string,
  limit = 24,
): Product[] {
  const q = query.trim().toLowerCase();
  const pool = products.filter((p) => p.active);
  if (!q) return pool.slice(0, limit);

  const scored: { p: Product; score: number }[] = [];

  for (const p of pool) {
    const name = p.name.toLowerCase();
    const idx = name.indexOf(q);

    let score: number | null = null;

    if (idx === 0) {
      score = 0; // the query opens the name
    } else if (idx > 0 && /[\s(\-]/.test(name[idx - 1] ?? " ")) {
      score = 1; // starts a word inside the name
    } else if (idx > 0) {
      score = 2; // contiguous mid-name substring
    } else {
      const span = subsequence(name, q);
      if (span !== null) score = 3 + span / 1000;
    }

    // Nicknames are a last resort: a real name match always outranks them.
    if (score === null && p.aliases?.length) {
      for (const a of p.aliases) {
        const al = a.toLowerCase();
        if (al === q) {
          score = 5;
          break;
        }
        if (al.startsWith(q)) {
          score = 6;
          break;
        }
        if (al.includes(q)) {
          score = 7;
          break;
        }
      }
    }

    if (score === null) continue;
    scored.push({ p, score: score + name.length / 1000 });
  }

  return scored
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map((s) => s.p);
}
